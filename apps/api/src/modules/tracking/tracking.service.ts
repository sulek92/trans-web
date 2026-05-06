import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { orders, trackingEvents } from '../../db/schema';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class TrackingService {
  async getTrackingInfo(trackingNumber: string) {
    // 1. Szukamy zamówienia po numerze lub ID
    const [order] = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.orderNumber, trackingNumber),
          eq(orders.id, trackingNumber as any) // uuid fallback
        )
      );

    if (!order) {
      throw new NotFoundException('Nie znaleziono przesyłki o podanym numerze');
    }

    // 2. Pobieramy zdarzenia śledzenia
    const events = await db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.orderId, order.id))
      .orderBy(trackingEvents.occurredAt);

    // 3. Mapowanie statusów jeśli brak zdarzeń (fallback dla MVP)
    const displayEvents = events.length > 0 
      ? events.map(e => ({
          date: e.occurredAt,
          status: e.internalStatus,
          description: e.carrierStatusDescription || e.carrierStatus,
          location: e.location,
        }))
      : [
          {
            date: order.createdAt,
            status: order.status,
            description: this.getStatusDescription(order.status),
            location: (order.senderAddress as any)?.city || 'Punkt Nadania',
          }
        ];

    return {
      trackingNumber: order.orderNumber,
      carrier: order.carrierCode,
      status: order.status,
      estimatedDelivery: order.status === 'DELIVERED' ? order.updatedAt : 'W trakcie ustalania',
      events: displayEvents,
    };
  }

  private getStatusDescription(status: string): string {
    switch (status) {
      case 'PENDING': return 'Oczekiwanie na potwierdzenie zamówienia';
      case 'PICKED_UP': return 'Przesyłka odebrana od nadawcy';
      case 'IN_TRANSIT': return 'Przesyłka w drodze do celu';
      case 'DELIVERED': return 'Przesyłka została doręczona';
      default: return 'Status zamówienia został zaktualizowany';
    }
  }
}
