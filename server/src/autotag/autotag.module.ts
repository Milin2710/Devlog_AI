import { Module } from '@nestjs/common';
import { AutotagController } from './autotag.controller';
import { AutotagService } from './autotag.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [AutotagController],
  providers: [AutotagService],
  exports: [AutotagService],
})
export class AutotagModule {}
