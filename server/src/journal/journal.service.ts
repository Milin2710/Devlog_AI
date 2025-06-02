import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './journal.entity';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
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
    const entry = this.journalRepository.create({
      author_email,
      author_uuid,
      author_first_name,
      author_last_name,
      journal_title,
      journal_content,
      journal_tags,
    });

    return this.journalRepository.save(entry);
  }

  async getAllEntries(author_uuid: string): Promise<JournalEntry[]> {
    return this.journalRepository.find({
      where: { author_uuid },
      order: { created_at: 'DESC' },
    });
  }

  async getEntryById(journalid: string): Promise<JournalEntry | null> {
    // console.log(`Looking for journal entry with uuid = ${journalid}`);

    const entry = await this.journalRepository.findOne({
      where: { uuid: journalid },
    });

    // console.log('Fetched journal entry:', entry);
    return entry;
  }

  async deleteEntry(journalid: string): Promise<boolean> {
    console.log(`Deleting journal entry with uuid = ${journalid}`);
    const result = await this.journalRepository.delete({ uuid: journalid });
    return !!result.affected; // or !!result.affected
  }

  async updateEntry(
    journalid: string,
    journal_title: string,
    journal_content: string,
    journal_tags: string[],
  ): Promise<JournalEntry | null> {
    const entry = await this.getEntryById(journalid);

    if (!entry) {
      console.error(`Journal entry with uuid = ${journalid} not found`);
      return null;
    }

    entry.journal_title = journal_title;
    entry.journal_content = journal_content;
    entry.journal_tags = journal_tags;

    return this.journalRepository.save(entry);
  }
}
