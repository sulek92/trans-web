import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { InternalTunnelController } from './internal-tunnel.controller';
import { AuthModule } from '../auth/auth.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { OrdersModule } from '../orders/orders.module';
import { ApiKeyModule } from '../api-key/api-key.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    AuthModule,
    AuditLogModule,
    OrdersModule,
    ApiKeyModule,
    AnalyticsModule,
  ],
  controllers: [AdminController, InternalTunnelController],
})
export class AdminModule {}
