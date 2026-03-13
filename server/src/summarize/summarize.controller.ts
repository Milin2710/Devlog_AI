import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { SummarizeService } from './summarize.service';
import { LogsService } from '../logs/logs.service';
import { RequestWithUser } from '../auth/types/request-with-user.interface';

@Controller()
export class SummarizeController {
  constructor(
    private readonly summarizeService: SummarizeService,
    private readonly logsService: LogsService,
  ) {}
  @Post('/summarize')
  async summarize(
    @Body('markdownText') markdownText: string,
    @Req() request: RequestWithUser,
  ) {
    const summary = await this.summarizeService.summarizeMarkdown(markdownText);

    await this.logsService.log({
      user_uuid: request.user?.uuid,
      user_email: request.user?.email,
      action: 'markdown_summarize',
      service: 'summarize',
      endpoint: request.originalUrl,
      method: request.method,
      ip_address: request.ip,
      metadata: {
        journal_length: markdownText.length,
        summary_length: summary.length,
      },
    });

    return { summary };
  }
}
