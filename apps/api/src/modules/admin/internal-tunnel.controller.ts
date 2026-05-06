import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Controller('internal/tunnel')
export class InternalTunnelController {
  constructor(private readonly redisService: RedisService) {}

  @Post()
  async updateTunnel(
    @Body() body: { url: string },
    @Headers('x-tunnel-secret') secret: string,
  ) {
    const expectedSecret = process.env.TUNNEL_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid tunnel secret');
    }
    await this.redisService.set('cloudflare_tunnel_url', body.url, 86400); // 24h TTL
    return { status: 'ok', url: body.url };
  }
}
