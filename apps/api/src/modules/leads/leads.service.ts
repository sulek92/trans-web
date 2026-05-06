import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { leads } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

type ActorContext = {
  userId?: string;
  email?: string;
};

@Injectable()
export class LeadsService {
  constructor(private readonly auditLogService: AuditLogService) {}

  async createLead(data: CreateLeadDto) {
    const [newLead] = await db.insert(leads).values(data).returning();
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
