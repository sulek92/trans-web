import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { LoginDto } from './dto/login.dto';
import { AuthSessionService } from './auth-session.service';
import { RegisterDto } from './dto/register.dto';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'customer' | 'superadmin';
  password: string;
}

type JwtPayload = {
  sub: string;
  email: string;
  role: 'admin' | 'customer' | 'superadmin';
  type: 'access' | 'refresh';
  jti: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly legacyPasswordOverrides = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  private readonly jwtSecret =
    process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret';
  private readonly accessTtl = process.env.JWT_ACCESS_TTL || '30m';
  private readonly refreshTtl = process.env.JWT_REFRESH_TTL || '7d';
  private readonly maxLoginAttempts = Number(
    process.env.MAX_LOGIN_ATTEMPTS || 5,
  );
  private readonly lockWindowMs = Number(
    process.env.LOGIN_LOCK_WINDOW_MS || 15 * 60 * 1000,
  );
  private readonly passwordSaltRounds = Number(
    process.env.PASSWORD_SALT_ROUNDS || 10,
  );
  private readonly legacyAuthFallbackEnabled =
    (process.env.LEGACY_AUTH_FALLBACK_ENABLED || 'true').toLowerCase() !==
    'false';

  private getLegacyUsers(): AuthUser[] {
    return [
      {
        id: '00000000-0000-4000-a000-000000000000',
        email: 'sulek92@gmail.com',
        password: 'admin1',
        role: 'superadmin',
      },
      {
        id: 'admin-1',
        email:
          (process.env.ADMIN_EMAIL || 'admin@paletbroker.pl').toLowerCase() ===
          'sulek92@gmail.com'
            ? 'admin-temp@paletbroker.pl'
            : (process.env.ADMIN_EMAIL || 'admin@paletbroker.pl').toLowerCase(),
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
      },
      {
        id: 'customer-1',
        email: (
          process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl'
        ).toLowerCase(),
        password: process.env.DEMO_USER_PASSWORD || 'user123',
        role: 'customer',
      },
    ];
  }

  async register(data: RegisterDto) {
    const email = this.normalizeEmail(data.email);
    const role = data.role === 'admin' ? 'admin' : 'customer';

    try {
      const existingUser = await this.findDbUserByEmail(email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const passwordHash = await hash(data.password, this.passwordSaltRounds);
      const [createdUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash,
          role,
          isVerified: false,
        })
        .returning();

      return {
        status: 'success',
        message: 'User registered. Please check email for verification.',
        user: {
          id: createdUser.id,
          email: createdUser.email,
          role: this.normalizeRole(createdUser.role),
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ServiceUnavailableException(
        'Registration service is temporarily unavailable',
      );
    }
  }

  async login(data: LoginDto, context?: { ip?: string }) {
    if (!data?.email || !data?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const attemptKey = this.getAttemptKey(data.email, context?.ip);
    const lockState = await this.authSessionService.getLockState(attemptKey);
    if (lockState.isLocked) {
      throw new HttpException(
        {
          message:
            'Too many failed login attempts. Account temporarily locked.',
          retryAfterMs: lockState.remainingMs,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const email = this.normalizeEmail(data.email);
    const dbUser = await this.tryFindDbUserByEmail(email);
    let identity: {
      id: string;
      email: string;
      role: 'admin' | 'customer' | 'superadmin';
    } | null = null;

    if (dbUser?.passwordHash) {
      const isPasswordValid = await compare(data.password, dbUser.passwordHash);
      if (isPasswordValid) {
        identity = this.toIdentity(dbUser);
      }
    }

    if (!identity) {
      const legacyUser = this.findLegacyUser(email);
      if (legacyUser) {
        const passwordMatches = this.matchesLegacyPassword(
          legacyUser,
          data.password,
        );
        if (passwordMatches) {
          const migratedIdentity = await this.upsertLegacyUserToDb(legacyUser);
          identity = migratedIdentity ?? {
            id: legacyUser.id,
            email: legacyUser.email,
            role: legacyUser.role,
          };
        }
      }
    }

    if (!identity) {
      await this.authSessionService.markFailedLogin(
        attemptKey,
        this.maxLoginAttempts,
        this.lockWindowMs,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.authSessionService.clearLoginAttempts(attemptKey);

    const tokenPair = await this.issueTokenPair({
      sub: identity.id,
      email: identity.email,
      role: identity.role,
    });

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      tokenType: 'Bearer',
      expiresIn: tokenPair.expiresIn,
      user: identity,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const payload = await this.verifyToken(refreshToken, 'refresh');
    await this.authSessionService.revokeToken(payload.jti, payload.exp);

    return this.issueTokenPair({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }

  async logout(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const payload = await this.verifyToken(accessToken, 'access');
    await this.authSessionService.revokeToken(payload.jti, payload.exp);
    return { status: 'success' };
  }

  me(user: {
    sub: string;
    email: string;
    role: 'admin' | 'customer' | 'superadmin';
  }) {
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    };
  }

  sendMagicLink(email: string) {
    void email;
    // Docelowo: wygenerowanie bezpiecznego tokenu i wysłanie przez Resend/Sendgrid
    return { status: 'success', message: 'Magic link sent to email' };
  }

  async requestPasswordReset(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    let targetUserExists = false;

    const dbUser = await this.tryFindDbUserByEmail(normalizedEmail);
    if (dbUser) {
      targetUserExists = true;
    } else if (
      this.legacyAuthFallbackEnabled &&
      this.findLegacyUser(normalizedEmail)
    ) {
      targetUserExists = true;
    }

    const response: Record<string, string> = {
      status: 'success',
      message: 'If an account exists, reset instructions have been sent.',
    };

    if (targetUserExists) {
      const resetToken =
        await this.authSessionService.createPasswordResetToken(normalizedEmail);
      if (process.env.NODE_ENV !== 'production') {
        response.resetToken = resetToken;
      }
    }

    return response;
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token?.trim()) {
      throw new BadRequestException('Reset token is required');
    }

    const email = await this.authSessionService.consumePasswordResetToken(
      token.trim(),
    );
    if (!email) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const normalizedEmail = this.normalizeEmail(email);
    const passwordHash = await hash(newPassword, this.passwordSaltRounds);

    let dbUpdated = false;
    try {
      const result = await db
        .update(users)
        .set({
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.email, normalizedEmail))
        .returning({ id: users.id });
      dbUpdated = result.length > 0;
    } catch {
      this.logger.warn(
        'Failed to update password in DB, falling back to legacy in-memory override',
      );
    }

    const legacyUser = this.legacyAuthFallbackEnabled
      ? this.findLegacyUser(normalizedEmail)
      : undefined;
    if (!dbUpdated && !legacyUser) {
      throw new ServiceUnavailableException(
        'Password reset is temporarily unavailable',
      );
    }

    if (legacyUser) {
      this.legacyPasswordOverrides.set(normalizedEmail, newPassword);
      await this.upsertLegacyUserToDb({
        ...legacyUser,
        password: newPassword,
      });
    }

    return {
      status: 'success',
      message: 'Password has been reset successfully.',
    };
  }

  verifyEmail(token: string) {
    void token;
    // Docelowo: ustawienie is_verified na true w bazie danych
    return { status: 'success', message: 'Email verified' };
  }

  private getAttemptKey(email: string, ip?: string): string {
    return `${email.trim().toLowerCase()}::${(ip || 'unknown').trim()}`;
  }

  private async issueTokenPair(identity: {
    sub: string;
    email: string;
    role: 'admin' | 'customer' | 'superadmin';
  }) {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = await this.jwtService.signAsync(
      { ...identity, type: 'access', jti: accessJti },
      {
        secret: this.jwtSecret,
        expiresIn: this.ttlToSeconds(this.accessTtl),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...identity, type: 'refresh', jti: refreshJti },
      {
        secret: this.jwtSecret,
        expiresIn: this.ttlToSeconds(this.refreshTtl),
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ttlToSeconds(this.accessTtl),
    };
  }

  private ttlToSeconds(ttl: string): number {
    if (/^\d+$/.test(ttl)) return Number(ttl);

    const match = ttl.match(/^(\d+)([smhd])$/i);
    if (!match) return 30 * 60;

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 1);
  }

  private async verifyToken(
    token: string,
    expectedType: 'access' | 'refresh',
  ): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret,
      });

      if (payload.type !== expectedType) {
        throw new UnauthorizedException('Invalid token type');
      }

      if (await this.authSessionService.isTokenRevoked(payload.jti)) {
        throw new UnauthorizedException('Token revoked');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private normalizeRole(
    role: string | null | undefined,
  ): 'admin' | 'customer' | 'superadmin' {
    if (role === 'superadmin') return 'superadmin';
    return role === 'admin' ? 'admin' : 'customer';
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private findLegacyUser(email: string): AuthUser | undefined {
    const normalizedEmail = this.normalizeEmail(email);
    return this.getLegacyUsers().find((user) => user.email === normalizedEmail);
  }

  private matchesLegacyPassword(
    user: AuthUser,
    candidatePassword: string,
  ): boolean {
    const overridePassword = this.legacyPasswordOverrides.get(user.email);
    return (overridePassword ?? user.password) === candidatePassword;
  }

  private async findDbUserByEmail(email: string) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, this.normalizeEmail(email)));
    return dbUser ?? null;
  }

  private async tryFindDbUserByEmail(email: string) {
    try {
      return await this.findDbUserByEmail(email);
    } catch {
      if (!this.legacyAuthFallbackEnabled) {
        throw new ServiceUnavailableException(
          'Authentication service is temporarily unavailable',
        );
      }
      this.logger.warn(
        'Failed to read user from DB, using legacy auth fallback',
      );
      return null;
    }
  }

  private toIdentity(user: typeof users.$inferSelect): {
    id: string;
    email: string;
    role: 'admin' | 'customer' | 'superadmin';
  } {
    return {
      id: user.id,
      email: user.email,
      role: this.normalizeRole(user.role),
    };
  }

  private async upsertLegacyUserToDb(legacyUser: AuthUser) {
    try {
      const existing = await this.findDbUserByEmail(legacyUser.email);
      const passwordHash = await hash(
        legacyUser.password,
        this.passwordSaltRounds,
      );

      if (existing) {
        const [updated] = await db
          .update(users)
          .set({
            passwordHash,
            role: legacyUser.role,
            isVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existing.id))
          .returning();

        return updated ? this.toIdentity(updated) : this.toIdentity(existing);
      }

      const [created] = await db
        .insert(users)
        .values({
          email: legacyUser.email,
          passwordHash,
          role: legacyUser.role,
          isVerified: true,
        })
        .returning();

      return created ? this.toIdentity(created) : null;
    } catch {
      this.logger.warn('Failed to migrate legacy user to DB');
      return null;
    }
  }
}
