import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  Param,
  UseGuards,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { JournalEntry } from './journal.entity';
import { JournalService } from './journal.service';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { LogsService } from '../logs/logs.service';

@Controller('journal')
export class JournalController {
  constructor(
    private readonly journalService: JournalService,
    private readonly logsService: LogsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'mediaFiles', maxCount: 20 },
    ]),
  )
  async createEntry(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      mediaFiles?: Express.Multer.File[];
    },
    @Body() body,
    @Req() request: RequestWithUser,
  ) {
    const featured = files.file?.[0];
    const mediaFiles = files.mediaFiles || [];

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'journal_entry_created',
      service: 'journal',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journal_title: body.journal_title,
        created_at: body.created_at,
        journal_content_length: body.journal_content.length,
        journal_tags_length: body.journal_tags?.length || 0,
        media_files_count: mediaFiles.length,
        has_featured_image: !!featured,
      },
    });

    return this.journalService.createEntry(
      request.user.uuid,
      request.user.email,
      request.user.first_name,
      request.user.last_name,
      body.journal_title,
      body.created_at || new Date(),
      body.journal_content,
      body.journal_tags,
      body.media,
      featured,
      mediaFiles,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllEntries(
    @Req() request: RequestWithUser,
  ): Promise<JournalEntry[]> {
    if (!request.user) {
      throw new Error('User not found in request');
    }

    const journalEntries = await this.journalService.getAllEntries(
      request.user.uuid,
    );

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'journal_entries_retrieved',
      service: 'journal',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        number_of_entries: journalEntries.length,
        retrieved_at: new Date(),
      },
    });

    return journalEntries;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':journalid')
  async getEntry(
    @Req() request: RequestWithUser,
    @Param('journalid') journalid: string,
  ) {
    if (!request.user) {
      await this.logsService.log({
        action: 'guest_access_denied',
        service: 'journal',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          journalId: journalid,
        },
      });
      throw new UnauthorizedException('User not found in request');
    }
    const entry = await this.journalService.getEntryById(journalid);
    if (!entry) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'journal_entry_not_found',
        service: 'journal',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          journalId: journalid,
        },
      });
      throw new UnauthorizedException('Journal entry not found');
    }
    if (entry.author_uuid !== request.user.uuid) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'unauthorized_journal_entry_access_attempt',
        service: 'journal',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          journalId: journalid,
        },
      });
      throw new UnauthorizedException(
        'Unauthorized access to this journal entry',
      );
    }

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'journal_entry_retrieved',
      service: 'journal',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journalId: journalid,
        journaltitle: entry.journal_title,
      },
    });

    return entry;
  }

  @Delete(':journalid')
  async deleteEntry(
    @Param('journalid') journalid: string,
    @Req() request: RequestWithUser,
  ) {
    const deleted = await this.journalService.deleteEntry(journalid);
    if (!deleted) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'journal_entry_not_found',
        service: 'journal',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          journalId: journalid,
        },
      });

      throw new Error('Journal entry not found or could not be deleted');
    }
    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'journal_entry_deleted',
      service: 'journal',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journalId: journalid,
      },
    });
    return { message: 'Journal entry deleted successfully' };
  }

  @Put(':journalid')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'mediaFiles', maxCount: 20 },
      ],
      { storage: multer.memoryStorage() },
    ),
  )
  async updateEntry(
    @Param('journalid') journalid: string,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      mediaFiles?: Express.Multer.File[];
    },
    @Body() body: any,
    @Req() request: RequestWithUser,
  ) {
    const featured = files.file?.[0];
    const mediaFiles = files.mediaFiles || [];

    const journal_title = body.journal_title;
    const created_at = body.created_at;
    const journal_content = body.journal_content;
    const image_url = body.image_url;

    let tags: string[] = [];
    try {
      tags =
        typeof body.journal_tags === 'string'
          ? JSON.parse(body.journal_tags)
          : body.journal_tags;
    } catch {
      console.warn('Invalid journal_tags format');
    }

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'journal_entry_updated',
      service: 'journal',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journalId: journalid,
        journaltitle: journal_title,
      },
    });

    return this.journalService.updateEntry(
      journalid,
      journal_title,
      new Date(created_at),
      journal_content,
      tags,
      featured,
      image_url,
      mediaFiles,
      body.media,
    );
  }
}
