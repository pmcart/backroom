import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { existsSync } from 'fs';
import { join } from 'path';
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
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:4200'];
  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.setGlobalPrefix('api', { exclude: ['/'] });

  // Initialise NestJS so all API routes are registered before the SPA catch-all
  await app.init();

  // SPA fallback — any GET that didn't match an /api/* route serves index.html
  // so Angular's client-side router handles it on refresh
  const indexPath = join(__dirname, '..', 'public', 'index.html');
  app.getHttpAdapter().get('*', (_req: any, res: any) => {
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API running on port ${port}`);
}
bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
