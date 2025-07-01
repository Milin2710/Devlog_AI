import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntry } from 'src/journal/journal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
  ) {}
  async saveSharedEntry(
    isPublic: boolean,
    allowedEmails: string[],
    journalid: string,
  ): Promise<JournalEntry> {
    const entry = await this.journalRepository.findOne({
      where: { uuid: journalid },
    });

    if (!entry) {
      throw new Error('Journal entry not found');
    }

    entry.isPublic = isPublic;
    entry.allowedEmails = allowedEmails;

    return this.journalRepository.save(entry);
  }

  async getSharedEntry(
    journalid: string,
    useremail: string,
  ): Promise<JournalEntry | null> {
    const entry = await this.journalRepository.findOne({
      where: { uuid: journalid },
    });
    if (!entry) {
      throw new Error('Journal entry not found or not shared');
    }
    if (entry.isPublic || entry.allowedEmails.includes(useremail)) {
      return entry;
    }
    if (entry.author_email === useremail) {
      return entry;
    }
    return null;
  }
}
