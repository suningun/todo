import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';
import { RefreshToken } from './refresh-token.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        TypeOrmModule.forFeature([RefreshToken]),
        JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
            secret: c.getOrThrow('JWT_SECRET'),
            signOptions: { expiresIn: '15m' },
        }),
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}