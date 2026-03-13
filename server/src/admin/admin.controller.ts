import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';
import { LogsService } from '../logs/logs.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private jwtService: JwtService,
    private logsService: LogsService,
    private adminService: AdminService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (
      body.email !== process.env.ADMIN_EMAIL ||
      body.password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const token = this.jwtService.sign(
      { email: body.email, role: 'admin' },
      { secret: process.env.ADMIN_JWT_SECRET, expiresIn: '7d' },
    );

    return { token };
  }

  @UseGuards(AdminGuard)
  @Post('logout')
  async logout(@Body() body: { token: string }) {
    await this.jwtService.verifyAsync(body.token, {
      secret: process.env.ADMIN_JWT_SECRET,
    });
    return { message: 'Logged out successfully' };
  }

  @Post('users')
  async getUsers() {
    return await this.adminService.getAllUsers();
  }

  @UseGuards(AdminGuard)
  @Post('analytics')
  async getAnalytics(@Body() body: { type: string }) {
    switch (body.type) {
      case 'timeline':
        return await this.adminService.getTimelineData();
      case 'tags':
        return await this.adminService.getTopTags();
      case 'users':
        return await this.adminService.getUsersData();
      default:
        throw new UnauthorizedException('Invalid analytics type');
    }
  }

  @UseGuards(AdminGuard)
  @Post('stats')
  async getStats() {
    return await this.adminService.getStatsData();
  }

  @UseGuards(AdminGuard)
  @Get('activity')
  @UseGuards(AdminGuard)
  async getActivityLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    return this.adminService.getActivityLogs(pageNum, limitNum);
  }
}
