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
import type { JournalEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  X,
  Plus,
  Save,
  ArrowLeft,
  CalendarIcon,
  ImageIcon,
  Trash2,
  Upload,
  BrainCircuit,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { MarkdownPreview } from "@/components/markdown-preview";

interface JournalEntryFormProps {
  entry?: JournalEntry;
  mode: "create" | "edit";
}

export default function NewEntryPage({ entry, mode }: JournalEntryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingtags, setLoadingtags] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setFeaturedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "featured-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/journal/create";
      const entryDate = new Date(selectedDate);
      const now = new Date();
      entryDate.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );
      console.log("FEATURED IMAGE:", featuredImage);

      const formData = new FormData();
      formData.append("journal_title", title);
      formData.append("created_at", entryDate.toISOString());
      formData.append("journal_content", content);
      formData.append("journal_tags", JSON.stringify(tags));
      if (featuredImage) {
        formData.append("file", featuredImage);
      }
      const response = await axios.post(url, formData, {
        withCredentials: true,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTags = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingtags(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/autotag`,
        {
          markdownText: content,
        }
      );
      console.log("data: ", response.data);
      const rawTags: string[] = response.data.tags;

      const cleanedTags = rawTags
        .map((tag) => tag.replace(/^\*\s+/, ""))
        .map((tag) => tag.replace(/%/g, " ").trim())
        .slice(1);

      setTags(cleanedTags);
      console.log("cleaned tags: ", cleanedTags);
    } catch {
      console.error("ERROR generating tags");
    } finally {
      setLoadingtags(false);
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isFuture = selectedDate > new Date();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          New Journal Entry
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Entry</CardTitle>
              <CardDescription>
                Document your coding journey, learnings, and breakthroughs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label>Entry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-slate-500">
                      {isToday
                        ? "Creating entry for today"
                        : isFuture
                        ? "Future dates are not allowed"
                        : `Creating entry for ${format(
                            selectedDate,
                            "MMMM d, yyyy"
                          )}`}
                    </p>
                  </div>
                </div>

                {/* Featured Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="featured-image">Featured Image</Label>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                        <input
                          id="featured-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="featured-image"
                          className="cursor-pointer"
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
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Featured image preview"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeImage}
                              className="opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>{featuredImage?.name}</span>
                          </div>
                          <span>
                            {featuredImage &&
                              (featuredImage.size / 1024 / 1024).toFixed(
                                2
                              )}{" "}
                            MB
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    Add a featured image to make your journal entry more visual
                    and engaging
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                    placeholder="Write your journal entry here... You can use Markdown formatting!"
                    className="min-h-[400px] font-mono resize-none"
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
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={generateTags}
                      variant="secondary"
                      className="bg-[#03469b] text-white hover:bg-[#0761d1]"
                      size="sm"
                    >
                      {loadingtags ? <Loader /> : <BrainCircuit />}
                    </Button>
                  </div>
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
                    {isLoading
                      ? "Saving..."
                      : mode === "create"
                      ? "Create Entry"
                      : "Update Entry"}
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

        {/* Preview Section */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <MarkdownPreview content={content} />
        </div>
      </div>
    </div>
  );
}
