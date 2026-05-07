import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      environment: process.env.NODE_ENV || 'development',
    });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  app.use(cookieParser());
  app.use(helmet());
  app.set('trust proxy', 1);
  app.enableShutdownHooks();

  configureApp(app);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  if (process.env.NODE_ENV === 'production') {
    const heapLimit = process.env.NODE_OPTIONS?.includes('max-old-space-size')
      ? 'configured'
      : 'default';
    logger.log(`API listening on port ${port} (heap limit: ${heapLimit})`);
  } else {
    logger.log(`API listening on port ${port}`);
  }
}
void bootstrap();
