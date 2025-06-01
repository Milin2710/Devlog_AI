import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Authentication } from './user.entity'
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BlacklistedToken } from './blacklisted-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Authentication, BlacklistedToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
