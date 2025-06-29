import { Controller, Get, Body, Post } from '@nestjs/common';
import { MarkdownService } from './markdown.service';

@Controller('/markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}
  @Post('/format')
  async summarize(@Body('markdownText') markdownText: string) {
    const summary = await this.markdownService.formatMarkdown(markdownText);
    return { summary };
  }
  @Post('/improvewording')
  async improveWording(@Body('markdownText') markdownText: string) {
    const improvedWording =
      await this.markdownService.improveWording(markdownText);
    return { improvedWording };
  }
}
