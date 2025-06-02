"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JournalEntry } from "@/lib/types";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JournalEntryFormProps {
  entry: JournalEntry;
}

export function JournalEntryForm({ entry }: JournalEntryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry.journal_title);
  const [content, setContent] = useState(entry.journal_content);
  const [tags, setTags] = useState<string[]>(entry.journal_tags);
  const [newTags, setNewTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addTags = () => {
    if (newTags.trim()) {
      // Split by comma or space and filter out empty strings
      const tagsToAdd = newTags
        .split(/[,\s]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag && !tags.includes(tag));

      if (tagsToAdd.length > 0) {
        setTags([...tags, ...tagsToAdd]);
        setNewTags("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/journal/${entry.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            journal_title: title,
            journal_content: content,
            journal_tags: tags,
          }),
        }
      );

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        throw new Error("Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      // In a real app, show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Edit Entry
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Entry</CardTitle>
          <CardDescription>Update your journal entry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you learn today?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your journal entry here... You can use Markdown formatting!"
                className="min-h-[400px] font-mono"
                required
              />
              <p className="text-sm text-slate-500">
                Tip: You can use Markdown formatting (# headers, **bold**,
                `code`, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Add tags (separate with commas or spaces)..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTags())
                  }
                />
                <Button
                  type="button"
                  onClick={addTags}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                You can add multiple tags at once by separating them with commas
                or spaces
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Updating..." : "Update Entry"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
