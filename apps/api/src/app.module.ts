import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteModule } from './modules/quote-engine/quote.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { CustomQuotesModule } from './modules/custom-quotes/custom-quotes.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { CmsModule } from './modules/cms/cms.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { RedisModule } from './modules/redis/redis.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { HealthModule } from './modules/health/health.module';
import { ErpAdaptersModule } from './modules/erp-adapters/erp-adapters.module';
import { AddressBookModule } from './modules/address-book/address-book.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL_MS || 60000),
        limit: Number(process.env.RATE_LIMIT_MAX || 120),
      },
    ]),
    QuoteModule,
    AuthModule,
    OrdersModule,
    TrackingModule,
    CustomQuotesModule,
    CarriersModule,
    CmsModule,
    LeadsModule,
    AdminModule,
    UsersModule,
    PaymentsModule,
    DocumentsModule,
    NotificationsModule,
    WebsocketsModule,
    RedisModule,
    ApiKeyModule,
    IntegrationsModule,
    HealthModule,
    ErpAdaptersModule,
    AddressBookModule,
    CurrenciesModule,
    AnalyticsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
