import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomQuotesService {
  createCustomQuote(_data: Record<string, unknown>) {
    void _data;
    // 1. Zapis do DB: tabela custom_quotes ze statusem 'pending'
    // 2. Wysłanie powiadomienia e-mail do admina
    // 3. Wysłanie potwierdzenia przyjęcia zapytania do klienta
    return {
      success: true,
      quoteId: 'CQ-12345',
      message: 'Zapytanie zostało zapisane i przekazane do działu wycen.',
    };
  }

  getCustomQuotes() {
    // 1. Pobranie listy niestandardowych zapytań dla panelu admina
    return [{ id: 'CQ-12345', status: 'pending', date: new Date(), data: {} }];
  }
}
