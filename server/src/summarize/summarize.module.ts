import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize.controller';
import { SummarizeService } from './summarize.service';

@Module({
  imports: [],
  controllers: [SummarizeController],
  providers: [SummarizeService],
  exports: [SummarizeService],
})
export class SummarizeModule {}
