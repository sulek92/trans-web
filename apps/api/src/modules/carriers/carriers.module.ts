import { Module } from '@nestjs/common';
import { DhlCarrierService } from './dhl.service';
import { DpdCarrierService } from './dpd.service';

@Module({
  providers: [DhlCarrierService, DpdCarrierService],
  exports: [DhlCarrierService, DpdCarrierService],
})
export class CarriersModule {}
