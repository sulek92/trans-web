import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PaymentsModule } from '../payments/payments.module';
import { CarriersModule } from '../carriers/carriers.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    AuthModule,
    AuditLogModule,
    forwardRef(() => PaymentsModule),
    CarriersModule,
    forwardRef(() => DocumentsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
