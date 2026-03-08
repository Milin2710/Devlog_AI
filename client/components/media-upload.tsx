"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Copy, Check, Image as ImageIcon, Plus } from "lucide-react";
import type { MediaFile } from "@/lib/types";

interface MediaUploadProps {
  media: MediaFile[];
  onMediaAdd: (files: MediaFile[]) => void;
  onMediaRemove: (mediaId: string) => void;
  onInsertMarkdown?: (markdown: string) => void;
  disabled?: boolean;
  // onChange: (file: File) => void;
}

export function MediaUpload({
  media,
  onMediaAdd,
  onMediaRemove,
  onInsertMarkdown,
  disabled = false,
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedMedia: MediaFile[] = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.warn(`Skipping ${file.name} - not an image file`);
          continue;
        }

        // Validate file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          console.warn(`Skipping ${file.name} - file size exceeds 5MB`);
          continue;
        }

        // Create unique ID for the media file
        const mediaId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create preview URL (base64)
        const reader = new FileReader();
        const url = await new Promise<string>((resolve) => {
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });

        const mediaFile: MediaFile = {
          id: mediaId,
          url,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          markdownSyntax: `![${file.name}](devlog-temp://${mediaId})`,
          file,
        };

        uploadedMedia.push(mediaFile);
      }

      if (uploadedMedia.length > 0) {
        onMediaAdd([...media, ...uploadedMedia]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const copyToClipboard = (syntax: string, id: string) => {
    navigator.clipboard.writeText(syntax);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertMarkdown = (syntax: string, id: string) => {
    if (onInsertMarkdown) {
      onInsertMarkdown(syntax);
      setInsertedId(id);
      setTimeout(() => setInsertedId(null), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media Files
        </CardTitle>
        <CardDescription>
          Upload and insert images into your journal entry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading || disabled}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || disabled}
              className="w-full"
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-slate-400" />
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF up to 5MB each (multiple files supported)
                </p>
              </div>
            </button>
          </div>
          {isUploading && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 text-center">
              Uploading...
            </p>
          )}
        </div>

        {/* Uploaded Media List */}
        {media.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Uploaded Media ({media.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {media.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <img
                        src={file.url}
                        alt={file.filename}
                        className="h-10 w-10 rounded object-cover border border-slate-200 dark:border-slate-600"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {file.filename}
                      </p>
                      <code className="text-xs text-slate-600 dark:text-slate-400 break-all">
                        {file.markdownSyntax}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {onInsertMarkdown && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          insertMarkdown(file.markdownSyntax, file.id)
                        }
                        className="h-8 w-8 p-0"
                        title="Insert into content"
                      >
                        {insertedId === file.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(file.markdownSyntax, file.id)
                      }
                      className="h-8 w-8 p-0"
                      title="Copy markdown syntax"
                    >
                      {copiedId === file.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMediaRemove(file.id)}
                      className="h-8 w-8 p-0 hover:text-red-600"
                      title="Remove media"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">How to use images:</p>
              <ul className="text-xs space-y-1">
                <li>
                  • Click the <Plus className="h-3 w-3 inline" /> icon to insert
                  directly into your content
                </li>
                <li>
                  • Click the <Copy className="h-3 w-3 inline" /> icon to copy
                  the markdown syntax
                </li>
                <li>
                  • Edit markdown syntax directly in the content area to
                  customize alt text or styling
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
