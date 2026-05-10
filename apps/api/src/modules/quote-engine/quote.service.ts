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
    // 1. Calculate Volumetric Weight (L*W*H / 4000 is standard for many pallet carriers)
    const volumetricWeight = (params.dimensions.length * params.dimensions.width * params.dimensions.height) / 4000;
    const chargeableWeight = Math.max(params.weight, volumetricWeight);

    const exceedsAutomaticDimensionLimits =
      params.dimensions.length > 300 ||
      params.dimensions.width > 300 ||
      params.dimensions.height > 250;

    const isNonStandard =
      params.palletType === 'custom' ||
      chargeableWeight > 1200 ||
      exceedsAutomaticDimensionLimits;

    if (isNonStandard) {
      return {
        quoteId: null,
        results: [],
        isNonStandard: true,
        nonStandardReason:
          chargeableWeight > 1200 
            ? `Waga całkowita (${chargeableWeight.toFixed(0)}kg) przekracza limit 1200kg dla wyceny automatycznej.` 
            : 'Wymiary przekraczają standardowe limity automatycznej wyceny.',
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

    // Filter rules by weight and ROUTE (Country)
    const activeRules = allActiveRules.filter((rule) => {
      const minW = parseFloat(rule.minWeight);
      const maxW = parseFloat(rule.maxWeight);
      
      // Match weight
      const weightMatches = chargeableWeight >= minW && chargeableWeight <= maxW;
      
      // Match country (if specified in rule, otherwise default to PL)
      const senderMatches = !rule.senderCountry || rule.senderCountry === params.sender.country;
      const recipientMatches = !rule.recipientCountry || rule.recipientCountry === params.recipient.country;

      return weightMatches && senderMatches && recipientMatches;
    });

    if (activeRules.length === 0) {
      return {
        quoteId: null,
        results: [],
        isNonStandard: false,
        error: `Brak dostępnych ofert dla relacji ${params.sender.country} -> ${params.recipient.country} przy wadze ${chargeableWeight.toFixed(0)}kg.`,
      };
    }

    // Surcharge calculation helper
    const calculateSurcharges = (params: QuoteRequestDto) => {
      let total = 0;
      const breakdown: Record<string, number> = {};

      if (params.options?.senderPrivate) {
        breakdown['Prywatny nadawca'] = 25.0;
        total += 25.0;
      }
      if (params.options?.recipientPrivate) {
        breakdown['Prywatny odbiorca'] = 25.0;
        total += 25.0;
      }
      if (params.options?.fragile) {
        breakdown['Ostrożnie'] = 15.0;
        total += 15.0;
      }
      if (params.options?.adr) {
        breakdown['ADR'] = 80.0;
        total += 80.0;
      }

      return { total, breakdown };
    };

    const { total: surchargesTotal, breakdown: surchargesBreakdown } = calculateSurcharges(params);

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
          ...surchargesBreakdown,
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
