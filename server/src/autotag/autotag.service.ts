import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AutotagService {
  async generateTags(markdownText: string): Promise<string[]> {
    const prompt =
      `You are an expert in generating relevant tags for markdown content.\n\n` +
      `- Analyze the content and extract key themes, topics, or concepts.\n` +
      `- Generate 4 to 6 concise, descriptive tags that accurately represent the content.\n` +
      `- Each tag should be of one, two or three words separated by '%' and don't index them just write the tag.\n\n` +
      `Generate tags for the following markdown content:\n\n${markdownText}`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
        },
      );

      const fullText: string =
        response.data?.choices?.[0]?.message?.content?.trim() || '';

      const lines = fullText.split('\n');

      const tags = lines
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.includes('%') && !line.toLowerCase().startsWith("here's"),
        )
        .map((tag) => tag.toLowerCase());
      return tags;
    } catch (error) {
      console.error('❌ Gemini API error:', error?.response?.data || error);
      throw new Error('Failed to summarize markdown');
    }
  }
}
