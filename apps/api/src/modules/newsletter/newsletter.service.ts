import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { newsletterSubscribers } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class NewsletterService {
  ping(): string {
    return 'newsletter service ok';
  }

  async subscribe(email: string) {
    const normalized = email.toLowerCase().trim();
    await db
      .insert(newsletterSubscribers)
      .values({ email: normalized, isActive: true })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { isActive: true, updatedAt: new Date() },
      });
    return { success: true, email: normalized };
  }

  async getSubscribers(search?: string) {
    const query = db.select().from(newsletterSubscribers);
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      return db
        .select()
        .from(newsletterSubscribers)
        .where(sql`${newsletterSubscribers.email} ILIKE ${term}`)
        .orderBy(newsletterSubscribers.createdAt);
    }
    return db
      .select()
      .from(newsletterSubscribers)
      .orderBy(newsletterSubscribers.createdAt);
  }

  async getStats() {
    const [total] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(newsletterSubscribers);
    const [active] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true));
    return { total: total?.count ?? 0, active: active?.count ?? 0 };
  }

  async deleteSubscriber(id: string) {
    await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, id));
    return { success: true };
  }

  async sendNewsletter(_payload: any): Promise<boolean> {
    return true;
  }
}
