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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(@Req() request: RequestWithUser) {
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
  ) {
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
  ) {
    const result = await this.authService.login(body.email, body.password);

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
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth-token'];

    if (token) {

      res.clearCookie('auth-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }

    res.setHeader('Clear-Site-Data', '"cookies"');

    return res.status(200).json({
      status: 'success',
      message: 'You have been logged out successfully',
    });
  }
}
