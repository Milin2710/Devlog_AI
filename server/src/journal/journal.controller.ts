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
  UseInterceptors,
} from '@nestjs/common';
import { JournalEntry } from './journal.entity';
import { JournalService } from './journal.service';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async createEntry(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      journal_title: string;
      journal_content: string;
      journal_tags: string[];
      created_at: Date;
    },
    @Req() request: RequestWithUser,
  ): Promise<JournalEntry> {
    if (!request.user) {
      throw new Error('User not found in request');
    }
    return this.journalService.createEntry(
      request.user.uuid,
      request.user.email,
      request.user.first_name,
      request.user.last_name,
      body.journal_title,
      body.created_at || new Date(),
      body.journal_content,
      body.journal_tags,
      file,
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
    return this.journalService.getAllEntries(request.user.uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':journalid')
  async getEntry(
    @Req() request: RequestWithUser,
    @Param('journalid') journalid: string,
  ) {
    if (!request.user) {
      throw new Error('User not found in request');
    }
    const entry = await this.journalService.getEntryById(journalid);
    if (!entry) {
      throw new Error('Journal entry not found');
    }
    return entry;
  }

  @Delete(':journalid')
  async deleteEntry(@Param('journalid') journalid: string) {
    const deleted = await this.journalService.deleteEntry(journalid);
    if (!deleted) {
      throw new Error('Journal entry not found or could not be deleted');
    }
    return { message: 'Journal entry deleted successfully' };
  }

  @Put(':journalid')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async updateEntry(
    @Param('journalid') journalid: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
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

    return this.journalService.updateEntry(
      journalid,
      journal_title,
      new Date(created_at),
      journal_content,
      tags,
      file,
      image_url,
    );
  }
}
