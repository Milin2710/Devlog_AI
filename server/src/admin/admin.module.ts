import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { LogsModule } from '../logs/logs.module';
import { AdminService } from './admin.service';
import { Authentication } from '../auth/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from '../journal/journal.entity';
import { Logs } from '../logs/logs.entity';

@Module({
  imports: [
    LogsModule,
    TypeOrmModule.forFeature([Authentication, JournalEntry, Logs]),
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
  exports: [AdminService],
})
export class AdminModule {}
