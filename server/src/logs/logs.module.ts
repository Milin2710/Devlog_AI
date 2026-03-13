import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logs])],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
