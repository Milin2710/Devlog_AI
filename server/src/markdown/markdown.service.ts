import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarkdownService {
  async formatMarkdown(markdownText: string): Promise<string> {
    const prompt =
      `Format the following text into valid Markdown.\n\n` +
      `Do not change, rephrase, or improve any words.\n` +
      `Only add appropriate Markdown syntax for headings, lists, code blocks, bold, italics, etc., wherever it fits naturally.\n` +
      `If the content feels like plain paragraphs, structure it better using appropriate Markdown features like headings, subheadings, bullet points, or numbered lists where suitable.\n` +
      `Keep the original wording exactly as it is.\n\n` +
      `Text:\n\n${markdownText}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
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

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content returned from Gemini API');
      }

      return content;
    } catch (error) {
      console.error('❌ Gemini API error:', error?.response?.data || error);
      throw new Error('Failed to format markdown');
    }
  }

  async improveWording(markdownText: string): Promise<string> {
    const prompt =
      `Improve the grammar, spelling, and sentence structure of the following Markdown text.\n\n` +
      `Do not change or remove any technical terms, variable names, code, or keywords.\n` +
      `Keep the original meaning and formatting.\n` +
      `Only correct grammar and improve clarity like Grammarly would.\n` +
      `Return the output in valid Markdown format.\n` +
      `If the content feels like plain paragraphs, structure it better using features like headings, subheadings, bullet points, or numbered lists where suitable.\n\n` +
      `Text:\n\n${markdownText}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
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

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content returned from Gemini API');
      }

      return content;
    } catch (error) {
      console.error('❌ Gemini API error:', error?.response?.data || error);
      throw new Error('Failed to summarize markdown');
    }
  }
}
