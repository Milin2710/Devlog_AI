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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { JournalEntry } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  X,
  Plus,
  Save,
  ArrowLeft,
  CalendarIcon,
  Upload,
  ImageIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import axios from "axios";

interface JournalEntryFormProps {
  entry: JournalEntry;
}

export function JournalEntryForm({ entry }: JournalEntryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry.journal_title);
  const [content, setContent] = useState(entry.journal_content);
  const [tags, setTags] = useState<string[]>(entry.journal_tags);
  const [newTags, setNewTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    entry.image_url || null
  );
  const [currentImage, setCurrentImage] = useState<string | null>(
    entry.image_url || null
  );
  const [imageChanged, setImageChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(entry.created_at)
  );

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
      setImageChanged(true);

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
    setCurrentImage(null);
    setImageChanged(true);
    // Reset the file input
    const fileInput = document.getElementById(
      "featured-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const resetToOriginalImage = () => {
    setFeaturedImage(null);
    setImagePreview(entry.image_url);
    setCurrentImage(entry.image_url);
    setImageChanged(false);
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
    if (!selectedDate) {
      alert("Please select a date.");
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("journal_title", title);
    formData.append("created_at", selectedDate.toISOString());
    formData.append("journal_content", content);
    formData.append("journal_tags", JSON.stringify(tags));
    console.log("Submitting entry:", {
      title,
      selectedDate,
      content,
      tags,
      imageChanged,
      featuredImage,
      currentImage,
    });
    if (imageChanged) {
      if (featuredImage) {
        formData.append("file", featuredImage); // send new file
      } else {
        formData.append("image_url", ""); // signal to backend to remove image
      }
    } else {
      formData.append("image_url", currentImage || ""); // unchanged
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/journal/${entry.uuid}`,
        formData,
        {
          withCredentials: true,
        }
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error updating entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isToday = selectedDate === new Date();
  const isFuture = selectedDate > new Date();

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
          {title ? "Edit Entry" : "New Journal Entry"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title ? "Edit Entry" : "New Entry"}</CardTitle>
          <CardDescription>
            {title ? "Update your journal entry" : "Create new journal"}
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
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                        }
                      }}
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

            {/* Featured Image Section */}
            <div className="space-y-2">
              <Label htmlFor="featured-image">Featured Image</Label>
              <div className="space-y-4">
                {/* Current/Preview Image */}
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Featured image preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-2">
                          {imageChanged && entry.image_url && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={resetToOriginalImage}
                              className="bg-white/90 hover:bg-white text-slate-900"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reset
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="bg-red-500/90 hover:bg-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>
                          {featuredImage
                            ? featuredImage.name
                            : imageChanged
                            ? "Modified"
                            : "Current featured image"}
                        </span>
                        {imageChanged && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 dark:bg-blue-900/20"
                          >
                            {featuredImage ? "New upload" : "Will be removed"}
                          </Badge>
                        )}
                      </div>
                      {featuredImage && (
                        <span>
                          {(featuredImage.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                    <input
                      id="featured-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="featured-image" className="cursor-pointer">
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
                )}

                {/* Replace/Add Image Button */}
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="relative">
                      <input
                        id="replace-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="replace-image" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="pointer-events-none"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Replace Image
                        </Button>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {entry.image_url
                  ? "Update or remove the featured image for your journal entry"
                  : "Add a featured image to make your journal entry more visual and engaging"}
              </p>
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
                {isLoading
                  ? title
                    ? "Updating..."
                    : "Creating..."
                  : title
                  ? "Update Entry"
                  : "Create Entry"}
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
