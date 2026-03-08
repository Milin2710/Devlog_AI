"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/types";

interface JournalContextType {
  journals: JournalEntry[] | null;
  setJournals: (journals: JournalEntry[] | null) => void;
}

const JournalContext = createContext<JournalContextType | null>(null);

export const JournalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [journals, setJournals] = useState<JournalEntry[] | null>(null);

  return (
    <JournalContext.Provider value={{ journals, setJournals }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournals = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournals must be used within a JournalProvider");
  }
  return context;
};
