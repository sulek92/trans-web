import { Controller, Get, Param } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { Throttle } from '@nestjs/throttler';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':trackingNumber')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  getTracking(@Param('trackingNumber') trackingNumber: string) {
    return this.trackingService.getTrackingInfo(trackingNumber);
  }
}
