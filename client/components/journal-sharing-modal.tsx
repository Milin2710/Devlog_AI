"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { JournalEntry } from "@/lib/types";
import {
  Share2,
  Globe,
  Users,
  Copy,
  Check,
  X,
  Plus,
  Eye,
  Lock,
  Mail,
  ExternalLink,
  AlertCircle,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJournals } from "@/context/JournalContext";

interface JournalSharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: JournalEntry;
  onUpdate?: (updatedEntry: JournalEntry) => void;
}

interface SaveSettings {
  isPublic: boolean;
  allowedEmails: string[];
  journalid: string;
}

export function JournalSharingModal({
  open,
  onOpenChange,
  entry,
  onUpdate,
}: JournalSharingModalProps) {
  const { journals, setJournals } = useJournals();
  const [originalSettings, setOriginalSettings] = useState<SaveSettings>({
    isPublic: entry.isPublic,
    allowedEmails: entry.allowedEmails || [],
    journalid: entry.uuid,
  });
  const [currentSettings, setCurrentSettings] = useState<SaveSettings>({
    isPublic: false,
    allowedEmails: [],
    journalid: entry.uuid,
  });
  const [newEmail, setNewEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (open) {
      loadSharingSettings();
    }
  }, [open, entry.uuid]);

  const loadSharingSettings = async () => {
    setIsLoading(true);
    const settings = {
      isPublic: entry.isPublic || false,
      allowedEmails: entry.allowedEmails || [],
      journalid: entry.uuid,
    };
    setOriginalSettings(settings);
    setCurrentSettings(settings);
    setIsLoading(false);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTogglePublic = (isPublic: boolean) => {
    setCurrentSettings((prev) => ({
      ...prev,
      isPublic,
      // If making private, keep the allowed emails
      // If making public, allowed emails become irrelevant but we keep them
    }));
  };

  const handleAddEmail = () => {
    const email = newEmail.trim().toLowerCase();

    if (!email) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (currentSettings.allowedEmails.includes(email)) {
      setEmailError("This email is already added");
      return;
    }

    setCurrentSettings((prev) => ({
      ...prev,
      allowedEmails: [...prev.allowedEmails, email],
    }));
    setNewEmail("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setCurrentSettings((prev) => ({
      ...prev,
      allowedEmails: prev.allowedEmails.filter(
        (email) => email !== emailToRemove
      ),
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/share/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentSettings),
        }
      );

      if (response.ok) {
        setOriginalSettings(currentSettings);
        onOpenChange(false);
        setJournals(null);
        // Show success feedback
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving sharing settings:", error);
      alert("Failed to save sharing settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentSettings(originalSettings);
    setNewEmail("");
    setEmailError("");
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_CORS_ORIGIN +
          "/share/" +
          originalSettings.journalid
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const hasChanges = () => {
    return (
      currentSettings.isPublic !== originalSettings.isPublic ||
      JSON.stringify(currentSettings.allowedEmails.sort()) !==
        JSON.stringify(originalSettings.allowedEmails.sort())
    );
  };

  const getVisibilityStatus = () => {
    if (currentSettings.isPublic) {
      return {
        icon: Globe,
        text: "Public",
        description: "Anyone with the link can view this entry",
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
      };
    } else if (currentSettings.allowedEmails.length > 0) {
      return {
        icon: Users,
        text: "Shared",
        description: `Shared with ${currentSettings.allowedEmails.length} user${
          currentSettings.allowedEmails.length !== 1 ? "s" : ""
        }`,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
    } else {
      return {
        icon: Lock,
        text: "Private",
        description: "Only you can view this entry",
        color: "text-slate-600",
        bgColor: "bg-slate-50 dark:bg-slate-800",
        borderColor: "border-slate-200 dark:border-slate-700",
      };
    }
  };

  const status = getVisibilityStatus();
  const StatusIcon = status.icon;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-300">
                Loading sharing settings...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[650px] h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Share Journal Entry
          </DialogTitle>
          <DialogDescription>
            Control who can view "{entry.journal_title}" and manage sharing
            settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Card className={cn("border-2", status.borderColor, status.bgColor)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <StatusIcon className={cn("h-6 w-6", status.color)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold", status.color)}>
                      {status.text}
                    </span>
                    {currentSettings.isPublic && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      >
                        Live
                      </Badge>
                    )}
                    {hasChanges() && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      >
                        Unsaved changes
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {status.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Public Sharing Toggle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Public Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label
                    htmlFor="public-toggle"
                    className="text-base font-medium"
                  >
                    Make this entry public
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Anyone with the link will be able to view this journal entry
                  </p>
                </div>
                <Switch
                  id="public-toggle"
                  checked={currentSettings.isPublic}
                  onCheckedChange={handleTogglePublic}
                />
              </div>

              {currentSettings.isPublic && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      value={
                        process.env.NEXT_PUBLIC_CORS_ORIGIN +
                        "/share/" +
                        originalSettings.journalid
                      }
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="flex-shrink-0 bg-transparent"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          process.env.NEXT_PUBLIC_CORS_ORIGIN +
                            "/share/" +
                            originalSettings.journalid,
                          "_blank"
                        )
                      }
                      className="flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium">
                          Public entries are visible to everyone
                        </p>
                        <p className="text-amber-700 dark:text-amber-300 mt-1">
                          Make sure you're comfortable sharing this content
                          publicly before enabling.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Private Sharing */}
          {!currentSettings.isPublic && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Private Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor="email-input"
                    className="text-base font-medium"
                  >
                    Share with specific users
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
                    Add email addresses to give specific people access to this
                    entry
                  </p>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="Enter email address..."
                        value={newEmail}
                        onChange={(e) => {
                          setNewEmail(e.target.value);
                          setEmailError("");
                        }}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddEmail()
                        }
                        className={emailError ? "border-red-500" : ""}
                      />
                      <Button
                        onClick={handleAddEmail}
                        disabled={!newEmail.trim()}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shared Users List */}
                {currentSettings.allowedEmails.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Shared with ({currentSettings.allowedEmails.length})
                    </Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {currentSettings.allowedEmails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">{email}</span>
                            <Badge variant="outline" className="text-xs">
                              Can view
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEmail(email)}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentSettings.allowedEmails.length === 0 && (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No users added yet</p>
                    <p className="text-xs">
                      Add email addresses above to share this entry privately
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {currentSettings.isPublic ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Public entry - visible to everyone
                </span>
              ) : currentSettings.allowedEmails.length > 0 ? (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Shared with {currentSettings.allowedEmails.length} user
                  {currentSettings.allowedEmails.length !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Private entry - only you can view
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={!hasChanges() || isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
