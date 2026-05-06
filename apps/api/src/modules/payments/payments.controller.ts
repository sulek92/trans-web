import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.paymentsService.handleWebhook(
      signature,
      req.rawBody!,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId as string | undefined;
      if (orderId) {
        // Update order status to PAID
        const updatedOrder = await this.ordersService.updateStatus(
          orderId,
          'PAID',
        );

        // Generate Carrier Label (Async)
        void this.ordersService.generateLabel(orderId).catch((err) => {
          console.error(`Failed to generate label for order ${orderId}:`, err);
        });

        // Send payment confirmation email
        const email = (updatedOrder.senderAddress as any)?.email;
        if (email) {
          void this.notificationsService.sendPaymentConfirmation(
            email,
            updatedOrder.orderNumber,
            updatedOrder.priceBrutto ?? '',
          );
        }
      }
    }

    return { received: true, type: event.type };
  }
}
