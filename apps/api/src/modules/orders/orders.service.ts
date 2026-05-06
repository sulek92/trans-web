import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { db } from '../../db';
import { orders, quotes } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { randomInt } from 'node:crypto';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CarriersService } from '../carriers/carriers.service';
import { NotificationsGateway } from '../websockets/notifications.gateway';

import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService,
    private readonly carriersService: CarriersService,
    private readonly wsGateway: NotificationsGateway,
    @Inject(forwardRef(() => DocumentsService))
    private readonly documentsService: DocumentsService,
  ) {}

  async createOrder(data: CreateOrderDto, userId?: string) {
    // 1. Fetch Quote
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, data.quoteId));
    if (!quote)
      throw new NotFoundException(`Quote with ID ${data.quoteId} not found`);

    // 2. Find selected offer in results
    const results = (quote.results as any[]) || [];
    const offer = results.find((o) => o.carrierId === data.carrierOfferId);
    if (!offer)
      throw new BadRequestException(
        `Offer with ID ${data.carrierOfferId} not found in quote`,
      );

    // 3. Calculate final prices with additional services
    let priceNetto = parseFloat(offer.priceNetto);

    if (data.additionalServices?.insurance) {
      priceNetto += 25.0;
    }
    if (data.additionalServices?.cod) {
      priceNetto += 15.0;
    }

    const priceVat = priceNetto * 0.23;
    const priceBrutto = priceNetto + priceVat;

    // 4. Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = randomInt(1000, 9999);
    const orderNumber = `OR-${dateStr}-${randomSuffix}`;

    // 5. Save to DB
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: userId || null,
        quoteId: data.quoteId,
        carrierCode: offer.carrierCode,
        carrierService: offer.serviceName,
        senderAddress: data.senderData as any,
        recipientAddress: data.recipientData as any,
        palletData: {
          palletType: quote.palletType,
          weight: quote.weight,
          dimensions: {
            length: quote.length,
            width: quote.width,
            height: quote.height,
          },
        },
        additionalServices: data.additionalServices as any,
        status: 'PENDING',
        priceNetto: priceNetto.toFixed(2),
        priceVat: priceVat.toFixed(2),
        priceBrutto: priceBrutto.toFixed(2),
      })
      .returning();

    // 6. Create Payment Session
    const paymentUrl =
      await this.paymentsService.createCheckoutSession(newOrder);

    // 7. Send Notification (Async)
    const email = (newOrder.senderAddress as any)?.email;
    if (email) {
      void this.notificationsService.sendOrderConfirmation(email, newOrder);
    }

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      status: newOrder.status,
      paymentUrl,
    };
  }

  async getOrder(id: string) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async getMyOrder(id: string, userId: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, userId)));
    if (!order) throw new NotFoundException(`Order with ID ${id} not found or access denied`);
    return order;
  }

  async getAllOrders() {
    return db.select().from(orders);
  }

  async getMyOrders(userId: string) {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateStatus(id: string, status: string) {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) throw new NotFoundException(`Order with ID ${id} not found`);

    // Notify user
    const email = (updated.senderAddress as any)?.email;
    if (email) {
      void this.notificationsService.sendStatusUpdate(
        email,
        updated.orderNumber,
        status,
      );
    }

    // Real-time WS notification
    this.wsGateway.sendToOrder(updated.id, 'order_updated', updated);
    if (updated.userId) {
      this.wsGateway.sendToUser(updated.userId, 'notification', {
        title: 'Aktualizacja zamówienia',
        message: `Twoje zamówienie ${updated.orderNumber} zmieniło status na: ${status}`,
        type: 'info',
      });
    }

    return updated;
  }

  async bulkUpdateStatus(ids: string[], status: string) {
    const { sql } = await import('drizzle-orm');
    const updated = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(sql`${orders.id} = ANY(${ids})`)
      .returning();

    // Notify users
    for (const order of updated) {
      const email = (order.senderAddress as any)?.email;
      if (email) {
        void this.notificationsService.sendStatusUpdate(
          email,
          order.orderNumber,
          status,
        );
      }

      this.wsGateway.sendToOrder(order.id, 'order_updated', order);
      if (order.userId) {
        this.wsGateway.sendToUser(order.userId, 'notification', {
          title: 'Aktualizacja zamówienia',
          message: `Twoje zamówienie ${order.orderNumber} zmieniło status na: ${status}`,
          type: 'info',
        });
      }
    }

    return updated;
  }

  async generateLabel(orderId: string) {
    const order = await this.getOrder(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (order.carrierTrackingNumber) {
      return order; // Already generated
    }

    const response = await this.carriersService.createShipment(
      order.carrierCode,
      order,
    );

    if (response.success) {
      const [updated] = await db
        .update(orders)
        .set({
          carrierTrackingNumber: response.trackingNumber,
          carrierLabelUrl: response.labelUrl,
          status: 'IN_TRANSIT',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      // Notify user about status change
      const email = (updated.senderAddress as any)?.email;
      if (email) {
        void this.notificationsService.sendStatusUpdate(
          email,
          updated.orderNumber,
          'IN_TRANSIT',
        );
      }

      return updated;
    } else {
      throw new BadRequestException(`Carrier API Error: ${response.error}`);
    }
  }

  async bulkGenerateLabels(ids: string[]) {
    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        const res = await this.generateLabel(id);
        results.push(res);
      } catch (err) {
        errors.push({
          id,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async getOrdersByUser(userId: string) {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrderInvoicePdf(orderId: string, userId: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

    if (!order) throw new NotFoundException('Order not found');
    if (!order.invoiceId) throw new BadRequestException('Order has no invoice yet');

    return this.documentsService.generateInvoicePdf(order.invoiceId);
  }
}
