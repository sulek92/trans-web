import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: any;
  private readonly logger = new Logger(PaymentsService.name);

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-01-27-preview.acacia' as any,
    });
  }

  async createCheckoutSession(order: any) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'blik', 'p24'] as any,
        line_items: [
          {
            price_data: {
              currency: 'pln',
              product_data: {
                name: `Zamówienie ${order.orderNumber}`,
                description: `Transport paletowy ${order.carrierCode}`,
              },
              unit_amount: Math.round(Number(order.priceBrutto) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/zamowienie/sukces?orderId=${order.id}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/zamowienie/${order.id}`,
        metadata: {
          orderId: order.id,
        },
      });

      return session.url;
    } catch (error) {
      this.logger.error(`Stripe Session Creation Failed: ${error.message}`);
      // Fallback for development if no key or mock key
      if (
        process.env.NODE_ENV !== 'production' ||
        !process.env.STRIPE_SECRET_KEY
      ) {
        return `https://checkout.stripe.com/mock/${order.id}`;
      }
      throw error;
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
      return event;
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw err;
    }
  }
}
