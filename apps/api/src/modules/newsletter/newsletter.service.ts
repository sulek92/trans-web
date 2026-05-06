import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsletterService {
  ping(): string {
    return 'newsletter service ok';
  }
  // Placeholder for real newsletter sending implementation
  async sendNewsletter(_payload: any): Promise<boolean> {
    // simulate success
    return true;
  }
}
