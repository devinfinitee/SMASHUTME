import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Download,
  Eye,
  BarChart3,
} from "lucide-react";

interface QuizResult {
  id: string;
  student: string;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  timeTaken: string;
  status: "passed" | "failed";
}

interface StudentStats {
  name: string;
  totalQuizzes: number;
  avgScore: number;
  bestSubject: string;
  trend: "up" | "down";
}

export default function QuizResults() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const recentResults: QuizResult[] = [
    {
      id: "1",
      student: "Chioma Adeleke",
      subject: "Mathematics",
      topic: "Algebra",
      score: 18,
      totalQuestions: 20,
      percentage: 90,
      date: "2026-02-27",
      timeTaken: "15 min",
      status: "passed",
    },
    {
      id: "2",
      student: "Ibrahim Yusuf",
      subject: "Physics",
      topic: "Mechanics",
      score: 14,
      totalQuestions: 20,
      percentage: 70,
      date: "2026-02-27",
      timeTaken: "18 min",
      status: "passed",
    },
    {
      id: "3",
      student: "Blessing Okonkwo",
      subject: "English Language",
      topic: "Grammar",
      score: 16,
      totalQuestions: 20,
      percentage: 80,
      date: "2026-02-26",
      timeTaken: "12 min",
      status: "passed",
    },
    {
      id: "4",
      student: "Ahmed Bello",
      subject: "Chemistry",
      topic: "Organic Chemistry",
      score: 9,
      totalQuestions: 20,
      percentage: 45,
      date: "2026-02-26",
      timeTaken: "20 min",
      status: "failed",
    },
  ];

  const topStudents: StudentStats[] = [
    {
      name: "Chioma Adeleke",
      totalQuizzes: 45,
      avgScore: 88,
      bestSubject: "Mathematics",
      trend: "up",
    },
    {
      name: "Ibrahim Yusuf",
      totalQuizzes: 38,
      avgScore: 82,
      bestSubject: "Physics",
      trend: "up",
    },
    {
      name: "Blessing Okonkwo",
      totalQuizzes: 42,
      avgScore: 79,
      bestSubject: "English",
      trend: "down",
    },
  ];

  const subjectPerformance = [
    { subject: "Mathematics", avgScore: 76, totalAttempts: 1234 },
    { subject: "English Language", avgScore: 72, totalAttempts: 1456 },
    { subject: "Physics", avgScore: 68, totalAttempts: 987 },
    { subject: "Chemistry", avgScore: 65, totalAttempts: 892 },
  ];

  const stats = [
    {
      title: "Total Quizzes",
      value: "12,543",
      change: "+234 today",
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Average Score",
      value: "72.4%",
      change: "+2.3% this week",
      icon: BarChart3,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Pass Rate",
      value: "68.5%",
      change: "+5.2% this month",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Students",
      value: "2,847",
      change: "+156 this week",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">
              Monitor student performance and quiz analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setLocation("/admin/dashboard")} variant="outline" className="rounded-full">
              Back to Admin
            </Button>
          </div>
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
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Results</TabsTrigger>
            <TabsTrigger value="students">Top Students</TabsTrigger>
            <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
          </TabsList>

          {/* Recent Results Tab */}
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Quiz Results</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search results..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.student}</TableCell>
                        <TableCell>{result.subject}</TableCell>
                        <TableCell>{result.topic}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{result.percentage}%</p>
                            <p className="text-xs text-muted-foreground">
                              {result.score}/{result.totalQuestions}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{result.timeTaken}</TableCell>
                        <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={result.status === "passed" ? "default" : "destructive"}
                          >
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topStudents.map((student, index) => (
                    <div
                      key={student.name}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          index === 0 ? "bg-secondary text-secondary-foreground" : 
                          index === 1 ? "bg-primary/20 text-primary" : 
                          "bg-muted text-muted-foreground"
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.totalQuizzes} quizzes • Best: {student.bestSubject}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {student.avgScore}%
                          </p>
                          <p className="text-xs text-muted-foreground">avg score</p>
                        </div>
                        {student.trend === "up" ? (
                          <TrendingUp className="w-5 h-5 text-primary" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-secondary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subject Performance Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{subject.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {subject.totalAttempts.toLocaleString()} attempts
                          </p>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          {subject.avgScore}%
                        </p>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${subject.avgScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pass/Fail Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Passed</span>
                      <span className="font-semibold text-primary">8,593 (68.5%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "68.5%" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Failed</span>
                      <span className="font-semibold text-secondary">3,950 (31.5%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "31.5%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Level Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Easy Questions</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: "85%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Medium Questions</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "68%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Hard Questions</span>
                        <span className="font-semibold">52%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-destructive rounded-full" style={{ width: "52%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
