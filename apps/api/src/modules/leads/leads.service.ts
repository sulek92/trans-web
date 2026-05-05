import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { leads } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
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

  async updateLeadStatus(id: string, data: UpdateLeadStatusDto) {
    const [updated] = await db
      .update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!updated) throw new NotFoundException(`Lead with ID ${id} not found`);
    return updated;
  }
}
