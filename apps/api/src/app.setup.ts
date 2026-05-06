import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const CSRF_PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SESSION_COOKIE_MARKERS = ['pb_auth_token=', 'pb_refresh_token='];

function normalizeOrigin(raw: string): string | null {
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

function extractRequestOrigin(req: Request): string | null {
  const originHeader = req.headers.origin;
  if (typeof originHeader === 'string') {
    return normalizeOrigin(originHeader);
  }

  const refererHeader = req.headers.referer;
  if (typeof refererHeader === 'string') {
    return normalizeOrigin(refererHeader);
  }

  return null;
}

function getTrustedOrigins(): Set<string> {
  const configuredOrigins =
    process.env.CORS_ORIGIN?.split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0) ?? [];

  const fallbackOrigins = [
    process.env.APP_URL,
    process.env.NEXTAUTH_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => origin.trim());

  const allOrigins = [...configuredOrigins, ...fallbackOrigins];
  const normalized = allOrigins
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin));

  return new Set(normalized);
}

export function configureApp(app: INestApplication) {
  const trustedOrigins = getTrustedOrigins();

  app.use(helmet());
  app.enableCors({
    origin:
      process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ??
      true,
    credentials: true,
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!CSRF_PROTECTED_METHODS.has(req.method.toUpperCase())) {
      next();
      return;
    }

    const cookieHeader = req.headers.cookie;
    const hasSessionCookie =
      typeof cookieHeader === 'string' &&
      SESSION_COOKIE_MARKERS.some((marker) => cookieHeader.includes(marker));

    if (!hasSessionCookie) {
      next();
      return;
    }

    const requestOrigin = extractRequestOrigin(req);
    if (!requestOrigin || !trustedOrigins.has(requestOrigin)) {
      res.status(403).json({
        message: 'CSRF protection: invalid request origin',
      });
      return;
    }

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
}
