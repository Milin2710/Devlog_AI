"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JournalEntry } from "@/lib/types";
import { Calendar, ChevronLeft, ChevronRight, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActivityCalendarProps {
  entries: JournalEntry[];
}

interface DayData {
  date: Date;
  count: number;
  entries: JournalEntry[];
}

export function ActivityCalendar({ entries }: ActivityCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Generate calendar data for the year
  const calendarMatrix = useMemo(() => {
    const startDate = new Date(currentYear, 0, 1); // January 1st
    const endDate = new Date(currentYear, 11, 31); // December 31st

    // Find the first Sunday before or on the start date
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());

    // Find the last Saturday after or on the end date
    const lastDay = new Date(endDate);
    lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const totalDays =
      Math.ceil(
        (lastDay.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000)
      ) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);

    // Create 7×weeks matrix
    const matrix: (DayData | null)[][] = Array(7)
      .fill(null)
      .map(() => Array(totalWeeks).fill(null));

    const currentDate = new Date(firstDay);
    let week = 0;

    while (currentDate <= lastDay) {
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().split("T")[0];

      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.created_at)
          .toISOString()
          .split("T")[0];
        return entryDate === dateStr;
      });

      matrix[dayOfWeek][week] = {
        date: new Date(dateStr),
        count: dayEntries.length,
        entries: dayEntries,
      };

      currentDate.setDate(currentDate.getDate() + 1);

      // Move to next week after Saturday
      if (dayOfWeek === 6) {
        week++;
      }
    }

    return matrix;
  }, [entries, currentYear]);

  // Get color intensity based on entry count
  const getIntensityClass = (count: number) => {
    if (count === 0)
      return "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    if (count === 1)
      return "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
    if (count === 2)
      return "bg-blue-200 dark:bg-blue-800/50 border-blue-300 dark:border-blue-700";
    if (count === 3)
      return "bg-blue-300 dark:bg-blue-700/70 border-blue-400 dark:border-blue-600";
    return "bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500";
  };

  // Get weeks for display
  const weeks = useMemo(() => {
    const weekArray: DayData[][] = [];
    for (let i = 0; i < calendarMatrix.length; i += 7) {
      weekArray.push(calendarMatrix.slice(i, i + 7));
    }
    return weekArray;
  }, [calendarMatrix]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPreview = (content: string) => {
    const plainText = content.replace(/[#*`]/g, "").replace(/\n/g, " ");
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  const currentYearEntries = entries.filter(
    (entry) => new Date(entry.created_at).getFullYear() === currentYear
  ).length;

  return (
    <>
      <Card className="w-fit">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                {currentYearEntries} entries in {currentYear}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentYear(currentYear - 1)}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium min-w-[3rem] text-center">
                {currentYear}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentYear(currentYear + 1)}
                disabled={currentYear >= new Date().getFullYear()}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {/* Calendar Matrix */}
            <div className="flex gap-1">
              {/* Week day labels */}
              <div className="flex flex-col gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 flex items-center justify-center text-[9px] text-slate-500 dark:text-slate-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Matrix Grid */}
              <div className="flex gap-1">
                {calendarMatrix[0]?.map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {calendarMatrix.map((week, dayIndex) => {
                      const day = week[weekIndex];
                      if (!day) {
                        return <div key={dayIndex} className="w-3 h-3" />;
                      }

                      const isCurrentMonth =
                        day.date.getFullYear() === currentYear;
                      const isToday =
                        day.date.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={dayIndex}
                          onClick={() => setSelectedDay(day)}
                          className={cn(
                            "w-3 h-3 rounded-sm transition-all hover:scale-125",
                            getIntensityClass(day.count),
                            !isCurrentMonth && "opacity-40",
                            isToday && "ring-1 ring-blue-500 ring-offset-1",
                            day.count > 0 && "cursor-pointer"
                          )}
                          title={`${formatDate(day.date)}: ${day.count} ${
                            day.count === 1 ? "entry" : "entries"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
                <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900" />
                <div className="w-3 h-3 rounded-sm bg-blue-300 dark:bg-blue-800" />
                <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700" />
                <div className="w-3 h-3 rounded-sm bg-blue-500 dark:bg-blue-600" />
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day entries modal */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && formatDate(selectedDay.date)}
            </DialogTitle>
            <DialogDescription>
              {selectedDay?.count === 0
                ? "No entries on this day"
                : `${selectedDay?.count} ${
                    selectedDay?.count === 1 ? "entry" : "entries"
                  } on this day`}
            </DialogDescription>
          </DialogHeader>

          {selectedDay && selectedDay.entries.length > 0 && (
            <div className="space-y-4">
              {selectedDay.entries.map((entry) => (
                <Card key={entry.uuid} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          <Link
                            href={`/dashboard/${entry.uuid}`}
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setSelectedDay(null)}
                          >
                            {entry.journal_title}
                          </Link>
                        </CardTitle>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(entry.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/${entry.uuid}`}
                          onClick={() => setSelectedDay(null)}
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/${entry.uuid}/edit`}
                          onClick={() => setSelectedDay(null)}
                        >
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-3">
                      {getPreview(entry.journal_content)}
                    </p>
                    {entry.journal_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.journal_tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedDay && selectedDay.entries.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                No journal entries on this day. Why not create one?
              </p>
              <Link href="/dashboard/new" onClick={() => setSelectedDay(null)}>
                <Button className="mt-4">Create Entry</Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
