import { Controller, Get } from '@nestjs/common';
import { db } from '../../db';
import { sql } from 'drizzle-orm';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  async check() {
    let dbStatus = 'ok';
    let redisStatus = 'ok';

    try {
      await db.execute(sql`SELECT 1`);
    } catch (e) {
      dbStatus = 'error';
    }

    if (!this.redisService.isOpen()) {
      redisStatus = 'error';
    }

    const uptime = process.uptime();

    return {
      status: dbStatus === 'ok' && redisStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime,
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  @Get('metrics')
  async getMetrics() {
    const memory = process.memoryUsage();
    return {
      memory: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
      },
      cpu: process.cpuUsage(),
    };
  }
}
