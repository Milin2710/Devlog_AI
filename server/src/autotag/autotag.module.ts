import { Module } from '@nestjs/common';
import { AutotagController } from './autotag.controller';
import { AutotagService } from './autotag.service';

@Module({
  imports: [],
  controllers: [AutotagController],
  providers: [AutotagService],
  exports: [AutotagService],
})
export class AutotagModule {}
