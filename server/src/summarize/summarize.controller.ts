import { Controller, Get, Body, Post } from '@nestjs/common';
import { SummarizeService } from './summarize.service';

@Controller()
export class SummarizeController {
  constructor(private readonly summarizeService: SummarizeService) {}
  @Post('/summarize')
  async summarize(@Body('markdownText') markdownText: string) {
    const summary = await this.summarizeService.summarizeMarkdown(markdownText);
    return { summary };
  }
}
