"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JournalEntry } from "@/lib/types";
import { Calendar, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { capitalize } from "lodash";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete?: (id: string) => void;
}

export function JournalEntryCard({ entry, onDelete }: JournalEntryCardProps) {
  console.log("Rendering JournalEntryCard for entry:", entry);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPreview = (content: string) => {
    // Remove markdown formatting and get first 150 characters
    if (!content) return "No content available";
    const plainText = content.replace(/[#*`]/g, "").replace(/\n/g, " ");
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1 line-clamp-2">
              <Link
                href={`/journal/${entry.uuid}`}
                className="hover:text-blue-600 transition-colors"
              >
                {capitalize(entry.journal_title)}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(entry.created_at)}
              {entry.updated_at !== entry.created_at && (
                <span className="ml-2 text-xs">(edited)</span>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/journal/${entry.uuid}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${entry.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(entry.uuid)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
          {getPreview(entry.journal_content)}
        </p>
        {entry.journal_tags && entry.journal_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.journal_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
