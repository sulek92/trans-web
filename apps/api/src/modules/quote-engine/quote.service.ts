import { Injectable } from '@nestjs/common';
import { QuoteRequestDto } from './dto/quote.dto';
import { db } from '../../db';
import { pricingRules, quotes } from '../../db/schema';
import { eq, and, lte, gte } from 'drizzle-orm';
import { RedisService } from '../redis/redis.service';

export interface CarrierOffer {
  carrierId: string;
  carrierCode: string;
  serviceName: string;
  priceNetto: number;
  priceBrutto: number;
  surchargeBreakdown: Record<string, number>;
  eta: string;
  availableAdditionalServices: string[];
}

@Injectable()
export class QuoteService {
  constructor(private readonly redisService: RedisService) {}

  async calculateQuote(params: QuoteRequestDto) {
    const exceedsAutomaticDimensionLimits =
      params.dimensions.length > 300 ||
      params.dimensions.width > 300 ||
      params.dimensions.height > 250;

    const isNonStandard =
      params.palletType === 'custom' ||
      params.weight > 1200 ||
      exceedsAutomaticDimensionLimits;

    if (isNonStandard) {
      return {
        quoteId: null,
        results: [],
        isNonStandard: true,
        nonStandardReason:
          'Waga lub wymiary przekraczają standardowe limity automatycznej wyceny.',
      };
    }

    // Try to fetch from Redis Cache first
    const cacheKey = 'active_pricing_rules';
    let allActiveRules: any[] = [];
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      allActiveRules = JSON.parse(cachedData);
    } else {
      allActiveRules = await db
        .select()
        .from(pricingRules)
        .where(eq(pricingRules.isActive, true));

      // Cache for 1 hour (3600s)
      await this.redisService.set(
        cacheKey,
        JSON.stringify(allActiveRules),
        3600,
      );
    }

    // Filter rules by weight in memory
    const activeRules = allActiveRules.filter((rule) => {
      const minW = parseFloat(rule.minWeight);
      const maxW = parseFloat(rule.maxWeight);
      return params.weight >= minW && params.weight <= maxW;
    });

    if (activeRules.length === 0) {
      // Fallback or empty if no rules match weight
      return {
        quoteId: null,
        results: [],
        isNonStandard: false,
        error: 'Brak dostępnych ofert dla podanych parametrów.',
      };
    }

    const surchargesTotal = params.options?.senderPrivate ? 20 : 0;

    const results: CarrierOffer[] = activeRules.map((rule) => {
      const basePrice = parseFloat(rule.basePrice);
      const marginPercent = parseFloat(rule.marginPercent || '15');
      const margin = basePrice * (marginPercent / 100);

      const netto = basePrice + surchargesTotal + margin;
      const brutto = netto * 1.23;

      return {
        carrierId: rule.id,
        carrierCode: rule.carrierCode,
        serviceName: rule.serviceName,
        priceNetto: parseFloat(netto.toFixed(2)),
        priceBrutto: parseFloat(brutto.toFixed(2)),
        surchargeBreakdown: {
          basePrice,
          margin: parseFloat(margin.toFixed(2)),
          surcharges: surchargesTotal,
        },
        eta: rule.carrierCode === 'dpd' ? '1 dzień roboczy' : '1-2 dni robocze',
        availableAdditionalServices:
          rule.carrierCode === 'dpd' ? ['insurance', 'cod'] : ['insurance'],
      };
    });

    // Sort by priceNetto
    results.sort((a, b) => a.priceNetto - b.priceNetto);

    // Save quote to DB
    const [newQuote] = await db
      .insert(quotes)
      .values({
        palletType: params.palletType,
        length: params.dimensions.length.toString(),
        width: params.dimensions.width.toString(),
        height: params.dimensions.height.toString(),
        weight: params.weight.toString(),
        senderPostal: params.sender.postalCode,
        senderCountry: params.sender.country,
        recipientPostal: params.recipient.postalCode,
        recipientCountry: params.recipient.country,
        options: params.options,
        results: results,
      })
      .returning();

    return {
      quoteId: newQuote.id,
      results,
      isNonStandard: false,
    };
  }
}
