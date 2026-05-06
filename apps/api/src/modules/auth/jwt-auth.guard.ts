import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AuthSessionService } from './auth-session.service';

type RequestUser = {
  type?: string;
  jti?: string;
  [key: string]: unknown;
};

type AuthenticatedRequest = Request & {
  user?: RequestUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Optional() private readonly jwtService?: JwtService,
    @Optional() private readonly authSessionService?: AuthSessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeaderRaw = request.headers.authorization;
    const authHeader =
      typeof authHeaderRaw === 'string'
        ? authHeaderRaw
        : Array.isArray(authHeaderRaw)
          ? authHeaderRaw[0]
          : undefined;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const jwtService =
        this.jwtService ??
        new JwtService({
          secret:
            process.env.JWT_SECRET ||
            process.env.NEXTAUTH_SECRET ||
            'local-secret',
        });
      const payload = await jwtService.verifyAsync<{
        type?: string;
        jti?: string;
      }>(token, {
        secret:
          process.env.JWT_SECRET ||
          process.env.NEXTAUTH_SECRET ||
          'local-secret',
      });

      if (payload.type && payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      if (await this.authSessionService?.isTokenRevoked(payload.jti)) {
        throw new UnauthorizedException('Token revoked');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
