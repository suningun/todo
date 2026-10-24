import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const req = ctx.switchToHttp().getRequest();
        const start = Date.now();

        return next.handle().pipe(
        tap(() => {
            console.log(`${req.method} ${req.url} ${Date.now() - start}ms`);
        }),
        );
    }
}