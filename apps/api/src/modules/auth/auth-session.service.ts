import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

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
  private readonly revokedTokenJti = new Map<string, number>();
  private readonly loginAttempts = new Map<string, LoginAttempt>();
  private readonly passwordResetTokens = new Map<string, PasswordResetToken>();

  isTokenRevoked(jti?: string): boolean {
    if (!jti) return false;
    this.pruneRevokedTokens();
    return this.revokedTokenJti.has(jti);
  }

  revokeToken(jti: string, exp?: number): void {
    this.pruneRevokedTokens();
    const fallbackExpiry = Date.now() + 24 * 60 * 60 * 1000;
    const expiresAt = exp ? exp * 1000 : fallbackExpiry;
    this.revokedTokenJti.set(jti, expiresAt);
  }

  getLockState(key: string): { isLocked: boolean; remainingMs: number } {
    this.pruneLoginAttempts();
    const current = this.loginAttempts.get(key);
    const now = Date.now();
    if (!current?.lockedUntil || current.lockedUntil <= now) {
      return { isLocked: false, remainingMs: 0 };
    }
    return { isLocked: true, remainingMs: current.lockedUntil - now };
  }

  markFailedLogin(
    key: string,
    maxAttempts: number,
    lockWindowMs: number,
  ): void {
    this.pruneLoginAttempts();
    const now = Date.now();
    const current = this.loginAttempts.get(key);

    if (!current) {
      this.loginAttempts.set(key, { count: 1, firstFailedAt: now });
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
  }

  clearLoginAttempts(key: string): void {
    this.loginAttempts.delete(key);
  }

  createPasswordResetToken(email: string, ttlMs = 15 * 60 * 1000): string {
    this.prunePasswordResetTokens();
    const token = randomBytes(32).toString('hex');
    this.passwordResetTokens.set(token, {
      email: email.trim().toLowerCase(),
      expiresAt: Date.now() + ttlMs,
    });
    return token;
  }

  consumePasswordResetToken(token: string): string | null {
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
}
