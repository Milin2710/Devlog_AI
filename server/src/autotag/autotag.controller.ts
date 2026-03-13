import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { AutotagService } from './autotag.service';
import { request } from 'http';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { LogsService } from '../logs/logs.service';

@Controller()
export class AutotagController {
  constructor(private readonly autotagService: AutotagService, private readonly logsService: LogsService) {}

  @Post('/autotag')
  async generateTags(
    @Body('markdownText') markdownText: string,
    @Body('journalId') journalId: string,
    @Req() request: RequestWithUser,
  ) {
    const tags = await this.autotagService.generateTags(markdownText);
    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'autotag_generated',
      service: 'autotag',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journalId,
        generatedTagsLength: tags.length,
      },
    });
    return { tags };
  }
}
