import { Controller, Get, Body, Post } from '@nestjs/common';
import { AutotagService } from './autotag.service';

@Controller()
export class AutotagController {
  constructor(private readonly autotagService: AutotagService) {}

  @Post('/autotag')
  async generateTags(@Body('markdownText') markdownText: string) {
    const tags = await this.autotagService.generateTags(markdownText);
    return { tags };
  }
}
