import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SummarizeService {
  async summarizeMarkdown(markdownText: string): Promise<string> {
    const prompt =
      `You are an assistant that reads markdown content and summarizes it in well-structured HTML for display in a web application.\n\n` +
      `- The summary should be concise and capture the main points.\n` +
      `- Use proper HTML tags like <h2>, <p>, <ul>, <li>, <strong>, etc.\n` +
      `- Avoid wrapping the whole output in a <div>.\n` +
      `- DO NOT use <pre> or <code> tags.\n` +
      `- DO NOT return markdown — only clean, valid HTML.\n\n` +
      `Summarize the following markdown content:\n\n${markdownText}`;

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

      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || ''
      );
    } catch (error) {
      console.error('❌ Gemini API error:', error?.response?.data || error);
      throw new Error('Failed to summarize markdown');
    }
  }
}
