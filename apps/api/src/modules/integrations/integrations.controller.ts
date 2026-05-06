import { Controller, Get, UseGuards, Param, Query, Req } from '@nestjs/common';
import { ApiKeyGuard } from '../api-key/api-key.guard';
import { OrdersService } from '../orders/orders.service';
import { TrackingService } from '../tracking/tracking.service';
import { QuoteService } from '../quote-engine/quote.service';

@Controller('v1/integrations')
@UseGuards(ApiKeyGuard)
export class IntegrationsController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly trackingService: TrackingService,
    private readonly quoteService: QuoteService,
  ) {}

  @Get('orders')
  async listOrders(@Req() req: any) {
    // For now, simple list. In production, add pagination.
    const allOrders = await this.ordersService.getOrdersByUser(req.user.sub);
    return allOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      carrier: o.carrierCode,
      trackingNumber: o.carrierTrackingNumber,
      priceBrutto: o.priceBrutto,
      createdAt: o.createdAt,
    }));
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string, @Req() req: any) {
    const order = await this.ordersService.getOrder(id);
    if (!order || order.userId !== req.user.sub) {
      return { error: 'Order not found or access denied' };
    }
    return order;
  }

  @Get('orders/:id/tracking')
  async getTracking(@Param('id') id: string, @Req() req: any) {
    const order = await this.ordersService.getOrder(id);
    if (!order || order.userId !== req.user.sub) {
      return { error: 'Order not found or access denied' };
    }
    return this.trackingService.getTrackingInfo(order.orderNumber);
  }
}
