import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityLogsTable } from '@/components/activity-logs-table'

export default function AdminActivityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-2">Monitor all user activities on the platform</p>
      </div>

      {/* Activity Logs Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Real-time activity log of user interactions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLogsTable />
        </CardContent>
      </Card>
    </div>
  )
}
