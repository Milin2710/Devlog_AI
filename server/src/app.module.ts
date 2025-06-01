import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Authentication } from './auth/user.entity';
import { JournalModule } from './journal/journal.module';
import { JournalEntry } from './journal/journal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Authentication, JournalEntry],
      synchronize: true,
    }),
    AuthModule,
    JournalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
