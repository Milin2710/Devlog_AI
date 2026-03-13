import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { LogsService } from '../logs/logs.service';
import { RequestWithUser } from '../auth/types/request-with-user.interface';

@Controller('/markdown')
export class MarkdownController {
  constructor(
    private readonly markdownService: MarkdownService,
    private readonly logsService: LogsService,
  ) {}
  @Post('/format')
  async summarize(
    @Body('markdownText') markdownText: string,
    @Req() request: RequestWithUser,
  ) {
    const formatted = await this.markdownService.formatMarkdown(markdownText);

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'markdown_formatted',
      service: 'markdown',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        original_length: markdownText.length,
        formatted_length: formatted.length,
      },
    });

    return { formatted };
  }
  @Post('/improvewording')
  async improveWording(
    @Body('markdownText') markdownText: string,
    @Req() request: RequestWithUser,
  ) {
    const improvedWording =
      await this.markdownService.improveWording(markdownText);

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'markdown_improved_wording',
      service: 'markdown',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        original_length: markdownText.length,
        improved_length: improvedWording.length,
      },
    });

    return { improvedWording };
  }
}
