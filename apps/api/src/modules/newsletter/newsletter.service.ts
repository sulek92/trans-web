import { Injectable, ConflictException } from '@nestjs/common';
import { db } from '../../db';
import { newsletterSubscribers } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class NewsletterService {
  async subscribe(email: string) {
    try {
      // Check if already exists
      const existing = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, email.toLowerCase()))
        .limit(1);

      if (existing.length > 0) {
        if (!existing[0].isActive) {
          // Re-activate
          return await db
            .update(newsletterSubscribers)
            .set({ isActive: true, updatedAt: new Date() })
            .where(eq(newsletterSubscribers.id, existing[0].id))
            .returning();
        }
        throw new ConflictException('Ten adres e-mail jest już zapisany.');
      }

      return await db
        .insert(newsletterSubscribers)
        .values({
          email: email.toLowerCase(),
        })
        .returning();
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new Error('Nie udało się zapisać do newslettera.');
    }
  }

  async unsubscribe(email: string) {
    return await db
      .update(newsletterSubscribers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(newsletterSubscribers.email, email.toLowerCase()))
      .returning();
  }

  async getSubscribers() {
    return await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));
  }
}
