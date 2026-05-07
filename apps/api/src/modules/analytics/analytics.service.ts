import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { orders, users } from '../../db/schema';
import { eq, gte, and, sql } from 'drizzle-orm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly redisService: RedisService) {}

  async getUserStats(userId: string) {
    const cacheKey = `analytics:user:${userId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalOrders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.userId, userId));

    const [recentSpend] = await db
      .select({ total: sql<number>`sum(${orders.priceBrutto})` })
      .from(orders)
      .where(
        and(eq(orders.userId, userId), gte(orders.createdAt, thirtyDaysAgo)),
      );

    const carrierStats = await db
      .select({
        carrier: orders.carrierCode,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(eq(orders.userId, userId))
      .groupBy(orders.carrierCode);

    const statusStats = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(eq(orders.userId, userId))
      .groupBy(orders.status);

    const result = {
      totalOrders: totalOrders?.count || 0,
      recentSpend: recentSpend?.total || 0,
      carrierDistribution: carrierStats,
      statusDistribution: statusStats,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 600);
    return result;
  }

  async getAdminStats() {
    const cacheKey = 'analytics:admin';
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueByCurrency = await db
      .select({
        currency: orders.currency,
        total: sql<number>`sum(${orders.priceBrutto})`,
      })
      .from(orders)
      .groupBy(orders.currency);

    const ordersOverTime = await db
      .select({
        date: sql<string>`date(${orders.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo))
      .groupBy(sql`date(${orders.createdAt})`)
      .orderBy(sql`date(${orders.createdAt})`);

    const topCustomers = await db
      .select({
        userId: orders.userId,
        email: users.email,
        orderCount: sql<number>`count(*)`,
        totalSpend: sql<number>`sum(${orders.priceBrutto})`,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .groupBy(orders.userId, users.email)
      .orderBy(sql`sum(${orders.priceBrutto}) desc`)
      .limit(5);

    const result = {
      revenueByCurrency,
      ordersOverTime,
      topCustomers,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 300);
    return result;
  }
}
