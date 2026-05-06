import { Controller, Post, Body } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteRequestDto } from './dto/quote.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async getQuotes(@Body() quoteRequest: QuoteRequestDto) {
    return await this.quoteService.calculateQuote(quoteRequest);
  }
}
