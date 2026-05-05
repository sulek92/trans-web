import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TrackingService {
  getTrackingInfo(trackingNumber: string) {
    if (
      !trackingNumber.startsWith('OR-') &&
      !trackingNumber.startsWith('TR-')
    ) {
      throw new NotFoundException('Nie znaleziono przesyłki');
    }

    // W MVP mockujemy ścieżkę trackingową zmapowaną ze statusów przewoźników
    return {
      trackingNumber,
      carrier: 'DHL',
      status: 'IN_TRANSIT',
      estimatedDelivery: '2026-05-07',
      events: [
        {
          date: '2026-05-06T02:15:00Z',
          status: 'IN_TRANSIT',
          description: 'Przesyłka w drodze do sortowni głównej',
          location: 'Łódź',
        },
        {
          date: '2026-05-05T14:30:00Z',
          status: 'PICKED_UP',
          description: 'Przesyłka odebrana przez kuriera',
          location: 'Warszawa',
        },
        {
          date: '2026-05-05T10:00:00Z',
          status: 'ORDER_PLACED',
          description: 'Zamówienie przyjęte w systemie',
          location: 'Warszawa',
        },
      ],
    };
  }
}
