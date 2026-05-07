import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: { sub: string; email: string; role: 'admin' | 'customer' };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body, { ip: req.ip });

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    };

    // Set HttpOnly session cookies
    res.cookie('pb_auth_token', result.accessToken, {
      ...cookieOptions,
      maxAge: result.expiresIn * 1000,
    });

    res.cookie('pb_refresh_token', result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set non-HttpOnly metadata cookie for frontend UI state
    res.cookie(
      'pb_user_meta',
      JSON.stringify({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      }),
      {
        ...cookieOptions,
        httpOnly: false,
        maxAge: result.expiresIn * 1000,
      },
    );

    return result;
  }

  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async refresh(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refresh(body.refreshToken);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('pb_auth_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: result.expiresIn * 1000,
    });

    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawAuth = req.headers?.authorization;
    const authHeader =
      typeof rawAuth === 'string'
        ? rawAuth
        : Array.isArray(rawAuth)
          ? rawAuth[0]
          : undefined;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : '';

    res.clearCookie('pb_auth_token', { path: '/' });
    res.clearCookie('pb_refresh_token', { path: '/' });
    res.clearCookie('pb_user_meta', { path: '/' });

    return this.authService.logout(accessToken);
  }

  @Post('magic-link')
  magicLink(@Body('email') email: string) {
    return this.authService.sendMagicLink(email);
  }

  @Post('password-reset/request')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('password-reset/confirm')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('verify')
  verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.authService.me(req.user);
  }
}
