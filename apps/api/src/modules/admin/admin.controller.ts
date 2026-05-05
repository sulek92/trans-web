import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { db } from '../../db';
import { orders, leads, users, pricingRules } from '../../db/schema';
import { count, sum, eq } from 'drizzle-orm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

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

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
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

  @Get('pricing-rules')
  async getPricingRules() {
    return db.select().from(pricingRules);
  }

  @Post('pricing-rules')
  async updatePricingRule(@Body() rule: PricingRulePayload) {
    if (rule.id) {
      const { id, ...updateValues } = rule;
      return db
        .update(pricingRules)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(eq(pricingRules.id, id));
    }
    return db.insert(pricingRules).values(rule);
  }
}
