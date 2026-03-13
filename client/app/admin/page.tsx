"use client";

import { useEffect, useState } from "react";
import { AdminStatsCard } from "@/components/admin-stats-card";
import { AdminChart } from "@/components/admin-chart";
import { Users, FileText, Eye, Tag, File } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface StatsData {
  totalUsers: number;
  totalEntries: number;
  activeUsers: number;
  totalTags: number;
  entriesthisMonth: number;
  avgEntriesPerUser: number;
  trends: {
    users: { value: number; isPositive: boolean };
    entries: { value: number; isPositive: boolean };
    engagement: { value: number; isPositive: boolean };
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [timelineData, setTimelineData] = useState<{ date: string; count: number }[]>([]);
  const [tagsData, setTagsData] = useState<{ tag: string; count: number }[]>([]);
  const [usersData, setUsersData] = useState<{ user: string; username: string; entries: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await adminApi.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/stats",
        );
        const statsData = await statsRes.data;
        console.log("Fetched stats:", statsData);
        setStats(statsData);

        // Fetch analytics data
        const timelineRes = await adminApi.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/analytics",
          { type: "timeline" }
        );
        const timelineData = await timelineRes.data;
        setTimelineData(timelineData);

        const tagsRes = await adminApi.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/analytics",
          { type: "tags" }
        );
        const tagsData = await tagsRes.data;
        console.log("Fetched tags analytics:", tagsData);
        setTagsData(tagsData);

        const usersRes = await adminApi.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/analytics",
          { type: "users" }
        );
        const usersData = await usersRes.data;
        setUsersData(usersData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !stats) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the DEVLOG admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          title="Total Users"
          value={stats.totalUsers}
          description="Active platform users"
          icon={Users}
        //   trend={stats.trends.users}
        />
        <AdminStatsCard
          title="Total Entries"
          value={stats.totalEntries}
          description="All journal entries"
          icon={FileText}
        //   trend={stats.trends.entries}
        />
        <AdminStatsCard
          title="Active Users"
          value={stats.activeUsers}
          description={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`}
          icon={Eye}
        //   trend={stats.trends.engagement}
        />
        <AdminStatsCard
          title="Unique Tags"
          value={stats.totalTags}
          description="Content classification"
          icon={Tag}
        />
        <AdminStatsCard
          title="Entries This Month"
          value={stats.entriesthisMonth}
          description="New content in last 30 days"
          icon={File}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Entry Timeline (Last 30 Days)"
          type="line"
          data={timelineData}
          xAxisKey="date"
          dataKey="count"
        />
        <AdminChart
          title="Top Tags"
          type="pie"
          data={tagsData}
          xAxisKey="tag"
          dataKey="count"
        />
      </div>

      {/* Charts Row 2 */}
      <AdminChart
        title="Entries Per User (Top 10)"
        type="bar"
        data={usersData}
        xAxisKey="username"
        dataKey="entries"
      />
    </div>
  );
}
