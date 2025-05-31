import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './journal.entity';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private userRepository: Repository<JournalEntry>,
  ) {}

  async createEntry(
    author_uuid: string,
    author_email: string,
    author_first_name: string,
    author_last_name: string,
    journal_title: string,
    journal_content: string,
    journal_tags: string[],
  ): Promise<JournalEntry> {
    console.log(
      `Creating journal entry for user: ${author_email} (${author_uuid})`,
    );
    const entry = this.userRepository.create({
      author_email,
      author_uuid,
      author_first_name,
      author_last_name,
      journal_title,
      journal_content,
      journal_tags,
    });

    return this.userRepository.save(entry);
  }
}
