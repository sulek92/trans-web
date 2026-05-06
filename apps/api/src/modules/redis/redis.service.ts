import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;
  private readonly redisUrl = process.env.REDIS_URL;

  async onModuleInit() {
    if (!this.redisUrl) {
      this.logger.warn('REDIS_URL not set. Redis functionality will be disabled.');
      return;
    }

    this.client = createClient({
      url: this.redisUrl,
    });

    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));

    try {
      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (err) {
      this.logger.error('Could not connect to Redis', err);
    }
  }

  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.disconnect();
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client?.isOpen) return null;
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client?.isOpen) return;
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async setMs(key: string, value: string, ttlMs: number): Promise<void> {
    if (!this.client?.isOpen) return;
    await this.client.set(key, value, { PX: ttlMs });
  }

  getClient(): RedisClientType | null {
    return this.client?.isOpen ? this.client : null;
  }

  async del(key: string): Promise<void> {
    if (!this.client?.isOpen) return;
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client?.isOpen) return false;
    const result = await this.client.exists(key);
    return result > 0;
  }

  isOpen(): boolean {
    return this.client?.isOpen || false;
  }
}
