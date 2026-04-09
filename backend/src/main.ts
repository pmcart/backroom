import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ensureDatabase } from './database/ensure-database';

dotenv.config();

async function bootstrap() {
  await ensureDatabase();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: 'http://localhost:4200' });
  }
  app.setGlobalPrefix('api', { exclude: ['/'] });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
