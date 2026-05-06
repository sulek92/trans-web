import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { OrdersModule } from '../orders/orders.module';
import { TrackingModule } from '../tracking/tracking.module';
import { QuoteModule } from '../quote-engine/quote.module';

@Module({
  imports: [OrdersModule, TrackingModule, QuoteModule],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
