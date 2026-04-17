import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';

/**
 * Catches all unhandled exceptions.
 * - API paths (/api/*): returns the proper HTTP error response.
 * - Everything else: serves index.html so Angular's router handles the route
 *   (fixes the 500 / blank page on browser refresh for SPA routes).
 */
@Catch()
export class SpaFallbackFilter implements ExceptionFilter {
  private readonly indexPath = join(__dirname, '..', '..', 'public', 'index.html');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (response.headersSent) return;

    // ── API routes: return proper error response ──────────────────────────────
    if (request.url.startsWith('/api')) {
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        return void response.status(status).json(exception.getResponse());
      }
      console.error('[API Error]', exception);
      return void response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: 500, message: 'Internal server error' });
    }

    // ── SPA routes: serve Angular's index.html ────────────────────────────────
    if (existsSync(this.indexPath)) {
      return void response.sendFile(this.indexPath);
    }

    // Public folder not present (local dev without a build)
    return void response
      .status(HttpStatus.NOT_FOUND)
      .json({ statusCode: 404, message: 'Not found' });
  }
}
