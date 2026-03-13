import { Module } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownService } from './markdown.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [MarkdownController],
  providers: [MarkdownService],
  exports: [MarkdownService],
})
export class MarkdownModule {}
