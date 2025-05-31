import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Authentication } from './auth/user.entity';
import { JournalModule } from './journal/journal.module';
import { JournalEntry } from './journal/journal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'milin',
      database: 'devlog',
      entities: [Authentication, JournalEntry],
      synchronize: true,
    }),
    AuthModule,
    JournalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
