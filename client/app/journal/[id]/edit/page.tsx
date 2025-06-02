"use client";

import { useState, useEffect } from "react";
import { JournalEntryForm } from "@/components/journal-entry-form";
import type { JournalEntry } from "@/lib/types";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/journal/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setEntry(data);
        console.log("Fetched entry data:", data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching entry:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Entry not found
          </h1>
        </div>
      </div>
    );
  }

  return <JournalEntryForm entry={entry} />;
}
