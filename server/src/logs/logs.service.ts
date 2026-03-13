import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from './logs.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private logsRepository: Repository<Logs>,
  ) {}

  async log(data: Partial<Logs>) {
    try {
      const log = this.logsRepository.create(data);
      await this.logsRepository.save(log);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }
}
