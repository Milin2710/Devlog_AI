"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/lib/admin-api";

interface Activity {
  id: string;
  userId: string;
  user_email: string;
  action: string;
  description: string;
  created_at: string;
  type: string;
  metadata: Record<string, any>;
  service: string;
  endpoint: string;
  method: string;
}

export function ActivityLogsTable() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchActivities = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        if (append) setIsLoadingMore(true);
        const res = await adminApi.get("/admin/activity", {
          params: {
            page: pageNum,
            limit: 20,
          },
        });
        console.log("page", pageNum);
        const data = res.data.data;
        console.log("Fetched activities:", data);
        if (append) {
          setActivities((prev) => [...prev, ...data]);
          if (data.length < 20) setHasMore(false);
        } else {
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        if (append) setIsLoadingMore(false);
        else setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchActivities(1, false);
  }, [fetchActivities]);

  const lastActivityCallback = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore],
  );

  useEffect(() => {
    if (page > 1) {
      fetchActivities(page, true);
    }
  }, [page, fetchActivities]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      create: "default",
      update: "secondary",
      login: "outline",
      delete: "destructive" as any,
    };
    return variants[type] || "secondary";
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User email</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Endpoint</TableHead>
          <TableHead>Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity, index) => (
          <TableRow
            key={index}
            ref={index === activities.length - 1 ? lastActivityCallback : null}
          >
            <TableCell className="font-medium">{activity.user_email}</TableCell>
            <TableCell>{activity.action}</TableCell>
            <TableCell className="truncate max-w-xs">
              Name: {activity.metadata?.name}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(activity.created_at)}
            </TableCell>
            <TableCell>{activity.service}</TableCell>
            <TableCell>{activity.endpoint}</TableCell>
            <TableCell>{activity.method}</TableCell>
          </TableRow>
        ))}
        {isLoadingMore && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
