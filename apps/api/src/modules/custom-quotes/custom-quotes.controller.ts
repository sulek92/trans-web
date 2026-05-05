import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CustomQuotesService } from './custom-quotes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('custom-quotes')
export class CustomQuotesController {
  constructor(private readonly customQuotesService: CustomQuotesService) {}

  @Post()
  createCustomQuote(@Body() body: Record<string, unknown>) {
    return this.customQuotesService.createCustomQuote(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getCustomQuotes() {
    return this.customQuotesService.getCustomQuotes();
  }
}
