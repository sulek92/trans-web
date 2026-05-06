import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { orders } from '../../db/schema';
import { eq, gte, and, sql } from 'drizzle-orm';

@Injectable()
export class AnalyticsService {
  async getUserStats(userId: string) {
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

    return {
      totalOrders: totalOrders?.count || 0,
      recentSpend: recentSpend?.total || 0,
      carrierDistribution: carrierStats,
      statusDistribution: statusStats,
    };
  }

  async getAdminStats() {
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
        orderCount: sql<number>`count(*)`,
        totalSpend: sql<number>`sum(${orders.priceBrutto})`,
      })
      .from(orders)
      .groupBy(orders.userId)
      .orderBy(sql`sum(${orders.priceBrutto}) desc`)
      .limit(5);

    return {
      revenueByCurrency,
      ordersOverTime,
      topCustomers,
    };
  }
}
