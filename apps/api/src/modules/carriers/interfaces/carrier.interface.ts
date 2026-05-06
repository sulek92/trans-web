export interface CarrierShipmentResponse {
  success: true;
  carrier: string;
  trackingNumber: string;
  labelUrl: string;
}

export interface CarrierShipmentError {
  success: false;
  error: string;
}

export type ShipmentResponse = CarrierShipmentResponse | CarrierShipmentError;

export interface ICarrierService {
  createShipment(order: any): Promise<ShipmentResponse>;
  trackShipment?(trackingNumber: string): Promise<any>;
}
