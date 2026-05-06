import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { RedisService } from '../redis/redis.service';

type LoginAttempt = {
  count: number;
  firstFailedAt: number;
  lockedUntil?: number;
};

type PasswordResetToken = {
  email: string;
  expiresAt: number;
};

@Injectable()
export class AuthSessionService {
  private readonly logger = new Logger(AuthSessionService.name);
  private readonly revokedTokenJti = new Map<string, number>();
  private readonly loginAttempts = new Map<string, LoginAttempt>();
  private readonly passwordResetTokens = new Map<string, PasswordResetToken>();
  private readonly keyPrefix = process.env.AUTH_REDIS_PREFIX || 'auth';

  constructor(private readonly redisService: RedisService) {}

  async isTokenRevoked(jti?: string): Promise<boolean> {
    if (!jti) return false;
    const redisResult = await this.withRedis<number>((client) =>
      client.exists(this.revokedKey(jti)),
    );
    if (redisResult !== null) {
      return redisResult > 0;
    }

    this.pruneRevokedTokens();
    return this.revokedTokenJti.has(jti);
  }

  async revokeToken(jti: string, exp?: number): Promise<void> {
    this.pruneRevokedTokens();
    const fallbackExpiry = Date.now() + 24 * 60 * 60 * 1000;
    const expiresAt = exp ? exp * 1000 : fallbackExpiry;
    this.revokedTokenJti.set(jti, expiresAt);

    const ttlMs = Math.max(1_000, expiresAt - Date.now());
    await this.withRedis((client) =>
      client.set(this.revokedKey(jti), '1', { PX: ttlMs }),
    );
  }

  async getLockState(
    key: string,
  ): Promise<{ isLocked: boolean; remainingMs: number }> {
    const redisLogin = await this.withRedis<string | null>((client) =>
      client.get(this.loginKey(key)),
    );
    if (redisLogin) {
      const parsed = this.parseLoginAttempt(redisLogin);
      const now = Date.now();
      if (!parsed?.lockedUntil || parsed.lockedUntil <= now) {
        return { isLocked: false, remainingMs: 0 };
      }
      return { isLocked: true, remainingMs: parsed.lockedUntil - now };
    }

    this.pruneLoginAttempts();
    const current = this.loginAttempts.get(key);
    const now = Date.now();
    if (!current?.lockedUntil || current.lockedUntil <= now) {
      return { isLocked: false, remainingMs: 0 };
    }
    return { isLocked: true, remainingMs: current.lockedUntil - now };
  }

  async markFailedLogin(
    key: string,
    maxAttempts: number,
    lockWindowMs: number,
  ): Promise<void> {
    this.pruneLoginAttempts();
    const now = Date.now();
    const redisValue = await this.withRedis<string | null>((client) =>
      client.get(this.loginKey(key)),
    );
    const current = redisValue
      ? this.parseLoginAttempt(redisValue)
      : this.loginAttempts.get(key);

    if (!current) {
      const created = { count: 1, firstFailedAt: now };
      this.loginAttempts.set(key, created);
      await this.persistLoginAttempt(key, created);
      return;
    }

    const updated: LoginAttempt = {
      ...current,
      count: current.count + 1,
    };

    if (updated.count >= maxAttempts) {
      updated.lockedUntil = now + lockWindowMs;
    }

    this.loginAttempts.set(key, updated);
    await this.persistLoginAttempt(key, updated);
  }

  async clearLoginAttempts(key: string): Promise<void> {
    this.loginAttempts.delete(key);
    await this.withRedis((client) => client.del(this.loginKey(key)));
  }

  async createPasswordResetToken(
    email: string,
    ttlMs = 15 * 60 * 1000,
  ): Promise<string> {
    this.prunePasswordResetTokens();
    const token = randomBytes(32).toString('hex');
    const normalizedEmail = email.trim().toLowerCase();
    this.passwordResetTokens.set(token, {
      email: normalizedEmail,
      expiresAt: Date.now() + ttlMs,
    });

    await this.withRedis((client) =>
      client.set(this.passwordResetKey(token), normalizedEmail, {
        PX: ttlMs,
      }),
    );

    return token;
  }

  async consumePasswordResetToken(token: string): Promise<string | null> {
    const redisEmail = await this.consumePasswordResetTokenFromRedis(token);
    if (redisEmail) return redisEmail;

    this.prunePasswordResetTokens();
    const record = this.passwordResetTokens.get(token);
    if (!record) return null;
    this.passwordResetTokens.delete(token);
    return record.email;
  }

  private pruneRevokedTokens(): void {
    const now = Date.now();
    for (const [jti, expiresAt] of this.revokedTokenJti.entries()) {
      if (expiresAt <= now) {
        this.revokedTokenJti.delete(jti);
      }
    }
  }

  private pruneLoginAttempts(): void {
    const now = Date.now();
    for (const [key, value] of this.loginAttempts.entries()) {
      const lockExpired = !value.lockedUntil || value.lockedUntil <= now;
      const staleWindow = now - value.firstFailedAt > 24 * 60 * 60 * 1000;
      if (lockExpired && staleWindow) {
        this.loginAttempts.delete(key);
      }
    }
  }

  private prunePasswordResetTokens(): void {
    const now = Date.now();
    for (const [token, value] of this.passwordResetTokens.entries()) {
      if (value.expiresAt <= now) {
        this.passwordResetTokens.delete(token);
      }
    }
  }

  private revokedKey(jti: string): string {
    return `${this.keyPrefix}:revoked:${jti}`;
  }

  private loginKey(key: string): string {
    return `${this.keyPrefix}:login:${key}`;
  }

  private passwordResetKey(token: string): string {
    return `${this.keyPrefix}:password-reset:${token}`;
  }

  private async persistLoginAttempt(
    key: string,
    value: LoginAttempt,
  ): Promise<void> {
    await this.withRedis((client) =>
      client.set(this.loginKey(key), JSON.stringify(value), {
        PX: 24 * 60 * 60 * 1000,
      }),
    );
  }

  private parseLoginAttempt(raw: string): LoginAttempt | null {
    try {
      const parsed = JSON.parse(raw) as LoginAttempt;
      if (!parsed || typeof parsed.count !== 'number') return null;
      if (typeof parsed.firstFailedAt !== 'number') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private async consumePasswordResetTokenFromRedis(
    token: string,
  ): Promise<string | null> {
    const value = await this.withRedis(async (client) => {
      const key = this.passwordResetKey(token);
      const email = await client.get(key);
      if (!email) return null;
      await client.del(key);
      return email;
    });

    return value;
  }

  private async withRedis<T>(
    operation: (client: any) => Promise<T>,
  ): Promise<T | null> {
    const client = this.redisService.getClient();
    if (!client) return null;

    try {
      return await operation(client);
    } catch (error) {
      this.logger.warn(
        `Redis operation failed, fallback to in-memory: ${
          error instanceof Error ? error.message : 'unknown'
        }`,
      );
      return null;
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'unknown';
  }
}
