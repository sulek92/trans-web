import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  private readonly maxAge = 3600;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    // Apply Cache-Control header
    response.setHeader(
      'Cache-Control',
      `public, max-age=${this.maxAge}, s-maxage=${this.maxAge}, stale-while-revalidate=600`,
    );

    return next.handle();
  }
}
