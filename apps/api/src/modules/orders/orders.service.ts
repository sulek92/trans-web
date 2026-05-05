import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { db } from '../../db';
import { orders } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { randomInt } from 'node:crypto';

@Injectable()
export class OrdersService {
  async createOrder(data: CreateOrderDto) {
    // Generowanie numeru zamówienia: OR-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = randomInt(1000, 9999);
    const orderNumber = `OR-${dateStr}-${randomSuffix}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        carrierCode: 'mock-carrier', // docelowo z carrierOfferId
        carrierService: 'mock-service',
        senderAddress: data.senderData,
        recipientAddress: data.recipientData,
        palletData: { quoteId: data.quoteId },
        status: 'PENDING',
        priceNetto: '0.00', // docelowo z wyceny
        priceVat: '0.00',
        priceBrutto: '0.00',
      })
      .returning();

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      status: newOrder.status,
      paymentUrl: `https://checkout.stripe.com/mock/${newOrder.id}`,
    };
  }

  async getOrder(id: string) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async getAllOrders() {
    return db.select().from(orders);
  }

  async getMyOrders(userId: string) {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }
}
