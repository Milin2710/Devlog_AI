import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './journal.entity';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import * as streamifier from 'streamifier';

export interface UploadedImageFile extends Express.Multer.File {
  buffer: Buffer;
}

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async createEntry(
    author_uuid: string,
    author_email: string,
    author_first_name: string,
    author_last_name: string,
    journal_title: string,
    created_at: Date,
    journal_content: string,
    journal_tags: string[],
    file?: Express.Multer.File | UploadedImageFile,
  ): Promise<JournalEntry> {
    if (typeof journal_tags === 'string') {
      try {
        journal_tags = JSON.parse(journal_tags);
      } catch (err) {
        console.warn('Failed to parse journal_tags:', journal_tags);
        journal_tags = [];
      }
    }
    let image_url: string | null = null;
    if (file) {
      const streamUpload = (): Promise<UploadApiResponse> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'journals',
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      image_url = result.secure_url;
    }
    const entry = this.journalRepository.create({
      author_email,
      author_uuid,
      author_first_name,
      author_last_name,
      journal_title,
      created_at: created_at || new Date(),
      journal_content,
      journal_tags,
      ...(image_url ? { image_url } : {}),
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

    const entry = await this.journalRepository.findOne({
      where: { uuid: journalid },
    });

    return entry;
  }

  async deleteEntry(journalid: string): Promise<boolean> {
    const result = await this.journalRepository.delete({ uuid: journalid });
    return !!result.affected; // or !!result.affected
  }

  async updateEntry(
    journalid: string,
    journal_title: string,
    created_at: Date,
    journal_content: string,
    journal_tags: string[],
    file?: Express.Multer.File | UploadedImageFile,
    image_url?: string | null,
  ): Promise<JournalEntry | null> {
    const entry = await this.getEntryById(journalid);

    if (!entry) {
      console.error(`Journal entry with uuid = ${journalid} not found`);
      return null;
    }

    // Upload if new file
    if (file) {
      const streamUpload = (): Promise<UploadApiResponse> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'journals',
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload();
      entry.image_url = result.secure_url;
    } else if (image_url === '') {
      // User removed image
      entry.image_url = null;
    } else if (image_url) {
      // Unchanged
      entry.image_url = image_url;
    }

    entry.journal_title = journal_title;
    entry.created_at = created_at;
    entry.journal_content = journal_content;
    entry.journal_tags = journal_tags;

    return this.journalRepository.save(entry);
  }
}
