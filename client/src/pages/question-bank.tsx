import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdminShell } from "@/components/admin-shell";
import {
  CheckCircle2,
  CircleAlert,
  Eye,
  FileUp,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  BookOpen,
  Database,
  Brain,
  Clock3,
  ArrowRight,
  Lightbulb,
  LayoutGrid,
} from "lucide-react";

const metrics = [
  { title: "Questions Live", value: "15,420", icon: Database, color: "#1C00BC", bg: "rgba(28, 0, 188, 0.08)" },
  { title: "Syllabus Links", value: "4,980", icon: BookOpen, color: "#2B0AFA", bg: "rgba(43, 10, 250, 0.08)" },
  { title: "AI Explanations", value: "92%", icon: Brain, color: "#565E74", bg: "rgba(86, 94, 116, 0.08)" },
  { title: "Upload Health", value: "Stable", icon: ShieldCheck, color: "#FBB20D", bg: "rgba(251, 178, 13, 0.15)" },
];

const questionRows = [
  {
    id: "PQ-2024-001",
    subject: "Mathematics",
    year: "2024",
    topic: "Differentiation",
    prompt: "Find the derivative of f(x) = 3x^2 + 5x - 2.",
    status: "Validated",
    difficulty: "Medium",
  },
  {
    id: "PQ-2023-088",
    subject: "Physics",
    year: "2023",
    topic: "Electric Fields",
    prompt: "What is the direction of electric field lines around a positive charge?",
    status: "Needs Review",
    difficulty: "Easy",
  },
  {
    id: "PQ-2022-114",
    subject: "Chemistry",
    year: "2022",
    topic: "Chemical Equilibrium",
    prompt: "Which change increases the yield of ammonia in the Haber process?",
    status: "Validated",
    difficulty: "Hard",
  },
  {
    id: "PQ-2021-044",
    subject: "English Language",
    year: "2021",
    topic: "Grammar",
    prompt: "Choose the correct form of the verb in the sentence.",
    status: "Queued",
    difficulty: "Easy",
  },
];

const batchProgress = [
  { label: "Math 2024 Batch", progress: 30, uploaded: "12 of 40 uploaded", recent: '"What is the integral of 2x..."' },
  { label: "Physics 2023 Batch", progress: 68, uploaded: "27 of 40 uploaded", recent: '"Which force acts on..."' },
];

const statusTally = [
  { label: "Validated", value: 284, color: "text-emerald-600" },
  { label: "Needs Review", value: 38, color: "text-amber-600" },
  { label: "Queued", value: 96, color: "text-slate-600" },
];

function MetricCard({ title, value, icon: Icon, color, bg }: { title: string; value: string; icon: typeof Database; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border-l-4 shadow-[0_20px_40px_rgba(11,28,48,0.05)]" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: bg }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function QuestionBank() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return questionRows;
    return questionRows.filter((row) =>
      [row.id, row.subject, row.year, row.topic, row.prompt, row.status, row.difficulty].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchQuery]);

  return (
    <AdminShell searchPlaceholder="Search questions...">
      <div className="min-h-screen p-4 md:p-8 pb-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#1C00BC] font-bold text-[10px] uppercase tracking-widest mb-3">
              <span className="w-8 h-[2px] bg-[#1C00BC]" />
              Admin Question Bank
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Past Question Engine</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Manage the core database of JAMB and UTME questions, link them to the syllabus, and keep explanations aligned.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setLocation("/admin/dashboard")} className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
              Back to Admin
            </Button>
            <Button onClick={() => setLocation("/admin/content-management")} className="rounded-full bg-[#1C00BC] text-white hover:bg-[#160091]">
              <ArrowRight className="w-4 h-4 mr-2" />
              Sync Syllabus
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Advanced Filter Bar</h3>
              <p className="text-sm text-slate-500">Narrow the bank by subject, year, topic tag, and review state.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
                <FileUp className="w-4 h-4 mr-2" />
                Bulk Upload JSON/CSV
              </Button>
              <Button className="rounded-full bg-[#2B0AFA] text-white hover:bg-[#2408CF]">
                <Plus className="w-4 h-4 mr-2" />
                Create Single Question
              </Button>
            </div>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search questions, years, or syllabus topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Subject</Label>
              <select
                className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option>Mathematics</option>
                <option>English Language</option>
                <option>Physics</option>
                <option>Biology</option>
                <option>Chemistry</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">JAMB Year</Label>
              <select className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2">
                <option>All Years</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Topic Tag</Label>
              <select className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2">
                <option>All Topics</option>
                <option>Differentiation</option>
                <option>Equilibrium</option>
                <option>Grammar</option>
                <option>Electric Fields</option>
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 md:pt-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-5 h-5 rounded border-slate-300 text-[#1C00BC] focus:ring-[#1C00BC]/20" type="checkbox" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#1C00BC] transition-colors">Missing Explanation</span>
              </label>
              <button className="ml-auto text-[#1C00BC] text-sm font-bold flex items-center gap-1 hover:underline">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#1C00BC]/10 text-[#1C00BC] flex items-center justify-center font-bold">A</span>
                <h3 className="font-black text-lg text-slate-900">Syllabus Association</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject Category</Label>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-[#1C00BC]/20">
                    <span className="font-semibold text-[#1C00BC]">{selectedSubject}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#1C00BC]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">JAMB Year</Label>
                  <Input className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] p-4 font-body font-bold rounded-t-xl" type="number" defaultValue={2024} />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syllabus Topic Tag</Label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <span className="px-3 py-1 bg-[#1C00BC] text-white text-xs font-bold rounded-full flex items-center gap-1">
                      Differentiation
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </span>
                    <span className="px-3 py-1 bg-[#1C00BC] text-white text-xs font-bold rounded-full flex items-center gap-1">
                      Calculus
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </span>
                    <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-100 transition-colors">
                      + Add Topic
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#1C00BC]/10 text-[#1C00BC] flex items-center justify-center font-bold">B</span>
                <h3 className="font-black text-lg text-slate-900">Question Data</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question Body (Rich Text Supported)</Label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 flex items-center gap-4 border-b border-slate-200">
                      <button className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">format_bold</button>
                      <button className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">format_italic</button>
                      <button className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">functions</button>
                      <button className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">image</button>
                    </div>
                    <textarea className="w-full bg-white p-4 border-0 focus:ring-0 font-body leading-relaxed" placeholder="e.g., Find the derivative of f(x) = 3x^2 + 5x - 2..." rows={4} defaultValue="Find the derivative of f(x) = 3x^2 + 5x - 2." />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    ["A", "6x + 5"],
                    ["B", "3x + 5"],
                    ["C", "6x - 2"],
                    ["D", "x^2 + 5"],
                  ].map(([option, value]) => (
                    <div key={option} className="flex items-center gap-4 group">
                      <input className="w-6 h-6 text-[#1C00BC] focus:ring-[#1C00BC]/20 border-slate-300" name="correct_ans" type="radio" />
                      <div className="flex-1 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 focus-within:border-[#1C00BC] transition-colors">
                        <span className="font-bold text-slate-500">{option}.</span>
                        <input className="w-full bg-transparent border-0 focus:ring-0 p-0 font-medium" type="text" value={value} readOnly />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1C00BC]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 relative">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#1C00BC]/10 text-[#1C00BC] flex items-center justify-center font-bold">C</span>
                  <h3 className="font-black text-lg text-slate-900">Anti-Cram Explanation</h3>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-[#FBB100] text-[#281900] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Auto-Solve via SmashAI
                </button>
              </div>
              <div className="space-y-4 relative">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provide a deep conceptual breakdown. Explain <span className="font-bold">why</span> the correct answer is right and why the distractors are wrong.
                </p>
                <textarea className="w-full bg-slate-50 border-0 border-b border-[#1C00BC]/30 focus:ring-0 focus:border-[#1C00BC] p-6 font-body text-sm leading-relaxed rounded-t-xl" placeholder="Step 1: Identify the function f(x)..." rows={6} />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_20px_40px_rgba(11,28,48,0.05)]">
              <h4 className="font-black text-slate-900 mb-4">Entry Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Syllabus Mapping</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Validated
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Option Balance</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Uniform
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">AI Explanation</span>
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <CircleAlert className="w-4 h-4" />
                    Needs Review
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <button className="w-full py-4 bg-[#1C00BC] text-white font-bold rounded-xl shadow-lg shadow-[#1C00BC]/30 hover:bg-[#2B0AFA] transition-all active:scale-[0.98]">
                  Publish Question
                </button>
                <button className="w-full py-3 bg-slate-50 text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all">
                  Save as Draft
                </button>
                <button className="w-full py-3 text-red-600 font-bold text-sm hover:underline">
                  Discard Entry
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-black text-slate-900 text-sm mb-4">Batch Progress</h4>
              <div className="space-y-4">
                {batchProgress.map((batch) => (
                  <div key={batch.label} className="space-y-2">
                    <div className="flex gap-4">
                      <div className="w-1.5 h-12 bg-[#1C00BC] rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{batch.label}</p>
                        <p className="text-xs text-slate-500">{batch.uploaded}</p>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-[#1C00BC] rounded-full" style={{ width: `${batch.progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Last Uploaded</p>
                      <p className="text-xs font-medium text-slate-900 truncate">{batch.recent}</p>
                      <p className="text-[10px] text-[#1C00BC] font-bold mt-1">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FBB100] p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-[#281900]" />
                <span className="font-black text-[#281900]">Pro-Tip</span>
              </div>
              <p className="text-sm text-[#5F4100] leading-snug">
                Use the <code>[latex]</code> tag for complex formulas to ensure perfect rendering on the candidate's mobile app.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Review Queue</h3>
                <p className="text-sm text-slate-500">Questions needing validation before publishing</p>
              </div>
              <button className="text-sm font-bold text-[#1C00BC] flex items-center gap-1 hover:underline">
                View all
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">ID</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Subject</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Topic</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{row.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{row.subject} <span className="text-xs text-slate-400">({row.year})</span></td>
                      <td className="px-4 py-4 text-sm text-slate-700">{row.topic}</td>
                      <td className="px-4 py-4">
                        <Badge variant={row.status === "Validated" ? "default" : row.status === "Needs Review" ? "secondary" : "outline"}>{row.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="inline-flex items-center gap-1 text-xs font-bold text-[#1C00BC] hover:underline">
                          <Eye className="w-4 h-4" />
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#1C00BC]" />
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
                  <div className="w-9 h-9 rounded-full bg-[#FBB100]/20 flex items-center justify-center text-[#281900]">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Bulk Upload</p>
                    <p className="text-xs text-slate-500">JSON, CSV, or spreadsheet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-9 h-9 rounded-full bg-[#2B0AFA]/10 flex items-center justify-center text-[#2B0AFA]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">QA Gate</p>
                    <p className="text-xs text-slate-500">Explanation review and syllabus sync</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#1C00BC]" />
                Status Summary
              </h4>
              <div className="space-y-3">
                {statusTally.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-[#1C00BC]" />
                Recent Activity
              </h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-900">Bulk import validated</p>
                  <p className="text-xs text-slate-500">Admin Unit 01 • 5 mins ago</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-900">Question explanation linked</p>
                  <p className="text-xs text-slate-500">SmashAI • 12 mins ago</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-900">Queue review completed</p>
                  <p className="text-xs text-slate-500">QA Team • 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

export default QuestionBank;
