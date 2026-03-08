import type { JournalEntry } from "@/lib/types";
import NewEntry from "./New";

interface JournalEntryFormProps {
  entry?: JournalEntry;
  mode: "create" | "edit";
}

export const metadata = {
  title: "*New Journal",
  icons: {
    icon: "/workingicon.ico",
  },
};

export default function NewEntryPage({ entry, mode }: JournalEntryFormProps) {
  return <NewEntry entry={entry} mode={mode} />;
}
