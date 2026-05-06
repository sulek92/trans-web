import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('my-stats')
  @UseGuards(JwtAuthGuard)
  async getMyStats(@Req() req: any) {
    return this.analyticsService.getUserStats(req.user.sub);
  }

  @Get('admin-stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAdminStats() {
    return this.analyticsService.getAdminStats();
  }
}
