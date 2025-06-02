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
} from '@nestjs/common';
import { JournalEntry } from './journal.entity';
import { JournalService } from './journal.service';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createEntry(
    @Body()
    body: {
      journal_title: string;
      journal_content: string;
      journal_tags: string[];
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
      body.journal_content,
      body.journal_tags,
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

  @Get(':journalid')
  async getEntry(@Param('journalid') journalid: string) {
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
  async updateEntry(
    @Param('journalid') journalid: string,
    @Body()
    body: {
      journal_title: string;
      journal_content: string;
      journal_tags: string[];
    },
  ) {
    const entry = await this.journalService.getEntryById(journalid);
    if (!entry) {
      throw new Error('Journal entry not found');
    }
    entry.journal_title = body.journal_title;
    entry.journal_content = body.journal_content;
    entry.journal_tags = body.journal_tags;

    return this.journalService.updateEntry(
      journalid,
      entry.journal_title,
      entry.journal_content,
      entry.journal_tags,
    );
  }
}
