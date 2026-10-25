import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import express from 'express';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as currentUserDecorator from './decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Public()
    @HttpCode(201)
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.auth.signup(dto.email, dto.password);
    }

    @Public()
    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
        const user = await this.auth.validate(dto.email, dto.password);
        return this.auth.issueTokens(user, res);
    }

    @Public()
    @HttpCode(200)
    @Post('refresh')
    async refresh(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
        const token = req.cookies?.['refresh_token'];
        return this.auth.useRefresh(token, res);
    }

    @HttpCode(204)
    @Post('logout')
    async logout(@currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser, @Res({ passthrough: true }) res: express.Response) {
        await this.auth.revokeAll(user.id);
        this.auth.clearRefreshCookie(res);
    }
}