"use client";

import { useEffect, useState } from "react";
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

interface User {
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_created_at: string;
  user_updated_at: string;
  entry_count: number;
  status: "active" | "inactive";
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/users",
        );
        const data = await res.data;
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  function getStatus(lastActivity: Date) {
    const days = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

    if (days <= 7) return "active";
    if (days <= 30) return "inactive";
    return "dormant";
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Entries</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell className="font-medium">
              {user.user_first_name} {user.user_last_name}
            </TableCell>
            <TableCell>{user.user_email}</TableCell>
            <TableCell>{user.entry_count}</TableCell>
            <TableCell>{formatDate(user.user_created_at)}</TableCell>
            <TableCell>{formatDate(user.user_updated_at)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  getStatus(new Date(user.user_updated_at)) === "active"
                    ? "default"
                    : "secondary"
                }
                className={
                  getStatus(new Date(user.user_updated_at)) === "active"
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : getStatus(new Date(user.user_updated_at)) === "inactive"
                      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }
              >
                {getStatus(new Date(user.user_updated_at))}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
