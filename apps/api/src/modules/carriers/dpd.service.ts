import { Injectable } from '@nestjs/common';
import {
  ICarrierService,
  ShipmentResponse,
} from './interfaces/carrier.interface';

@Injectable()
export class DpdCarrierService implements ICarrierService {
  private readonly isProduction = process.env.DPD_ENV === 'production';
  private readonly apiUrl = this.isProduction
    ? 'https://ws.dpd.com.pl/services/DPDPackageObjServicesV4?wsdl'
    : 'https://test-ws.dpd.com.pl/services/DPDPackageObjServicesV4?wsdl';

  async createShipment(order: any): Promise<ShipmentResponse> {
    if (!this.isProduction) {
      console.log('DPD Sandbox Mode: Simulating shipment creation...');
      return {
        success: true,
        carrier: 'DPD',
        trackingNumber: `DPD_SBX_${Date.now()}`,
        labelUrl: `https://paletbroker.pl/api/labels/sbx-dpd-${order.orderNumber}.pdf`,
      };
    }

    return {
      success: false,
      error:
        'DPD Production API requires valid credentials in .env (DPD_FID, DPD_USER, DPD_PASS)',
    };
  }
}
