import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Users,
  BookOpen,
  FileText,
  Trophy,
  TrendingUp,
  Activity,
  Settings,
  Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Subjects",
      value: "13",
      change: "+2",
      icon: BookOpen,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Topics",
      value: "247",
      change: "+15",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Quizzes Taken",
      value: "12,543",
      change: "+24.3%",
      icon: Trophy,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  const recentActivity = [
    {
      action: "New user registration",
      user: "Chioma Adeleke",
      time: "5 minutes ago",
    },
    {
      action: "Quiz completed",
      user: "Ibrahim Yusuf",
      time: "12 minutes ago",
    },
    {
      action: "New topic created",
      user: "Admin",
      time: "1 hour ago",
    },
    {
      action: "Subject updated",
      user: "Admin",
      time: "2 hours ago",
    },
    {
      action: "New user registration",
      user: "Blessing Okonkwo",
      time: "3 hours ago",
    },
  ];

  const quickActions = [
    {
      title: "Add Subject",
      description: "Create a new subject",
      icon: Plus,
      action: () => setLocation("/admin/content-management"),
      color: "primary",
    },
    {
      title: "Add Topic",
      description: "Create a new topic",
      icon: Plus,
      action: () => setLocation("/admin/content-management"),
      color: "secondary",
    },
    {
      title: "View Results",
      description: "Check quiz results",
      icon: Trophy,
      action: () => setLocation("/admin/quiz-results"),
      color: "primary",
    },
    {
      title: "Manage Content",
      description: "Edit subjects and topics",
      icon: Settings,
      action: () => setLocation("/admin/content-management"),
      color: "secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your platform and monitor activity
            </p>
          </div>
          <Button onClick={() => setLocation("/dashboard")} variant="outline" className="rounded-full">
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="flex items-start gap-4 p-4 rounded-xl border-2 border-border hover:border-primary transition-colors text-left"
                  >
                    <div
                      className={`${
                        action.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                      } p-3 rounded-lg`}
                    >
                      <action.icon
                        className={`w-5 h-5 ${
                          action.color === "primary" ? "text-primary" : "text-secondary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                    {index < recentActivity.length - 1 && (
                      <div className="h-px bg-border mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Active Today</span>
                    <span className="font-semibold">1,234 users</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Active This Week</span>
                    <span className="font-semibold">2,156 users</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Active This Month</span>
                    <span className="font-semibold">2,847 users</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { subject: "Mathematics", avgScore: "78%", students: 2543 },
                  { subject: "English Language", avgScore: "72%", students: 2847 },
                  { subject: "Physics", avgScore: "68%", students: 1834 },
                  { subject: "Chemistry", avgScore: "65%", students: 1723 },
                ].map((item) => (
                  <div key={item.subject} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.students} students
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{item.avgScore}</p>
                      <p className="text-xs text-muted-foreground">avg score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
