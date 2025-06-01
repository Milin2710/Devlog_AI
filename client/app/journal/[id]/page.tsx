"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { JournalEntry } from "@/lib/types";
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { use } from "react";
import ReactMarkdown from "react-markdown";
import { capitalize } from "lodash";
import remarkBreaks from "remark-breaks";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedContent, setFormattedContent] = useState<string>("");
  console.log("Rendering EntryPage for ID:", id);
  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await fetch(`http://localhost:3002/journal/${id}`);
      if (response.ok) {
        console.log("Fetched entry data:", response);
        const data = await response.json();
        setEntry(data);
        formatContent(data.journal_content);
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

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        const response = await fetch(`http://localhost:3002/journal/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatContent = async (content: string) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeDocument)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(content);
    setFormattedContent(file.toString());
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
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log("Journal Content:", entry.journal_content);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {capitalize(entry.journal_title)}
              </h1>

              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created: {formatDate(entry.created_at)}
                </div>
                {entry.updated_at !== entry.created_at && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Updated: {formatDate(entry.updated_at)}
                  </div>
                )}
              </div>

              {entry.journal_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {entry.journal_tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link href={`/dashboard/${entry.uuid}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            {/* <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              // rehypePlugins={[rehypeHighlight]}
            >
              {entry.journal_content}
            </ReactMarkdown> */}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            >
              {/* {formatContent(entry.journal_content)} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
