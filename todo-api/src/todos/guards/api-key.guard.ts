import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { API_KEY } from '../tokens.js';
import { IS_PUBLIC } from '../../common/decorators/public.decorator.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        @Inject(API_KEY) private key: string,
        private reflector: Reflector,
    ) {}

    canActivate(ctx: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        ctx.getHandler(),
        ctx.getClass(),
        ]);
        if (isPublic) return true;

        const req = ctx.switchToHttp().getRequest();
        if (req.headers['x-api-key'] !== this.key) {
        throw new UnauthorizedException('Bad API key');
        }
        return true;
    }
}