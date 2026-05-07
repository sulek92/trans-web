import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { db } from '../../db';
import { orders, leads, users, pricingRules } from '../../db/schema';
import { count, sum, eq, or, ilike, gte } from 'drizzle-orm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Request } from 'express';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RedisService } from '../redis/redis.service';
import { OrdersService } from '../orders/orders.service';
import { ApiKeyService } from '../api-key/api-key.service';
import { AnalyticsService } from '../analytics/analytics.service';

type BulkActionPayload = {
  ids: string[];
  status?: string;
};

type PricingRulePayload = {
  id?: string;
  carrierCode: string;
  serviceName: string;
  basePrice: string;
  kmRate?: string;
  marginPercent?: string;
  minWeight?: string;
  maxWeight?: string;
  isActive?: boolean;
};

type AuthenticatedRequest = Request & {
  user?: { sub?: string; email?: string; role?: string };
};

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly redisService: RedisService,
    private readonly ordersService: OrdersService,
    private readonly apiKeyService: ApiKeyService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post('orders/bulk-status')
  async bulkStatusUpdate(@Body() body: BulkActionPayload) {
    if (!body.status) throw new Error('Status is required');
    return this.ordersService.bulkUpdateStatus(body.ids, body.status);
  }

  @Post('orders/bulk-label')
  async bulkLabelGeneration(@Body() body: { ids: string[] }) {
    return this.ordersService.bulkGenerateLabels(body.ids);
  }

  @Post('users/:id/api-key')
  async generateUserApiKey(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const key = await this.apiKeyService.generateKey(id);
    await this.auditLogService.record({
      actorUserId: req.user?.sub,
      actorEmail: req.user?.email,
      action: 'user.api_key_generated',
      entityType: 'user',
      entityId: id,
    });
    return { apiKey: key };
  }

  @Post('users/:id/api-key/revoke')
  async revokeUserApiKey(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.apiKeyService.revokeKey(id);
    await this.auditLogService.record({
      actorUserId: req.user?.sub,
      actorEmail: req.user?.email,
      action: 'user.api_key_revoked',
      entityType: 'user',
      entityId: id,
    });
    return { status: 'revoked' };
  }

  @Get('stats')
  async getStats() {
    const [ordersCount] = await db.select({ value: count() }).from(orders);
    const [leadsCount] = await db.select({ value: count() }).from(leads);
    const [usersCount] = await db.select({ value: count() }).from(users);

    // Suma przychodów (przykładowo)
    const [revenue] = await db
      .select({ value: sum(orders.priceBrutto) })
      .from(orders);

    return {
      stats: [
        {
          label: 'Przychód (Razem)',
          value: `${revenue?.value || '0.00'} PLN`,
          trend: 'N/A',
          icon: 'payments',
          color: 'bg-emerald-100 text-emerald-700',
        },
        {
          label: 'Zlecenia',
          value: ordersCount?.value || 0,
          trend: 'N/A',
          icon: 'local_shipping',
          color: 'bg-blue-100 text-blue-700',
        },
        {
          label: 'Klienci B2B',
          value: usersCount?.value || 0,
          trend: 'N/A',
          icon: 'corporate_fare',
          color: 'bg-indigo-100 text-indigo-700',
        },
        {
          label: 'Leady',
          value: leadsCount?.value || 0,
          trend: 'N/A',
          icon: 'contact_support',
          color: 'bg-amber-100 text-amber-700',
        },
      ],
      recentOrders: await db.select().from(orders).limit(5),
    };
  }

  @Get('audit-log/export')
  async exportAuditLog(@Req() req: any, @Query('limit') limit?: string) {
    // Access controlled by RolesGuard at route level when applied; no explicit check here
    const numericLimit = Number(limit);
    const lim = Number.isFinite(numericLimit) ? numericLimit : 50;
    // Utilize audit-log service if available; otherwise return last logs using directly the service
    // Import at top accordingly if needed; assuming AuditLogService is injected in constructor
    return this.auditLogService?.listRecent
      ? this.auditLogService.listRecent(lim)
      : [];
  }

  @Get('pricing-rules')
  async getPricingRules() {
    return db.select().from(pricingRules);
  }

  @Get('audit-log')
  async getAuditLog(@Query('limit') limitQuery?: string) {
    const numericLimit = Number(limitQuery);
    const limit = Number.isFinite(numericLimit) ? numericLimit : 50;
    return this.auditLogService.listRecent(limit);
  }

  @Post('pricing-rules')
  async updatePricingRule(
    @Body() rule: PricingRulePayload,
    @Req() req: AuthenticatedRequest,
  ) {
    if (rule.id) {
      const [oldRule] = await db
        .select()
        .from(pricingRules)
        .where(eq(pricingRules.id, rule.id));
      const { id, ...updateValues } = rule;
      await db
        .update(pricingRules)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(eq(pricingRules.id, id));

      await this.auditLogService.recordWithDiff({
        actorUserId: req.user?.sub,
        actorEmail: req.user?.email,
        action: 'pricing_rule.updated',
        entityType: 'pricing_rule',
        entityId: id,
        oldData: oldRule,
        newData: { ...oldRule, ...updateValues },
      });

      await this.redisService.del('active_pricing_rules');
      return { status: 'success', id };
    }

    const [created] = await db.insert(pricingRules).values(rule).returning();
    await this.redisService.del('active_pricing_rules');
    await this.auditLogService.record({
      actorUserId: req.user?.sub,
      actorEmail: req.user?.email,
      action: 'pricing_rule.created',
      entityType: 'pricing_rule',
      entityId: created?.id ?? null,
      metadata: {
        carrierCode: rule.carrierCode,
        serviceName: rule.serviceName,
      },
    });

    return created;
  }

  @Get('search')
  async globalSearch(@Query('q') query: string) {
    if (!query || query.length < 2) return { orders: [], leads: [], users: [] };

    const searchStr = `%${query}%`;

    const foundOrders = await db
      .select()
      .from(orders)
      .where(
        or(
          ilike(orders.orderNumber, searchStr),
          ilike(orders.carrierTrackingNumber, searchStr),
        ),
      )
      .limit(5);

    const foundLeads = await db
      .select()
      .from(leads)
      .where(
        or(
          ilike(leads.name, searchStr),
          ilike(leads.email, searchStr),
          ilike(leads.company, searchStr),
        ),
      )
      .limit(5);

    const foundUsers = await db
      .select()
      .from(users)
      .where(ilike(users.email, searchStr))
      .limit(5);

    return {
      orders: foundOrders,
      leads: foundLeads,
      users: foundUsers,
    };
  }

  @Get('analytics')
  async getAnalytics() {
    const adminStats = await this.analyticsService.getAdminStats();

    // Legacy support or combining with other data if needed
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await db
      .select()
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo));

    const carrierStats: Record<string, number> = {};
    recentOrders.forEach((o) => {
      carrierStats[o.carrierCode] = (carrierStats[o.carrierCode] || 0) + 1;
    });

    const recentActivity = await this.auditLogService.listRecent(10);

    return {
      chartData: adminStats.ordersOverTime.map((d: { date: string; count: number }) => ({
        date: d.date,
        value: d.count,
      })),
      carrierStats,
      recentActivity,
      revenueByCurrency: adminStats.revenueByCurrency,
      topCustomers: adminStats.topCustomers,
      summary: {
        totalRevenue: adminStats.revenueByCurrency.reduce(
          (sum: number, c: { currency: string; total: string }) => sum + Number(c.total),
          0,
        ),
        avgOrderValue:
          recentOrders.length > 0
            ? adminStats.revenueByCurrency.reduce(
                (sum: number, c: { currency: string; total: string }) => sum + Number(c.total),
                0,
              ) / recentOrders.length
            : 0,
        ordersCount: recentOrders.length,
      },
    };
  }

  @Get('tunnel')
  async getTunnel() {
    const url = await this.redisService.get('cloudflare_tunnel_url');
    return { url };
  }
}
