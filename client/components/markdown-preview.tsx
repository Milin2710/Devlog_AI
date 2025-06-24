"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [formattedContent, setFormattedContent] = useState<string>("");

  useEffect(() => {
    if (content.trim()) {
      showPreview(content);
    } else {
      setFormattedContent("");
    }
  }, [content]);

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

  const showPreview = async (content: string) => {
    const formatted = await formatContent(content);
    setFormattedContent(formatted);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-4 w-4" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!content.trim() ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-center">
              Start typing to see your
              <br />
              markdown preview here
            </p>
          </div>
        ) : (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          ></div>
        )}
      </CardContent>
    </Card>
  );
}
