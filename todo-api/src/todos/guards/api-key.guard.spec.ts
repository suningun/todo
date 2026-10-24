import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiKeyGuard } from './api-key.guard.js';

describe('ApiKeyGuard', () => {
    let guard: ApiKeyGuard;
    let reflector: Reflector;

    const mockContext = (headers: Record<string, string>) =>
        ({
        switchToHttp: () => ({
            getRequest: () => ({ headers }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
        }) as unknown as ExecutionContext;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new ApiKeyGuard('dev-secret', reflector);
    });

    it('allows a request with the correct key', () => {
        vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
        const ctx = mockContext({ 'x-api-key': 'dev-secret' });
        expect(guard.canActivate(ctx)).toBe(true);
    });

    it('rejects a request with the wrong key', () => {
        vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
        const ctx = mockContext({ 'x-api-key': 'wrong-key' });
        expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
    });

    it('allows any request when the route is @Public()', () => {
        vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
        const ctx = mockContext({});
        expect(guard.canActivate(ctx)).toBe(true);
    });
});