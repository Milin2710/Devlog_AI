import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './types/request-with-user.interface';
import { LogsService } from '../logs/logs.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logsService: LogsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Req() request: RequestWithUser) {
    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'get_user',
      service: 'auth',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {},
    });

    return request.user;
  }

  @Post('signup')
  async signup(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
    @Req() request: RequestWithUser,
  ) {
    await this.logsService.log({
      user_uuid: 'new_user',
      user_email: body.email,
      action: 'signup',
      service: 'auth',
      endpoint: '/auth/signup',
      method: 'POST',
      ip_address: request.ip,
      metadata: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
      },
    });

    return this.authService.signup(
      body.first_name,
      body.last_name,
      body.email,
      body.password,
    );
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: RequestWithUser,
  ) {
    const result = await this.authService.login(body.email, body.password);

    await this.logsService.log({
      user_uuid: result.user.uuid,
      user_email: body.email,
      action: 'login',
      service: 'auth',
      endpoint: '/auth/login',
      method: 'POST',
      ip_address: request.ip,
      metadata: {},
    });

    // Set the token as an HTTP-only cookie
    response.cookie('auth-token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return result;
  }

  @Post('logout')
  async logout(@Req() request: RequestWithUser, @Res() res: Response) {
    const token = request.cookies['auth-token'];

    if (token) {
      res.clearCookie('auth-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }

    res.setHeader('Clear-Site-Data', '"cookies"');

    await this.logsService.log({
      user_uuid: request.user?.uuid || 'unknown',
      user_email: request.user?.email || 'unknown',
      action: 'logout',
      service: 'auth',
      endpoint: '/auth/logout',
      method: 'POST',
      ip_address: request.ip,
      metadata: {},
    });

    return res.status(200).json({
      status: 'success',
      message: 'You have been logged out successfully',
    });
  }

  @Post('google')
  async googleLogin(
    @Body() body: { email: string; name: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: RequestWithUser,
  ) {
    const result = await this.authService.googleLogin(body.email, body.name);

    // Set the token as an HTTP-only cookie
    response.cookie('auth-token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    await this.logsService.log({
      user_uuid: result.user.uuid,
      user_email: body.email,
      action: 'google_login',
      service: 'auth',
      endpoint: '/auth/google',
      method: 'POST',
      ip_address: request.ip,
      metadata: {
        name: body.name,
      },
    });

    return result;
  }
}
