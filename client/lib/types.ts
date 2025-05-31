export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateJournalEntryData {
  title: string
  content: string
  tags: string[]
}

export interface UpdateJournalEntryData {
  title?: string
  content?: string
  tags?: string[]
}
