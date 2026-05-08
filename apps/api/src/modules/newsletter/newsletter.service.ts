import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { newsletterSubscribers } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class NewsletterService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async subscribe(email: string) {
    const normalized = email.toLowerCase().trim();
    await db
      .insert(newsletterSubscribers)
      .values({ email: normalized, isActive: true })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { isActive: true, updatedAt: new Date() },
      });

    // Send welcome email
    await this.notificationsService.sendMail({
      to: normalized,
      subject: 'Witaj w newsletterze PaletBroker!',
      html: `
        <h3>Dziękujemy za zapisanie się!</h3>
        <p>Od teraz będziesz otrzymywać informacje o promocjach i nowościach w naszym serwisie.</p>
        <p>Twój zespół PaletBroker</p>
      `,
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

  async sendNewsletter(payload: {
    subject: string;
    content: string;
  }): Promise<boolean> {
    const subscribers = await this.getSubscribers();
    const activeSubscribers = subscribers.filter((s) => s.isActive);

    const results = await Promise.all(
      activeSubscribers.map((s) =>
        this.notificationsService.sendMail({
          to: s.email,
          subject: payload.subject,
          html: payload.content,
        }),
      ),
    );

    return results.every((r) => r);
  }
}
