import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  BookOpen,
  Database,
  Download,
  FileUp,
  Flame,
  Layers3,
  MemoryStick,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Workflow,
  CheckCircle2,
  CircleAlert,
  Clock3,
} from "lucide-react";

const UPLOAD_METRICS = [
  { title: "Subjects Live", value: "13", icon: BookOpen, color: "#1C00BC", bg: "rgba(28, 0, 188, 0.08)" },
  { title: "Topics Synced", value: "247", icon: Layers3, color: "#2B0AFA", bg: "rgba(43, 10, 250, 0.08)" },
  { title: "Question Bank", value: "15,420", icon: Database, color: "#565E74", bg: "rgba(86, 94, 116, 0.08)" },
  { title: "AI Sync", value: "45.2%", icon: MemoryStick, color: "#FBB20D", bg: "rgba(251, 178, 13, 0.15)" },
];

const uploadQueue = [
  { name: "Use of English - Syllabus v4.pdf", type: "Subject syllabus", status: "Ready", progress: 100 },
  { name: "Biology Topic Matrix.xlsx", type: "Topic map", status: "Processing", progress: 72 },
  { name: "Chemistry Questions Pack.csv", type: "Question bank", status: "Queued", progress: 34 },
  { name: "Physics Standards Outline.docx", type: "Subject syllabus", status: "Ready", progress: 100 },
];

const curriculumCards = [
  {
    subject: "Use of English",
    topics: 38,
    lastUpload: "2 hours ago",
    completion: 92,
    color: "#1C00BC",
  },
  {
    subject: "Biology",
    topics: 44,
    lastUpload: "Today",
    completion: 84,
    color: "#2B0AFA",
  },
  {
    subject: "Chemistry",
    topics: 41,
    lastUpload: "Yesterday",
    completion: 76,
    color: "#FBB20D",
  },
  {
    subject: "Physics",
    topics: 35,
    lastUpload: "Today",
    completion: 88,
    color: "#565E74",
  },
];

const systemChecks = [
  { label: "Schema validation", value: "Passed", icon: ShieldCheck },
  { label: "AI extraction", value: "Stable", icon: Sparkles },
  { label: "Version control", value: "v12.4", icon: Workflow },
];

const activityFeed = [
  { action: "New syllabus file uploaded", actor: "Admin Unit 01", time: "5 mins ago" },
  { action: "Topic extraction completed", actor: "SmashAI", time: "12 mins ago" },
  { action: "Question pack linked", actor: "Admin Unit 01", time: "1 hour ago" },
  { action: "Review flag cleared", actor: "SmashAI", time: "3 hours ago" },
];

function UploadMetric({ title, value, icon: Icon, color, bg }: { title: string; value: string; icon: typeof BookOpen; color: string; bg: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border-l-4 shadow-[0_20px_40px_rgba(11,28,48,0.05)]" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: bg }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <span className="text-3xl font-black text-slate-900">{value}</span>
    </div>
  );
}

export default function ContentManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Use of English");

  const filteredQueue = useMemo(() => {
    if (!searchQuery.trim()) return uploadQueue;
    const query = searchQuery.toLowerCase();
    return uploadQueue.filter((item) => item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <AdminShell searchPlaceholder="Search syllabus files, topics, or questions...">
      <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#1C00BC] font-bold text-[10px] uppercase tracking-widest mb-3">
              <span className="w-8 h-[2px] bg-[#1C00BC]" />
              Admin Syllabus Studio
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Syllabus Upload Center</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Upload syllabus files, map topics, validate content structure, and sync the curriculum into the platform.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setLocation("/admin/dashboard")} className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
                Back to Admin
              </Button>
              <Button variant="outline" onClick={() => setLocation("/admin/quiz-results")} className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
                Open Results
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button className="rounded-full bg-[#1C00BC] text-white hover:bg-[#160091]">
              <ArrowRight className="w-4 h-4 mr-2" />
              Publish Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {UPLOAD_METRICS.map((metric) => (
            <UploadMetric key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] p-6 md:p-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Upload & Parse Syllabus</h3>
                  <p className="text-sm text-slate-500">Drag files in, assign subjects, and validate before publishing.</p>
                </div>
                <Badge className="bg-[#FBB20D]/20 text-[#8A5C00] border border-[#FBB20D]/40 w-fit">Admin Workflow Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 md:p-8 min-h-[240px] flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#2B0AFA]/10 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-[#2B0AFA]" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Drag and drop files here</h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">
                    Upload PDF, DOCX, XLSX, or CSV files containing syllabus outlines, topic plans, or question metadata.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button className="bg-[#2B0AFA] text-white hover:bg-[#2408CF]">
                      <FileUp className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Folder
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Use of English", "Biology", "Chemistry", "Physics"].map((subject) => (
                        <button
                          key={subject}
                          onClick={() => setSelectedSubject(subject)}
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all text-left ${
                            selectedSubject === subject
                              ? "bg-[#2B0AFA] text-white border-[#2B0AFA]"
                              : "bg-white border-slate-200 text-slate-600 hover:border-[#2B0AFA]/40"
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Upload Notes</Label>
                    <Textarea
                      placeholder="Add revision notes, scope instructions, or special handling details..."
                      className="min-h-[120px] bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {systemChecks.map((check) => (
                      <div key={check.label} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{check.label}</span>
                          <check.icon className="w-4 h-4 text-[#1C00BC]" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">{check.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Upload Queue</h3>
                  <p className="text-sm text-slate-500">Files waiting for review and curriculum extraction</p>
                </div>
                <button className="text-xs font-bold text-[#1C00BC] flex items-center gap-1 hover:underline">
                  View processing log
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search uploads, subjects, or file types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50"
                  />
                </div>

                <div className="space-y-3">
                  {filteredQueue.map((item) => (
                    <div key={item.name} className="rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-[#2B0AFA]/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <Badge variant={item.status === "Ready" ? "default" : item.status === "Processing" ? "secondary" : "outline"}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{item.type}</p>
                      </div>

                      <div className="w-full md:w-72 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2B0AFA]" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#2B0AFA] text-white rounded-xl shadow-[0_20px_40px_rgba(28,0,188,0.15)] p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-black mb-2">Generate Report</h4>
                <p className="text-sm text-white/80 mb-6 leading-relaxed">
                  Compile the syllabus upload into a structured publishing summary.
                </p>
                <Button className="w-full bg-white text-[#1C00BC] hover:bg-slate-100 font-bold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Compile Summary
                </Button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100 p-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <CircleAlert className="w-4 h-4 text-[#FBB20D]" />
                Validation Checklist
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm text-slate-700">File format accepted</span>
                  <CheckCircle2 className="w-4 h-4 text-[#1C00BC]" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm text-slate-700">Subject mapping complete</span>
                  <CheckCircle2 className="w-4 h-4 text-[#1C00BC]" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm text-slate-700">Topic hierarchy verified</span>
                  <Clock3 className="w-4 h-4 text-[#FBB20D]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100 p-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FBB20D]" />
                Curriculum Snapshot
              </h4>
              <div className="space-y-4">
                {curriculumCards.map((card) => (
                  <div key={card.subject} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900">{card.subject}</p>
                      <span className="text-xs font-bold text-slate-500">{card.topics} topics</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Last upload: {card.lastUpload}</span>
                      <span>{card.completion}% complete</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${card.completion}%`, backgroundColor: card.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Recent Activity</h3>
                <p className="text-sm text-slate-500">Live audit trail of syllabus uploads and syncs</p>
              </div>
              <button className="text-xs font-bold text-[#1C00BC] flex items-center gap-1 hover:underline">
                View all logs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {activityFeed.map((item, index) => (
                <div key={`${item.action}-${index}`} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500">{item.actor}</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100 p-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1C00BC]" />
              Publish Pipeline
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-9 h-9 rounded-full bg-[#1C00BC]/10 flex items-center justify-center text-[#1C00BC]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Selected Subject</p>
                  <p className="text-xs text-slate-500">{selectedSubject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-9 h-9 rounded-full bg-[#FBB20D]/20 flex items-center justify-center text-[#8A5C00]">
                  <Workflow className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Auto Parsing</p>
                  <p className="text-xs text-slate-500">Extract topics and tags</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-9 h-9 rounded-full bg-[#2B0AFA]/10 flex items-center justify-center text-[#2B0AFA]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Impact</p>
                  <p className="text-xs text-slate-500">Linked to candidate dashboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
