import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { DhlCarrierService } from './dhl.service';
import { DpdCarrierService } from './dpd.service';

@Module({
  providers: [CarriersService, DhlCarrierService, DpdCarrierService],
  exports: [CarriersService],
})
export class CarriersModule {}
