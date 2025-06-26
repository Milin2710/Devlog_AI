import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AutotagService {
  async generateTags(markdownText: string): Promise<string[]> {
    const prompt =
      `You are an expert in generating relevant tags for markdown content.\n\n` +
      `- Analyze the content and extract key themes, topics, or concepts.\n` +
      `- Generate 4 to 6 concise, descriptive tags that accurately represent the content.\n` +
      `- Each tag should be of one, two or three words separated by '%'.\n\n` +
      `Generate tags for the following markdown content:\n\n${markdownText}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${prompt}\n\n${markdownText}`,
            },
          ],
        },
      ],
    };
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const fullText: string =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || '';

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
