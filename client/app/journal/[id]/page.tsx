"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TypingAnimation from "@/components/typing-animation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JournalEntry } from "@/lib/types";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Brain,
  MoreVertical,
  ImageIcon,
  Eye,
  Download,
  ArrowBigDown,
} from "lucide-react";
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
import axios from "axios";
import { set } from "date-fns";
import html2pdf from "html2pdf.js";

interface SummaryData {
  summary: string;
  wordCount: number;
  readingTime: number;
}

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
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [downloadsum, setDownloadsum] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const pdfSumRef = useRef<HTMLDivElement>(null);

  console.log("Rendering EntryPage for ID:", id);
  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/journal/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched entry data:", response);
      const data = await response.data;
      setEntry(data);
      const formatted = await formatContent(data.journal_content);
      setFormattedContent(formatted);
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
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/journal/${id}`
        );
        router.push("/dashboard");
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

  const formatContent = async (content: string): Promise<string> => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeDocument)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(content);

    return file.toString();
  };

  const handleDownload = () => {
    if (!pdfRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `${entry.journal_title}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  const handleDownloadSummary = () => {
    if (!pdfSumRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `${entry.journal_title} Summary.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfSumRef.current).save();
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

  function handleSummarize() {
    setIsSummarizing(true);
    setShowSummary(true);
    setTypingComplete(false);
    setSummaryData(null);

    const markdownText = entry.journal_content;
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summarize`, {
        markdownText,
      })
      .then(async (response) => {
        console.log("Summarized content:", response.data);
        const formatted = await formatContent(response.data.summary);
        setSummaryData(response.data.summary);
        setIsSummarizing(false);
      })
      .catch((error) => {
        console.error(
          "Error summarizing content:",
          error?.response?.data || error.message
        );
        setIsSummarizing(false);
      });
  }
  // console.log("Formatted Content:", formattedContent);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        {entry.image_url ? (
          <div className="relative h-96 overflow-hidden">
            <img
              src={entry.image_url || "/placeholder.svg"}
              alt={entry.journal_title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Back button overlay */}
            <div className="absolute top-6 left-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center bg-white/90 hover:bg-white text-slate-900 rounded-lg transition-colors backdrop-blur-sm h-9 w-9"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>

            {/* Action buttons overlay */}
            <div className="absolute top-6 right-6 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  handleSummarize();
                  setIsSummarizing(true);
                }}
                disabled={isSummarizing}
                className="bg-white/90 hover:bg-white text-slate-900"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isSummarizing ? "Summarizing..." : "AI Summary"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 bg-white/90 hover:bg-white text-slate-900"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {/* Download */}
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDownload();
                    }}
                    className="cursor-pointer"
                  >
                    <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Download</span>
                  </DropdownMenuItem>

                  {/* Edit */}
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/journal/${entry.uuid}/edit`}
                      className="flex items-center w-full text-sm cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  {/* Delete */}
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-sm">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title and metadata overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {entry.journal_title}
                </h1>

                <div className="flex items-center gap-6 text-white/90 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Created: {formatDate(entry.created_at)}
                  </div>
                  {entry.updated_at !== entry.created_at && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Updated: {formatDate(entry.updated_at)}
                    </div>
                  )}
                </div>

                {entry.journal_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.journal_tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-b">
            <div className="max-w-4xl mx-auto p-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-6 transition-colors h-9 w-9 justify-center"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    {entry.journal_title}
                  </h1>

                  <div className="flex items-center gap-6 text-slate-600 dark:text-slate-300 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Created: {formatDate(entry.created_at)}
                    </div>
                    {entry.updated_at !== entry.created_at && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
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

                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    <span>No featured image</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSummarize();
                      setIsSummarizing(true);
                    }}
                    disabled={isSummarizing}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isSummarizing ? "Summarizing..." : "AI Summary"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 bg-white/90 hover:bg-white text-slate-900"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {/* Download */}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          handleDownload();
                        }}
                        className="cursor-pointer"
                      >
                        <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Download</span>
                      </DropdownMenuItem>

                      {/* Edit */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/journal/${entry.uuid}/edit`}
                          className="flex items-center w-full text-sm cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      {/* Delete */}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          handleDelete();
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-sm">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div
              className="prose dark:prose-invert max-w-none"
              ref={pdfRef}
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            ></div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary Modal */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Summary
            </DialogTitle>
            <DialogDescription>
              AI-generated insights and key takeaways from your journal entry
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {isSummarizing && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 animate-pulse" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Analyzing your entry...
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            )}

            {summaryData && !isSummarizing && (
              <>
                {/* AI Summary with Typing Effect */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-y-auto h-[70vh] rounded-lg border border-blue-200 dark:border-blue-800 scrollbar-hide">
                  <TypingAnimation
                    ref={pdfSumRef}
                    text={summaryData}
                    // speed={5}
                    onComplete={() => setTypingComplete(true)}
                  />
                </div>

                {!isSummarizing && (
                  <div className="flex justify-end gap-4">
                    {typingComplete && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDownloadSummary}
                      >
                        <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Download</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSummary(false);
                        setSummaryData(null);
                        setTypingComplete(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
