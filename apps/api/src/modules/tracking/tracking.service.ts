import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { orders, trackingEvents } from '../../db/schema';
import { eq, or } from 'drizzle-orm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TrackingService {
  constructor(private readonly redisService: RedisService) {}

  async getTrackingInfo(trackingNumber: string) {
    const cacheKey = `tracking:${trackingNumber}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.orderNumber, trackingNumber),
          eq(orders.id, trackingNumber as any),
        ),
      );

    if (!order) {
      throw new NotFoundException('Nie znaleziono przesyłki o podanym numerze');
    }

    const events = await db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.orderId, order.id))
      .orderBy(trackingEvents.occurredAt);

    const displayEvents =
      events.length > 0
        ? events.map((e) => ({
            date: e.occurredAt,
            status: e.internalStatus,
            description: e.carrierStatusDescription || e.carrierStatus,
            location: e.location,
          }))
        : [
            {
              date: order.createdAt,
              status: order.status,
              description: this.getStatusDescription(order.status ?? 'PENDING'),
              location: (order.senderAddress as any)?.city || 'Punkt Nadania',
            },
          ];

    const result = {
      trackingNumber: order.orderNumber,
      carrier: order.carrierCode,
      status: order.status,
      estimatedDelivery:
        order.status === 'DELIVERED' ? order.updatedAt : 'W trakcie ustalania',
      events: displayEvents,
    };

    const ttl = order.status === 'DELIVERED' ? 86400 : 300;
    await this.redisService.set(cacheKey, JSON.stringify(result), ttl);

    return result;
  }

  private getStatusDescription(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Oczekiwanie na potwierdzenie zamówienia';
      case 'PICKED_UP':
        return 'Przesyłka odebrana od nadawcy';
      case 'IN_TRANSIT':
        return 'Przesyłka w drodze do celu';
      case 'DELIVERED':
        return 'Przesyłka została doręczona';
      default:
        return 'Status zamówienia został zaktualizowany';
    }
  }
}
