import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ensureDatabase } from './database/ensure-database';

dotenv.config();

async function bootstrap() {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.PORT}`);
  console.log(`DATABASE_URL present: ${!!process.env.DATABASE_URL}`);

  await ensureDatabase();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: 'http://localhost:4200' });
  }
  app.setGlobalPrefix('api', { exclude: ['/'] });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API running on port ${port}`);
}
bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
