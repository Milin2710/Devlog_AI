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
    media?: any[],
    file?: Express.Multer.File | UploadedImageFile,
    mediaFiles?: Express.Multer.File[],
  ): Promise<JournalEntry> {
    if (typeof journal_tags === 'string') {
      try {
        journal_tags = JSON.parse(journal_tags);
      } catch {
        journal_tags = [];
      }
    }

    let image_url: string | null = null;

    const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
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

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    if (file) {
      const result = await uploadToCloudinary(file.buffer);
      image_url = result.secure_url;
    }

    // Parse metadata
    let processedMedia: any[] = [];
    if (media) {
      processedMedia = Array.isArray(media) ? media : JSON.parse(media);
    }

    // Ensure files array exists
    const files = mediaFiles || [];

    // Upload media
    const uploadResults = await Promise.all(
      processedMedia.map(async (m, index) => {
        const file = files[index];

        if (!file) {
          throw new Error(`Media file missing for id ${m.id}`);
        }

        const result = await uploadToCloudinary(file.buffer);

        return {
          id: m.id,
          url: result.secure_url,
        };
      }),
    );

    const media_urls: string[] = [];

    // Replace temp URLs in markdown
    uploadResults.forEach(({ id, url }) => {
      const tempLink = `devlog-temp://${id}`;
      journal_content = journal_content.replaceAll(tempLink, url);
      media_urls.push(url);
    });

    const entry = this.journalRepository.create({
      author_email,
      author_uuid,
      author_first_name,
      author_last_name,
      journal_title,
      created_at: created_at || new Date(),
      journal_content,
      journal_tags,
      media_urls,
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
    file?: Express.Multer.File,
    image_url?: string | null,
    mediaFiles?: Express.Multer.File[],
    media?: any[],
  ): Promise<JournalEntry | null> {
    const entry = await this.getEntryById(journalid);

    if (!entry) {
      console.error(`Journal entry with uuid = ${journalid} not found`);
      return null;
    }

    const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
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

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    // ---------- FEATURED IMAGE ----------
    if (file) {
      const result = await uploadToCloudinary(file.buffer);
      entry.image_url = result.secure_url;
    } else if (image_url === '') {
      entry.image_url = null;
    } else if (image_url) {
      entry.image_url = image_url;
    }

    // ---------- MEDIA ----------
    let processedMedia: any[] = [];

    if (media) {
      try {
        processedMedia = Array.isArray(media) ? media : JSON.parse(media);
      } catch {
        processedMedia = [];
      }
    }

    const files = mediaFiles || [];

    const uploadResults = await Promise.all(
      processedMedia.map(async (m, index) => {
        const file = files[index];

        if (!file) return null;

        const result = await uploadToCloudinary(file.buffer);

        return {
          id: m.id,
          url: result.secure_url,
        };
      }),
    );

    const media_urls: string[] = entry.media_urls || [];

    uploadResults.forEach((res) => {
      if (!res) return;

      const tempLink = `devlog-temp://${res.id}`;
      journal_content = journal_content.replaceAll(tempLink, res.url);

      media_urls.push(res.url);
    });

    // ---------- UPDATE ENTRY ----------
    entry.journal_title = journal_title;
    entry.created_at = created_at;
    entry.journal_content = journal_content;
    entry.journal_tags = journal_tags;
    entry.media_urls = media_urls;

    return this.journalRepository.save(entry);
  }
}
