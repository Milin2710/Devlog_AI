"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import type { JournalEntry } from "@/lib/types";
import { Flame, Calendar, Trophy, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: JournalEntry[];
  currentStreak: number;
}

interface DayInfo {
  date: Date;
  hasEntry: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  entryCount: number;
}

export function StreakModal({
  open,
  onOpenChange,
  entries,
  currentStreak,
}: StreakModalProps) {
  const [animateFlame, setAnimateFlame] = useState(false);

  useEffect(() => {
    if (open) {
      setAnimateFlame(true);
      const timer = setTimeout(() => setAnimateFlame(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Generate days around today (3 before, today, 3 after)
  const generateDays = (): DayInfo[] => {
    const today = new Date();
    const days: DayInfo[] = [];

    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateStr = date.toISOString().split("T")[0];
      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.createdAt).toISOString().split("T")[0];
        return entryDate === dateStr;
      });

      days.push({
        date,
        hasEntry: dayEntries.length > 0,
        isToday: i === 0,
        isPast: i < 0,
        isFuture: i > 0,
        entryCount: dayEntries.length,
      });
    }

    return days;
  };

  const days = generateDays();

  // Calculate longest streak
  const calculateLongestStreak = (): number => {
    if (entries.length === 0) return 0;

    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const uniqueDates = [
      ...new Set(
        sortedEntries.map(
          (entry) => new Date(entry.createdAt).toISOString().split("T")[0]
        )
      ),
    ].sort();

    let maxStreak = 0;
    let currentStreakCount = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreakCount++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreakCount);
        currentStreakCount = 1;
      }
    }

    return Math.max(maxStreak, currentStreakCount);
  };

  const longestStreak = calculateLongestStreak();

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your coding journey today!";
    if (currentStreak === 1) return "Great start! Keep it going!";
    if (currentStreak < 7) return "Building momentum!";
    if (currentStreak < 30) return "You're on fire! 🔥";
    return "Legendary streak! 🏆";
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "text-slate-500";
    if (currentStreak < 7) return "text-orange-500";
    if (currentStreak < 30) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Flame
              className={cn(
                "h-6 w-6",
                getStreakColor(),
                animateFlame && "animate-bounce"
              )}
            />
            Coding Streak
          </DialogTitle>
          <DialogDescription className="text-center">
            Track your daily coding consistency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Streak Display */}
          <div className="text-center">
            <div className="relative inline-block">
              <Flame
                className={cn(
                  "h-20 w-20 mx-auto mb-4",
                  getStreakColor(),
                  animateFlame && "animate-pulse"
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    "text-2xl font-bold text-white drop-shadow-lg",
                    currentStreak > 99 ? "text-lg" : "text-2xl"
                  )}
                >
                  {currentStreak}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
            </h3>
            <p className={cn("text-lg font-medium", getStreakColor())}>
              {getStreakMessage()}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {longestStreak}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Best Streak
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {entries.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total Entries
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Week View */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </h4>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                      day.isToday &&
                        day.hasEntry &&
                        "bg-green-500 text-white ring-2 ring-green-200 dark:ring-green-800",
                      day.isToday &&
                        !day.hasEntry &&
                        "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ring-2 ring-blue-200 dark:ring-blue-800",
                      !day.isToday &&
                        day.hasEntry &&
                        "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                      !day.isToday &&
                        !day.hasEntry &&
                        day.isPast &&
                        "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
                      !day.isToday &&
                        !day.hasEntry &&
                        day.isFuture &&
                        "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    )}
                  >
                    {day.hasEntry ? (
                      <Zap className="h-3 w-3" />
                    ) : day.isToday ? (
                      day.date.getDate()
                    ) : (
                      day.date.getDate()
                    )}
                  </div>
                  {day.entryCount > 1 && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      +{day.entryCount - 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded-full"></div>
                <span>Entry made</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded-full"></div>
                <span>Missed day</span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          {currentStreak > 0 && (
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    Keep the streak alive!
                  </span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {currentStreak < 7
                    ? "You're building a great habit. One entry at a time!"
                    : currentStreak < 30
                    ? "Amazing consistency! You're in the zone."
                    : "You're a coding journal legend! This is incredible dedication."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* No Streak Message */}
          {currentStreak === 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Start Your Journey
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Create your first journal entry today and begin building your
                  coding streak!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
