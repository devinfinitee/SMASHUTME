import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  FileText,
  HelpCircle,
  Search,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  description: string;
  topics: number;
  students: number;
  status: "active" | "draft";
}

interface Topic {
  id: string;
  name: string;
  subject: string;
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "active" | "draft";
}

interface Question {
  id: string;
  question: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "Multiple Choice" | "True/False";
}

export default function ContentManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  // Mock data
  const subjects: Subject[] = [
    {
      id: "1",
      name: "Mathematics",
      description: "Core mathematics concepts for UTME",
      topics: 42,
      students: 2543,
      status: "active",
    },
    {
      id: "2",
      name: "English Language",
      description: "English language and comprehension",
      topics: 38,
      students: 2847,
      status: "active",
    },
    {
      id: "3",
      name: "Physics",
      description: "Physics fundamentals and applications",
      topics: 35,
      students: 1834,
      status: "active",
    },
  ];

  const topics: Topic[] = [
    {
      id: "1",
      name: "Algebra",
      subject: "Mathematics",
      questions: 45,
      difficulty: "Medium",
      status: "active",
    },
    {
      id: "2",
      name: "Geometry",
      subject: "Mathematics",
      questions: 38,
      difficulty: "Hard",
      status: "active",
    },
    {
      id: "3",
      name: "Grammar",
      subject: "English Language",
      questions: 52,
      difficulty: "Easy",
      status: "active",
    },
  ];

  const questions: Question[] = [
    {
      id: "1",
      question: "Solve for x: 2x + 5 = 15",
      topic: "Algebra",
      difficulty: "Easy",
      type: "Multiple Choice",
    },
    {
      id: "2",
      question: "What is the area of a circle with radius 7cm?",
      topic: "Geometry",
      difficulty: "Medium",
      type: "Multiple Choice",
    },
    {
      id: "3",
      question: "Identify the noun in the sentence: The cat jumped",
      topic: "Grammar",
      difficulty: "Easy",
      type: "Multiple Choice",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Content Management</h1>
            <p className="text-muted-foreground">
              Manage subjects, topics, and questions
            </p>
          </div>
          <Button onClick={() => setLocation("/admin/dashboard")} variant="outline" className="rounded-full">
            Back to Admin
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects, topics, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects">
              <BookOpen className="w-4 h-4 mr-2" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="topics">
              <FileText className="w-4 h-4 mr-2" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="questions">
              <HelpCircle className="w-4 h-4 mr-2" />
              Questions
            </TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Subjects ({subjects.length})</h2>
              <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                    <DialogDescription>
                      Create a new subject for your platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject-name">Subject Name</Label>
                      <Input id="subject-name" placeholder="e.g., Biology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject-desc">Description</Label>
                      <Textarea
                        id="subject-desc"
                        placeholder="Brief description of the subject"
                      />
                    </div>
                    <Button className="w-full rounded-full">Create Subject</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {subject.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{subject.topics} topics</TableCell>
                      <TableCell>{subject.students.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={subject.status === "active" ? "default" : "secondary"}
                        >
                          {subject.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Topics ({topics.length})</h2>
              <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Topic</DialogTitle>
                    <DialogDescription>Create a new topic under a subject</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic-name">Topic Name</Label>
                      <Input id="topic-name" placeholder="e.g., Calculus" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic-subject">Subject</Label>
                      <Input id="topic-subject" placeholder="Select subject" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic-difficulty">Difficulty</Label>
                      <Input id="topic-difficulty" placeholder="Easy, Medium, Hard" />
                    </div>
                    <Button className="w-full rounded-full">Create Topic</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell className="font-medium">{topic.name}</TableCell>
                      <TableCell>{topic.subject}</TableCell>
                      <TableCell>{topic.questions} questions</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            topic.difficulty === "Easy"
                              ? "secondary"
                              : topic.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {topic.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={topic.status === "active" ? "default" : "secondary"}
                        >
                          {topic.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Questions ({questions.length})</h2>
              <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>Create a new quiz question</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Textarea id="question" placeholder="Enter the question" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="q-topic">Topic</Label>
                        <Input id="q-topic" placeholder="Select topic" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="q-difficulty">Difficulty</Label>
                        <Input id="q-difficulty" placeholder="Easy, Medium, Hard" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      <Input placeholder="Option A" className="mb-2" />
                      <Input placeholder="Option B" className="mb-2" />
                      <Input placeholder="Option C" className="mb-2" />
                      <Input placeholder="Option D" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correct-answer">Correct Answer</Label>
                      <Input id="correct-answer" placeholder="A, B, C, or D" />
                    </div>
                    <Button className="w-full rounded-full">Create Question</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md">
                        <p className="truncate">{question.question}</p>
                      </TableCell>
                      <TableCell>{question.topic}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            question.difficulty === "Easy"
                              ? "secondary"
                              : question.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{question.type}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
