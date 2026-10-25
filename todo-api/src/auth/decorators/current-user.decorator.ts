import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../common/decorators/roles.decorator.js';

export interface AuthUser {
    id: string;
    role: Role;
}

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): AuthUser => {
        return ctx.switchToHttp().getRequest().user;
    },
);