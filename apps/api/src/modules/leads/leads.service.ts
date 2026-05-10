import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { leads } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotificationsService } from '../notifications/notifications.service';

type ActorContext = {
  userId?: string;
  email?: string;
};

@Injectable()
export class LeadsService {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createLead(data: CreateLeadDto) {
    const [newLead] = await db.insert(leads).values(data).returning();

    if (newLead) {
      // Notify Admin
      const isCustomQuote = newLead.leadType === 'custom_quote';
      await this.notificationsService.sendMail({
        to: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
        subject: isCustomQuote 
          ? `Zapytanie o wycenę indywidualną: ${newLead.name}`
          : `Nowe zapytanie od: ${newLead.name}`,
        html: `
          <h3>Otrzymano ${isCustomQuote ? 'zapytanie o wycenę' : 'nowego leada'}</h3>
          <p><strong>Od:</strong> ${newLead.name} (${newLead.email})</p>
          <p><strong>Firma:</strong> ${newLead.company || 'Brak'}</p>
          <p><strong>Opis:</strong> ${newLead.description}</p>
          <p><strong>Trasa:</strong> ${newLead.route || 'Nieokreślona'}</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leady" style="display:inline-block;padding:10px 20px;background:#123456;color:#fff;text-decoration:none;border-radius:8px;">Zobacz w panelu</a>
        `,
      });

      // Notify Client
      await this.notificationsService.sendMail({
        to: newLead.email,
        subject: 'PaletBroker - Otrzymaliśmy Twoje zapytanie',
        html: `
          <h3>Dziękujemy za kontakt!</h3>
          <p>Witaj ${newLead.name},</p>
          <p>Twoje zapytanie dotyczące transportu zostało przekazane do naszego działu wycen. Skontaktujemy się z Tobą tak szybko, jak to możliwe.</p>
          <p>Z poważaniem,<br>Zespół PaletBroker</p>
        `,
      });
    }

    return newLead;
  }

  async getLeads() {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: string) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!lead) throw new NotFoundException(`Lead with ID ${id} not found`);
    return lead;
  }

  async updateLeadStatus(
    id: string,
    data: UpdateLeadStatusDto,
    actor?: ActorContext,
  ) {
    const [updated] = await db
      .update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!updated) throw new NotFoundException(`Lead with ID ${id} not found`);

    await this.auditLogService.record({
      actorUserId: actor?.userId,
      actorEmail: actor?.email,
      action: 'lead.status_updated',
      entityType: 'lead',
      entityId: updated.id,
      metadata: {
        status: updated.status,
        assignedTo: updated.assignedTo,
      },
    });

    return updated;
  }

  async updateLeadNotes(id: string, notes: string, actor?: ActorContext) {
    const [updated] = await db
      .update(leads)
      .set({ notes, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!updated) throw new NotFoundException(`Lead with ID ${id} not found`);

    await this.auditLogService.record({
      actorUserId: actor?.userId,
      actorEmail: actor?.email,
      action: 'lead.notes_updated',
      entityType: 'lead',
      entityId: updated.id,
    });

    return updated;
  }
}
