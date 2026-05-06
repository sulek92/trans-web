import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DhlCarrierService } from './dhl.service';
import { DpdCarrierService } from './dpd.service';
import { ShipmentResponse } from './interfaces/carrier.interface';

@Injectable()
export class CarriersService {
  private readonly logger = new Logger(CarriersService.name);

  constructor(
    private readonly dhlService: DhlCarrierService,
    private readonly dpdService: DpdCarrierService,
  ) {}

  async createShipment(carrierCode: string, order: any): Promise<ShipmentResponse> {
    this.logger.log(`Creating shipment for carrier: ${carrierCode}, Order: ${order.orderNumber}`);

    switch (carrierCode.toUpperCase()) {
      case 'DHL':
        return this.dhlService.createShipment(order);
      case 'DPD':
        return this.dpdService.createShipment(order);
      default:
        throw new BadRequestException(`Carrier ${carrierCode} is not supported for automated label generation.`);
    }
  }
}
