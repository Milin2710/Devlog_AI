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
import type { JournalEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Brain,
  ImageIcon,
  Download,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { use } from "react";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useAuth } from "@/context/AuthContext";

export default function SharedEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedContent, setFormattedContent] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const pdfSumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchSharedEntry();
  }, [id]);

  const fetchSharedEntry = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const data = await response.data;
        setEntry(data.entry);
        const formatted = await formatContent(data.entry.journal_content);
        setFormattedContent(formatted);
      } else if (response.status === 404) {
        setError("Entry not found or not shared");
      } else if (response.status === 403) {
        setError("You don't have permission to view this entry");
      } else {
        setError("Failed to load entry");
      }
    } catch (error) {
      console.error("Error fetching shared entry:", error);
      setError("Failed to load entry");
    } finally {
      setIsLoading(false);
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

    setIsDownloading(true);
    setTimeout(() => {
      const opt = {
        margin: 0.5,
        filename: `${entry.journal_title}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(pdfRef.current)
        .save()
        .then(() => setIsDownloading(false));
    }, 0);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Lock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to DEVLOG
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Entry not found
          </h1>
          <Link href="/">
            <Button>Go to DEVLOG</Button>
          </Link>
        </div>
      </div>
    );
  }

  function guestSummarize() {
    setIsSummarizing(true);
    setShowSummary(true);
    setSummaryData(`
      <div class="flex items-center justify-center h-64">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
      Please log in to summarize this entry.
      </h1>
      </div>
      `);
    setIsSummarizing(false);
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

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto p-2 sm:p-6">
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
                  className="z-10"
                  onClick={() => {
                    if (user) {
                      handleSummarize();
                      setIsSummarizing(true);
                    } else {
                      setIsSummarizing(true);
                      guestSummarize();
                    }
                  }}
                  disabled={isSummarizing}
                  className="bg-white/90 hover:bg-white text-slate-900"
                >
                  <Sparkles className="h-4 w-4 mr-0" />
                  <span className="hidden sm:inline">
                    {isSummarizing ? "Summarizing..." : "AI Summary"}
                  </span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-0 text-muted-foreground" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>

              {/* Title and metadata overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto p-0 sm:p-8">
                  <div className="flex items-start justify-between mb-2 sm:mb-6">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Shared Journal Entry
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-5xl sm:4xl font-bold text-white mb-4 leading-tight">
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
              <div className="max-w-4xl mx-auto p-0 sm:p-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-6 transition-colors h-9 w-9 justify-center"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Shared Journal Entry
                      </Badge>
                    </div>
                    <h1 className="text-3xl md:text-5xl sm:4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
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
                      className="z-10"
                      size="sm"
                      onClick={() => {
                        if (user) {
                          handleSummarize();
                          setIsSummarizing(true);
                        } else {
                          setIsSummarizing(true);
                          guestSummarize();
                        }
                      }}
                      disabled={isSummarizing}
                    >
                      <Sparkles className="h-4 w-4 mr-0" />
                      <span className="hidden sm:inline">
                        {isSummarizing ? "Summarizing..." : "AI Summary"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-0 text-muted-foreground" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <Card>
            <CardContent className="p-8">
              <div ref={pdfRef} className="prose dark:prose-invert max-w-none">
                {isDownloading && entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt="Journal header"
                    style={{
                      width: "100%",
                      padding: "12px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                ></div>
              </div>
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
                  <div
                    className={`p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-y-auto h-[70vh] rounded-lg border border-blue-200 dark:border-blue-800 scrollbar-hide ${
                      user ? "h-[70vh]" : "h-[40vh]"
                    }`}
                  >
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
    </>
  );
}
