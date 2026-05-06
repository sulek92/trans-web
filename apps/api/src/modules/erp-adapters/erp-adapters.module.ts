import { Module } from '@nestjs/common';
import { ErpAdaptersService } from './erp-adapters.service';
import { ErpAdaptersController } from './erp-adapters.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [ErpAdaptersController],
  providers: [ErpAdaptersService],
  exports: [ErpAdaptersService],
})
export class ErpAdaptersModule {}
