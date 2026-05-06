import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  // Basic security hardening
  app.use(helmet());
  app.set('trust proxy', 1);
  configureApp(app);
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
