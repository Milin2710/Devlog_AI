import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SummarizeService {
  async summarizeMarkdown(markdownText: string): Promise<string> {
    const prompt =
      'Summarize the following markdown content clearly and concisely in markdown format:';

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
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD7miafKV3wGGX8EFz8b8EkNnLPRYDjxy0',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Gemini response:', response.data);

      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || ''
      );
    } catch (error) {
      console.error('❌ Gemini API error:', error?.response?.data || error);
      throw new Error('Failed to summarize markdown');
    }
  }
}
