import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CurrenciesService {
  private readonly CACHE_KEY = 'exchange_rates';

  constructor(private readonly redisService: RedisService) {}

  async getRates() {
    const cached = await this.redisService.get(this.CACHE_KEY);
    if (cached) return JSON.parse(cached);

    // Mock rates for now. In production, call NBP or OpenExchangeRates
    const rates = {
      PLN: 1.0,
      EUR: 4.35,
      USD: 4.05,
      GBP: 5.15,
    };

    await this.redisService.setMs(
      this.CACHE_KEY,
      JSON.stringify(rates),
      3600 * 1000,
    ); // 1h
    return rates;
  }

  async convert(amount: number, from: string, to: string): Promise<number> {
    const rates = await this.getRates();
    const amountInPln = amount * (rates[from] || 1);
    return amountInPln / (rates[to] || 1);
  }
}
