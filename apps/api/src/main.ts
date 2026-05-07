import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

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
