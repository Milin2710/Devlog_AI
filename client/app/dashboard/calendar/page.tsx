"use client";

import { useState, useEffect } from "react";
import { ActivityCalendar } from "@/components/activity-calendar";
import type { JournalEntry } from "@/lib/types";
import axios from "axios";
import { useJournals } from "@/context/JournalContext";

export default function CalendarPage() {
  const { journals, setJournals } = useJournals();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!journals || journals.length === 0) {
      fetchEntries();
    } else {
      setEntries(journals);
      setIsLoading(false);
    }
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/journal/all",
        {
          withCredentials: true,
        },
      );
      const data = await response.data;
      const formattedEntries: JournalEntry[] = data.map((entry: any) => ({
        id: entry.uuid,
        userId: entry.userId,
        title: entry.journal_title,
        content: entry.journal_content,
        tags: entry.journal_tags,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
        image_url: entry.image_url,
        isPublic: entry.isPublic,
        allowedEmails: entry.allowed_emails || [],
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Loading calendar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Activity Calendar
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Visualize your coding journey throughout the year. Click on any day to
          see your entries.
        </p>
      </div>

      <ActivityCalendar entries={entries} />
    </div>
  );
}
