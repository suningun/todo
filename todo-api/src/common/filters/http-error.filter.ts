import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
    catch(err: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const status = err.getStatus();

        res.status(status).json({
        statusCode: status,
        message: err.message,
        path: req.url,
        timestamp: new Date().toISOString(),
        });
    }
}