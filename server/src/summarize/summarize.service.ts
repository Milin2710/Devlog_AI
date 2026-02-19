import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SummarizeService {
  async summarizeMarkdown(markdownText: string): Promise<string> {
    const prompt = `
You are an assistant that reads markdown content and summarizes it in well-structured HTML for display in a web application.

- The summary should be concise and capture the main points.
- Use proper HTML tags like <h2>, <p>, <ul>, <li>, <strong>, etc.
- Avoid wrapping the whole output in a <div>.
- DO NOT use <pre> or <code> tags.
- DO NOT return markdown — only clean, valid HTML.

Summarize the following markdown content:

${markdownText}
`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
        },
      );

      return response.data?.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('❌ Groq API error:', error?.response?.data || error);
      throw new Error('Failed to summarize markdown');
    }
  }
}
