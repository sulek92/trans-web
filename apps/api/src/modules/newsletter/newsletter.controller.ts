import { Controller, Get } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get()
  async test(): Promise<string> {
    // Simple health check endpoint for newsletter module
    return this.newsletterService.ping();
  }
}
