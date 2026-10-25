import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/decorators/roles.decorator.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(cfg: ConfigService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: cfg.getOrThrow('JWT_SECRET'),
        });
    }

    validate(payload: { sub: string; role: Role }) {
        return { id: payload.sub, role: payload.role }; // becomes req.user
    }
}