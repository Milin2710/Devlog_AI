import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Authentication } from './auth/user.entity';
import { JournalModule } from './journal/journal.module';
import { JournalEntry } from './journal/journal.entity';
import { SummarizeModule } from './summarize/summarize.module';
import { AutotagModule } from './autotag/autotag.module';
import { MarkdownModule } from './markdown/markdown.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: [Authentication, JournalEntry],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    JournalModule,
    SummarizeModule,
    AutotagModule,
    MarkdownModule,
    ShareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
