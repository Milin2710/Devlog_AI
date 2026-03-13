import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize.controller';
import { SummarizeService } from './summarize.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [SummarizeController],
  providers: [SummarizeService],
  exports: [SummarizeService],
})
export class SummarizeModule {}