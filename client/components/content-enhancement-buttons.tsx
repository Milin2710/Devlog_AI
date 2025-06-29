"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TypingAnimation from "@/components/typing-animation";
import {
  FileText,
  Sparkles,
  Wand2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

interface ContentEnhancementButtonsProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
  disabled?: boolean;
}

interface EnhancementResult {
  original: string;
  enhanced: string;
  type: "markdown" | "wording";
  suggestions?: string[];
}

export function ContentEnhancementButtons({
  content,
  onContentUpdate,
  disabled,
}: ContentEnhancementButtonsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [processingType, setProcessingType] = useState<
    "markdown" | "wording" | null
  >(null);
  const [copied, setCopied] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const handleFormatAsMarkdown = async () => {
    if (!content.trim()) {
      alert("Please write some content first!");
      return;
    }

    setIsProcessing(true);
    setProcessingType("markdown");
    setShowModal(true);
    setResult(null);
    setTypingComplete(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockMarkdownResult = await generateMarkdownFormat(content);
      setResult({
        original: content,
        enhanced: mockMarkdownResult,
        type: "markdown",
        suggestions: [
          "Added proper headers for better structure",
          "Formatted code blocks with syntax highlighting",
          "Created bullet points for better readability",
          "Added emphasis to important concepts",
        ],
      });
    } catch (error) {
      console.error("Error formatting content:", error);
      alert("Failed to format content. Please try again.");
      setShowModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImproveWording = async () => {
    if (!content.trim()) {
      alert("Please write some content first!");
      return;
    }

    setIsProcessing(true);
    setProcessingType("wording");
    setShowModal(true);
    setResult(null);
    setTypingComplete(false);

    try {
      // Simulate API call - in real app, this would call an AI service
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const mockImprovedResult = await generateImprovedWording(content);
      setResult({
        original: content,
        enhanced: mockImprovedResult,
        type: "wording",
        suggestions: [
          "Enhanced clarity and readability",
          "Improved technical terminology",
          "Better sentence structure and flow",
          "More engaging and professional tone",
        ],
      });
    } catch (error) {
      console.error("Error improving content:", error);
      alert("Failed to improve content. Please try again.");
      setShowModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMarkdownFormat = async (text: string): string => {
    // console.log("Formatting markdown:", text);
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/markdown/format",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdownText: text }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to format markdown");
    }
    const data = await response.json();
    if (data.summary.startsWith("```markdown")) {
      return data.summary
        .replace(/^```markdown\s*([\s\S]*?)\s*```$/, "$1")
        .trim();
    }
    return data.summary;
  };

  const generateImprovedWording = async (text: string): string => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/markdown/improvewording",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdownText: text }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to format markdown");
    }
    const data = await response.json();
    // console.log("Formatted markdown response:", data.improvedWording);
    if (data.improvedWording.startsWith("```markdown")) {
      return data.improvedWording
        .replace(/^```markdown\s*([\s\S]*?)\s*```$/, "$1")
        .trim();
    }
    return data.improvedWording;
  };

  const handleApplyChanges = () => {
    if (result) {
      onContentUpdate(result.enhanced);
      setShowModal(false);
      setResult(null);
    }
  };

  const handleCopyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.enhanced);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  const handleRegenerate = () => {
    if (processingType === "markdown") {
      handleFormatAsMarkdown();
    } else if (processingType === "wording") {
      handleImproveWording();
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFormatAsMarkdown}
          disabled={disabled || isProcessing || !content.trim()}
          className="flex items-center gap-2 bg-transparent"
        >
          <FileText className="h-4 w-4" />
          Format as Markdown
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImproveWording}
          disabled={disabled || isProcessing || !content.trim()}
          className="flex items-center gap-2 bg-transparent"
        >
          <Sparkles className="h-4 w-4" />
          Improve Wording
        </Button>
      </div>

      {/* Enhancement Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {processingType === "markdown" ? (
                <>
                  <FileText className="h-5 w-5 text-blue-600" />
                  Markdown Formatting
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Improved Wording
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {processingType === "markdown"
                ? "AI-powered markdown formatting to structure your content"
                : "AI-enhanced wording to improve clarity and professionalism"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {isProcessing && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <Wand2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 animate-pulse" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {processingType === "markdown"
                      ? "Formatting your content..."
                      : "Improving your wording..."}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            )}

            {result && !isProcessing && (
              <>
                {/* Suggestions */}
                {result.suggestions && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        AI Improvements Applied
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Before and After Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Badge variant="outline">Original</Badge>
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                          {result.original}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced */}
                  <Card className="border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        >
                          Enhanced
                        </Badge>
                      </h4>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          <TypingAnimation
                            text={result.enhanced}
                            // speed={15}
                            onComplete={() => setTypingComplete(true)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                {typingComplete && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Enhanced
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowModal(false)}
                      >
                        Keep Original
                      </Button>
                      <Button
                        onClick={handleApplyChanges}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
