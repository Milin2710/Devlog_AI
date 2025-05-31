import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
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
}
