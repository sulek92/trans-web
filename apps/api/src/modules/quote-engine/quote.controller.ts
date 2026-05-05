import { Controller, Post, Body } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteRequestDto } from './dto/quote.dto';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async getQuotes(@Body() quoteRequest: QuoteRequestDto) {
    return await this.quoteService.calculateQuote(quoteRequest);
  }
}
