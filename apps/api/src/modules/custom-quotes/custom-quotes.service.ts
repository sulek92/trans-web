import { Injectable } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class CustomQuotesService {
  constructor(private readonly leadsService: LeadsService) {}

  async createCustomQuote(data: any) {
    // Map custom quote data to lead schema
    const leadData = {
      name: data.name || 'Klient Niestandardowy',
      email: data.email,
      phone: data.phone,
      company: data.company,
      description: `Wycena niestandardowa: ${JSON.stringify(data.palletData || {})}`,
      route: `${data.senderPostal || ''} -> ${data.recipientPostal || ''}`,
      status: 'NEW',
    };

    const newLead = await this.leadsService.createLead(leadData);

    return {
      success: true,
      quoteId: newLead.id,
      message: 'Twoje zapytanie o wycenę niestandardową zostało przyjęte.',
    };
  }

  async getCustomQuotes() {
    return this.leadsService.getLeads();
  }
}
