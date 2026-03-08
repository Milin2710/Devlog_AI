export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  media: MediaFile[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  image_url: string;
  isPublic: boolean;
  allowedEmails: string[];
}

export interface CreateJournalEntryData {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateJournalEntryData {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface MediaFile {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  markdownSyntax: string;
  file: File;
}

export interface SummaryData {
  summary: string;
  wordCount: number;
  readingTime: number;
}