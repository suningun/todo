import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/user.entity.js';
import { RefreshToken } from './refresh-token.entity.js';

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_COOKIE_OPTS = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/auth',
    maxAge: 7 * 24 * 3600 * 1000, // 7 days
};

@Injectable()
export class AuthService {
    constructor(
        private users: UsersService,
        private jwt: JwtService,
        private config: ConfigService,
        @InjectRepository(RefreshToken)
        private refreshRepo: Repository<RefreshToken>,
    ) {}

    async signup(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();

        if (await this.users.existsByEmail(normalizedEmail)) {
        throw new ConflictException('Email taken');
        }

        const hash = await argon2.hash(password);
        const user = await this.users.create(normalizedEmail, hash);

        return { id: user.id, email: user.email };
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.users.findByEmailWithPassword(email.trim().toLowerCase());
        const ok = user && (await argon2.verify(user.passwordHash, password));

        if (!ok) {
        throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async issueTokens(user: User, res: Response) {
        const payload = { sub: user.id, role: user.role };

        const accessToken = await this.jwt.signAsync(payload);
        const refreshToken = await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
        });

        await this.saveRefreshToken(user.id, refreshToken);
        res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);

        return { accessToken };
    }

    private async saveRefreshToken(userId: string, token: string) {
        const tokenHash = await argon2.hash(token);
        const record = this.refreshRepo.create({ userId, tokenHash });
        await this.refreshRepo.save(record);
    }

    async useRefresh(token: string | undefined, res: Response) {
        if (!token) throw new UnauthorizedException('No refresh token');

        let payload: { sub: string; role: string };
        try {
        payload = await this.jwt.verifyAsync(token, {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        });
        } catch {
        throw new UnauthorizedException('Invalid refresh token');
        }

        const stored = await this.refreshRepo.find({
        where: { userId: payload.sub, revoked: false },
        });

        let matched: RefreshToken | undefined;
        for (const candidate of stored) {
        if (await argon2.verify(candidate.tokenHash, token)) {
            matched = candidate;
            break;
        }
        }

        if (!matched) {
        // Token not found or already used: possible theft — revoke everything for this user
        await this.revokeAll(payload.sub);
        throw new UnauthorizedException('Refresh token reuse detected');
        }

        // Rotate: retire the used token, issue a new pair
        matched.revoked = true;
        await this.refreshRepo.save(matched);

        const user = await this.users.findById(payload.sub);
        if (!user) throw new UnauthorizedException('User no longer exists');

        return this.issueTokens(user, res);
    }

    async revokeAll(userId: string) {
        await this.refreshRepo.update({ userId, revoked: false }, { revoked: true });
    }

    clearRefreshCookie(res: Response) {
        res.clearCookie(REFRESH_COOKIE, { path: '/auth' });
    }
}