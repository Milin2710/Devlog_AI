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
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@Controller('share')
export class ShareController {
  constructor(
    private readonly ShareService: ShareService,
    private readonly logsService: LogsService,
  ) {}

  @Post('save')
  async saveSharedEntry(
    @Body()
    body: {
      isPublic: boolean;
      allowedEmails: string[];
      journalid: string;
    },
    @Req() request: RequestWithUser,
  ): Promise<any> {
    const { isPublic, allowedEmails, journalid } = body;
    if (!journalid) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_save_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'Journal ID is missing',
        },
      });

      throw new Error('Journal ID is required');
    }
    if (typeof isPublic !== 'boolean') {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_save_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'isPublic is not a boolean',
        },
      });
      throw new Error('isPublic must be a boolean');
    }
    if (!Array.isArray(allowedEmails)) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_save_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'allowedEmails is not an array',
        },
      });
      throw new Error('allowedEmails must be an array of strings');
    }
    if (allowedEmails.some((email) => typeof email !== 'string')) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_save_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'All allowedEmails must be strings',
        },
      });
      throw new Error('All allowedEmails must be strings');
    }
    const entry = await this.ShareService.saveSharedEntry(
      isPublic,
      allowedEmails,
      journalid,
    );
    if (!entry) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_save_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'Failed to save shared entry',
        },
      });
      throw new Error('Failed to save shared entry');
    }

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'share_entry_saved',
      service: 'share',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journalid: journalid,
        isPublic: isPublic,
        allowedEmailsCount: allowedEmails.length,
      },
    });

    return { message: 'Shared entry saved successfully' };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':journalid')
  async getSharedEntry(
    @Req() request: RequestWithUser,
    @Param('journalid') journalid: string,
  ): Promise<any> {
    if (!journalid) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_retrieve_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'Journal ID is required',
        },
      });

      throw new Error('Journal ID is required');
    }
    if (!request.user) {
      const entry = await this.ShareService.getSharedEntry(journalid, '');

      if (!entry) {
        await this.logsService.log({
          user_uuid: 'anonymous',
          user_email: 'anonymous',
          action: 'share_entry_retrieve_failed',
          service: 'share',
          endpoint: request.originalUrl,
          method: request.method,
          ip_address: request.ip,
          metadata: {
            reason: 'Journal entry not found or not shared',
          },
        });
        throw new UnauthorizedException(
          'Journal entry not found or not shared controller',
        );
      }
      await this.logsService.log({
        user_uuid: 'anonymous',
        user_email: 'anonymous',
        action: 'share_entry_retrieved',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'Journal entry retrieved successfully for anonymous user',
        },
      });

      return { entry };
    }
    const entry = await this.ShareService.getSharedEntry(
      journalid,
      request.user.email,
    );
    if (!entry) {
      await this.logsService.log({
        user_uuid: request.user?.uuid,
        user_email: request.user?.email,
        action: 'share_entry_retrieve_failed',
        service: 'share',
        endpoint: request.originalUrl,
        method: request.method,
        ip_address: request.ip,
        metadata: {
          reason: 'Journal entry not found or not shared',
        },
      });
      throw new UnauthorizedException('Journal entry not found or not shared');
    }
    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'share_entry_retrieved',
      service: 'share',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journalid: journalid,
      },
    });

    return { entry };
  }
}
