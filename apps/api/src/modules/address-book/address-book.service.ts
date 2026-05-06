import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { addresses } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class AddressBookService {
  async getMyAddresses(userId: string) {
    return db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async addAddress(userId: string, data: any) {
    const [newAddress] = await db
      .insert(addresses)
      .values({
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newAddress;
  }

  async bulkAddAddresses(userId: string, dataArray: any[]) {
    const values = dataArray.map((item) => ({
      ...item,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return db.insert(addresses).values(values).returning();
  }

  async deleteAddress(userId: string, id: string) {
    const [deleted] = await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .returning();

    if (!deleted)
      throw new NotFoundException('Address not found or access denied');
    return deleted;
  }
}
