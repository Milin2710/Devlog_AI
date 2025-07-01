import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('share')
export class ShareController {
  constructor(private readonly ShareService: ShareService) {}

  @Post('save')
  async saveSharedEntry(
    @Body()
    body: {
      isPublic: boolean;
      allowedEmails: string[];
      journalid: string;
    },
  ): Promise<any> {
    const { isPublic, allowedEmails, journalid } = body;
    if (!journalid) {
      throw new Error('Journal ID is required');
    }
    if (typeof isPublic !== 'boolean') {
      throw new Error('isPublic must be a boolean');
    }
    if (!Array.isArray(allowedEmails)) {
      throw new Error('allowedEmails must be an array of strings');
    }
    if (allowedEmails.some((email) => typeof email !== 'string')) {
      throw new Error('All allowedEmails must be strings');
    }
    const entry = await this.ShareService.saveSharedEntry(
      isPublic,
      allowedEmails,
      journalid,
    );
    return { message: 'Shared entry saved successfully' };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':journalid')
  async getSharedEntry(
    @Req() request: RequestWithUser,
    @Param('journalid') journalid: string,
  ): Promise<any> {
    if (!journalid) {
      throw new Error('Journal ID is required');
    }
    if (!request.user) {
      const entry = await this.ShareService.getSharedEntry(journalid, '');

      if (!entry) {
        throw new UnauthorizedException(
          'Journal entry not found or not shared controller',
        );
      }
      return { entry };
    }
    const entry = await this.ShareService.getSharedEntry(
      journalid,
      request.user.email,
    );
    if (!entry) {
      throw new UnauthorizedException('Journal entry not found or not shared');
    }
    return { entry };
  }
}
