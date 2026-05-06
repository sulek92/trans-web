import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

@Injectable()
export class ApiKeyService {
  async generateKey(userId: string): Promise<string> {
    const key = `pb_${randomBytes(24).toString('hex')}`;
    await db
      .update(users)
      .set({ apiKey: key, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return key;
  }

  async validateKey(key: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.apiKey, key))
      .limit(1);
    
    return user || null;
  }

  async revokeKey(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ apiKey: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
