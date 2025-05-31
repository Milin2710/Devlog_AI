import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';
import { JournalEntry } from './journal.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Authentication } from '../auth/user.entity';
import { BlacklistedToken } from '../auth/blacklisted-token.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalEntry, Authentication, BlacklistedToken]),
    JwtModule.register({
      secret: 'ieuf!!gr&^*VWDB;13t489gufb=-][;nvw',
      signOptions: { expiresIn: '1d' }, // Set token expiration
    }),
  ],
  controllers: [JournalController],
  providers: [AuthService, JournalService, JwtAuthGuard, JwtStrategy],
  exports: [JournalService, JwtAuthGuard, JwtModule],
})
export class JournalModule {}
