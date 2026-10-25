import { SetMetadata } from '@nestjs/common';

export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);