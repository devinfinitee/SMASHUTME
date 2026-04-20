import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-fetch";
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
  ArrowRight,
  X,
} from "lucide-react";

const metrics = [
  { title: "Questions Live", value: "15,420", icon: Database, color: "#1C00BC", bg: "rgba(28, 0, 188, 0.08)" },
  { title: "Syllabus Links", value: "4,980", icon: BookOpen, color: "#2B0AFA", bg: "rgba(43, 10, 250, 0.08)" },
  { title: "AI Explanations", value: "92%", icon: Brain, color: "#565E74", bg: "rgba(86, 94, 116, 0.08)" },
  { title: "Upload Health", value: "Stable", icon: ShieldCheck, color: "#FBB20D", bg: "rgba(251, 178, 13, 0.15)" },
];

const INITIAL_QUESTION_ROWS = [
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
  const bulkFileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Difficulty");
  const [missingExplanationOnly, setMissingExplanationOnly] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [questionRows, setQuestionRows] = useState(INITIAL_QUESTION_ROWS);
  const [activeQuestionId, setActiveQuestionId] = useState(INITIAL_QUESTION_ROWS[0]?.id ?? "");
  const [syllabusTags, setSyllabusTags] = useState<string[]>(["Differentiation", "Calculus"]);
  const [newTag, setNewTag] = useState("");
  const [questionYear, setQuestionYear] = useState("2024");
  const [questionBody, setQuestionBody] = useState("Find the derivative of f(x) = 3x^2 + 5x - 2.");
  const [answerOptions, setAnswerOptions] = useState([
    { label: "A", value: "6x + 5" },
    { label: "B", value: "3x + 5" },
    { label: "C", value: "6x - 2" },
    { label: "D", value: "x^2 + 5" },
  ]);
  const [correctOption, setCorrectOption] = useState("A");
  const [explanationBody, setExplanationBody] = useState("");
  const [viewAllRows, setViewAllRows] = useState(false);
  const [workflowMessage, setWorkflowMessage] = useState("");
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  const questionTopics = useMemo(() => {
    const unique = Array.from(new Set(INITIAL_QUESTION_ROWS.map((row) => row.topic))).sort();
    return ["All Topics", ...unique];
  }, []);

  const statuses = ["All Statuses", "Validated", "Needs Review", "Queued"];
  const difficulties = ["All Difficulty", "Easy", "Medium", "Hard"];
  const subjects = ["All Subjects", "Mathematics", "English Language", "Physics", "Biology", "Chemistry"];

  function resetWorkflowMessage(message: string) {
    setWorkflowMessage(message);
    window.setTimeout(() => {
      setWorkflowMessage("");
    }, 2400);
  }

  function handleCreateSingleQuestion() {
    const nextId = `PQ-${new Date().getFullYear()}-${String(questionRows.length + 1).padStart(3, "0")}`;
    setActiveQuestionId(nextId);
    setQuestionYear(String(new Date().getFullYear()));
    setQuestionBody("");
    setExplanationBody("");
    setSyllabusTags([]);
    setCorrectOption("A");
    setAnswerOptions([
      { label: "A", value: "" },
      { label: "B", value: "" },
      { label: "C", value: "" },
      { label: "D", value: "" },
    ]);
    resetWorkflowMessage("New question draft opened.");
  }

  function splitCsvLine(line: string) {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];

      if (char === '"') {
        const nextChar = line[i + 1];
        if (inQuotes && nextChar === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    cells.push(current.trim());
    return cells;
  }

  function normalizeUploadItem(raw: Record<string, unknown>) {
    return {
      subject: String(raw.subject ?? raw.Subject ?? "").trim(),
      topic: String(raw.topic ?? raw.Topic ?? "").trim(),
      year: Number(raw.year ?? raw.examYear ?? raw.Year ?? raw.ExamYear ?? ""),
      questionNumber: Number(raw.questionNumber ?? raw.QuestionNumber ?? ""),
      question: String(raw.question ?? raw.content ?? raw.Question ?? raw.Content ?? "").trim(),
      optionA: String(raw.optionA ?? raw.A ?? "").trim(),
      optionB: String(raw.optionB ?? raw.B ?? "").trim(),
      optionC: String(raw.optionC ?? raw.C ?? "").trim(),
      optionD: String(raw.optionD ?? raw.D ?? "").trim(),
      correctOption: String(raw.correctOption ?? raw.answer ?? raw.Answer ?? "").trim().toUpperCase(),
      explanation: String(raw.explanation ?? raw.Explanation ?? "").trim(),
      difficulty: String(raw.difficulty ?? raw.Difficulty ?? "medium").trim().toLowerCase(),
      tags: raw.tags ?? raw.Tags ?? "",
    };
  }

  async function parseUploadFile(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const text = await file.text();

    if (extension === "json") {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error(`${file.name}: JSON upload must be an array of question rows.`);
      }
      return parsed.map((row) => normalizeUploadItem(row as Record<string, unknown>));
    }

    if (extension === "csv") {
      const rawLines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (rawLines.length < 2) {
        throw new Error(`${file.name}: CSV must include headers and at least one data row.`);
      }

      const headers = splitCsvLine(rawLines[0]).map((header) => header.toLowerCase());
      const rows: Record<string, unknown>[] = [];

      for (let i = 1; i < rawLines.length; i += 1) {
        const cells = splitCsvLine(rawLines[i]);
        const row: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          row[header] = cells[index] ?? "";
        });
        rows.push(row);
      }

      return rows.map((row) => normalizeUploadItem(row));
    }

    throw new Error(`${file.name}: Unsupported file type. Use .json or .csv.`);
  }

  async function handleBulkUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setIsUploadingBulk(true);

    try {
      const rowsByFile = await Promise.all(Array.from(files).map((file) => parseUploadFile(file)));
      const uploadItems = rowsByFile.flat();

      if (uploadItems.length === 0) {
        resetWorkflowMessage("No upload rows found in selected file(s).");
        return;
      }

      const response = await apiFetch("/api/admin/questions/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: uploadItems }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody?.error || "Bulk upload failed.");
      }

      const importedCount = Number(responseBody?.summary?.importedCount ?? 0);
      const skippedCount = Number(responseBody?.summary?.skippedCount ?? 0);

      const previewRows = uploadItems.slice(0, 8).map((row, index) => ({
        id: `UPLOAD-${Date.now()}-${index}`,
        subject: row.subject || "Unknown",
        year: String(row.year || new Date().getFullYear()),
        topic: row.topic || "General",
        prompt: row.question || "Imported question",
        status: "Queued",
        difficulty: row.difficulty ? String(row.difficulty).replace(/^./, (char) => char.toUpperCase()) : "Medium",
      }));

      setQuestionRows((prev) => [...previewRows, ...prev]);
      resetWorkflowMessage(`Upload complete: ${importedCount} imported, ${skippedCount} skipped.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bulk upload failed.";
      resetWorkflowMessage(message);
    } finally {
      setIsUploadingBulk(false);
      if (bulkFileInputRef.current) {
        bulkFileInputRef.current.value = "";
      }
    }
  }

  function handleAddTag() {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (!syllabusTags.includes(trimmed)) {
      setSyllabusTags((prev) => [...prev, trimmed]);
    }
    setNewTag("");
  }

  function handleRemoveTag(tag: string) {
    setSyllabusTags((prev) => prev.filter((item) => item !== tag));
  }

  function handleOptionChange(label: string, value: string) {
    setAnswerOptions((prev) => prev.map((item) => (item.label === label ? { ...item, value } : item)));
  }

  function applyFormatting(token: "bold" | "italic" | "math" | "image") {
    if (token === "bold") setQuestionBody((prev) => `${prev} **bold**`.trim());
    if (token === "italic") setQuestionBody((prev) => `${prev} *italic*`.trim());
    if (token === "math") setQuestionBody((prev) => `${prev} [latex]x^2[/latex]`.trim());
    if (token === "image") setQuestionBody((prev) => `${prev} [image:url]`.trim());
  }

  function handleOpenRow(rowId: string) {
    const row = questionRows.find((item) => item.id === rowId);
    if (!row) return;
    setActiveQuestionId(row.id);
    setSelectedSubject(row.subject);
    setQuestionYear(row.year);
    setQuestionBody(row.prompt);
    setSyllabusTags([row.topic]);
    setExplanationBody(`Explain why the correct option for ${row.topic} is right, and why alternatives are not.`);
    resetWorkflowMessage(`Loaded ${row.id} into editor.`);
  }

  function handleAutoSolve() {
    setExplanationBody(
      `Step 1: Differentiate each term independently.\nStep 2: d/dx(3x^2) = 6x, d/dx(5x) = 5, d/dx(-2) = 0.\nStep 3: Final answer is 6x + 5. Distractors miss either coefficient scaling or constant differentiation rules.`,
    );
    resetWorkflowMessage("Mock AI explanation generated.");
  }

  function handleSaveDraft() {
    resetWorkflowMessage("Draft saved locally (preview mode).");
  }

  function handlePublish() {
    const hasExplanation = explanationBody.trim().length > 0;
    const hasBody = questionBody.trim().length > 0;
    if (!hasBody) {
      resetWorkflowMessage("Add a question body before publishing.");
      return;
    }

    setQuestionRows((prev) => {
      const nextSubject = selectedSubject === "All Subjects" ? "Mathematics" : selectedSubject;
      const exists = prev.some((row) => row.id === activeQuestionId);
      if (!exists) {
        return [
          {
            id: activeQuestionId,
            subject: nextSubject,
            year: questionYear,
            topic: syllabusTags[0] ?? "General",
            prompt: questionBody,
            status: hasExplanation ? "Validated" : "Needs Review",
            difficulty: selectedDifficulty === "All Difficulty" ? "Medium" : selectedDifficulty,
          },
          ...prev,
        ];
      }

      return prev.map((row) =>
        row.id === activeQuestionId
          ? {
              ...row,
              subject: nextSubject,
              year: questionYear,
              topic: syllabusTags[0] ?? row.topic,
              prompt: questionBody,
              status: hasExplanation ? "Validated" : "Needs Review",
              difficulty: selectedDifficulty === "All Difficulty" ? row.difficulty : selectedDifficulty,
            }
          : row,
      );
    });
    resetWorkflowMessage(hasExplanation ? "Question published to preview queue." : "Published with review flag (no explanation).");
  }

  function handleDiscard() {
    const row = questionRows.find((item) => item.id === activeQuestionId);
    if (!row) return;
    setQuestionBody(row.prompt);
    setExplanationBody("");
    setSyllabusTags([row.topic]);
    setQuestionYear(row.year);
    resetWorkflowMessage("Editor reset to last loaded row.");
  }

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return questionRows
      .filter((row) => (selectedSubject !== "All Subjects" ? row.subject === selectedSubject : true))
      .filter((row) => (selectedYear !== "All Years" ? row.year === selectedYear : true))
      .filter((row) => (selectedTopic !== "All Topics" ? row.topic === selectedTopic : true))
      .filter((row) => (selectedStatus !== "All Statuses" ? row.status === selectedStatus : true))
      .filter((row) => (selectedDifficulty !== "All Difficulty" ? row.difficulty === selectedDifficulty : true))
      .filter((row) => (missingExplanationOnly ? row.status !== "Validated" : true))
      .filter((row) => {
        if (!query) return true;
        return [row.id, row.subject, row.year, row.topic, row.prompt, row.status, row.difficulty].some((value) =>
          value.toLowerCase().includes(query),
        );
      });
  }, [missingExplanationOnly, questionRows, searchQuery, selectedDifficulty, selectedStatus, selectedSubject, selectedTopic, selectedYear]);

  const visibleRows = viewAllRows ? filteredRows : filteredRows.slice(0, 4);

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
          <input
            ref={bulkFileInputRef}
            type="file"
            accept=".json,.csv"
            multiple
            className="hidden"
            onChange={(e) => handleBulkUpload(e.target.files)}
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Advanced Filter Bar</h3>
              <p className="text-sm text-slate-500">Narrow the bank by subject, year, topic tag, and review state.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => bulkFileInputRef.current?.click()}
                className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
                disabled={isUploadingBulk}
              >
                <FileUp className="w-4 h-4 mr-2" />
                {isUploadingBulk ? "Uploading..." : "Bulk Upload JSON/CSV"}
              </Button>
              <Button onClick={handleCreateSingleQuestion} className="rounded-full bg-[#2B0AFA] text-white hover:bg-[#2408CF]">
                <Plus className="w-4 h-4 mr-2" />
                Create Single Question
              </Button>
            </div>
          </div>

          {workflowMessage ? (
            <div className="mt-4 rounded-lg border border-[#1C00BC]/15 bg-[#1C00BC]/5 px-4 py-2 text-sm font-medium text-[#1C00BC]">
              {workflowMessage}
            </div>
          ) : null}

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
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">JAMB Year</Label>
              <select
                className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option>All Years</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Topic Tag</Label>
              <select
                className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {questionTopics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 md:pt-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  className="w-5 h-5 rounded border-slate-300 text-[#1C00BC] focus:ring-[#1C00BC]/20"
                  type="checkbox"
                  checked={missingExplanationOnly}
                  onChange={(e) => setMissingExplanationOnly(e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#1C00BC] transition-colors">Missing Explanation</span>
              </label>
              <button
                type="button"
                onClick={() => setShowMoreFilters((prev) => !prev)}
                className="ml-auto text-[#1C00BC] text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <Filter className="w-4 h-4" />
                {showMoreFilters ? "Hide Filters" : "More Filters"}
              </button>
            </div>
          </div>

          {showMoreFilters ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Review Status</Label>
                <select
                  className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Difficulty</Label>
                <select
                  className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] font-body text-sm rounded-t-lg px-3 py-2"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}
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
                    <span className="font-semibold text-[#1C00BC]">{selectedSubject === "All Subjects" ? "Mathematics" : selectedSubject}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#1C00BC]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">JAMB Year</Label>
                  <Input
                    className="w-full bg-slate-50 border-0 border-b border-slate-200 focus:ring-0 focus:border-[#1C00BC] p-4 font-body font-bold rounded-t-xl"
                    type="number"
                    value={questionYear}
                    onChange={(e) => setQuestionYear(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syllabus Topic Tag</Label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    {syllabusTags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#1C00BC] text-white text-xs font-bold rounded-full inline-flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} aria-label={`Remove ${tag}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="New tag"
                      className="h-8 w-32 bg-white border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-100 transition-colors"
                    >
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
                      <button type="button" onClick={() => applyFormatting("bold")} className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">format_bold</button>
                      <button type="button" onClick={() => applyFormatting("italic")} className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">format_italic</button>
                      <button type="button" onClick={() => applyFormatting("math")} className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">functions</button>
                      <button type="button" onClick={() => applyFormatting("image")} className="material-symbols-outlined text-lg text-slate-500 hover:text-[#1C00BC] transition-colors">image</button>
                    </div>
                    <textarea
                      className="w-full bg-white p-4 border-0 focus:ring-0 font-body leading-relaxed"
                      placeholder="e.g., Find the derivative of f(x) = 3x^2 + 5x - 2..."
                      rows={4}
                      value={questionBody}
                      onChange={(e) => setQuestionBody(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {answerOptions.map((optionItem) => (
                    <div key={optionItem.label} className="flex items-center gap-4 group">
                      <input
                        className="w-6 h-6 text-[#1C00BC] focus:ring-[#1C00BC]/20 border-slate-300"
                        name="correct_ans"
                        type="radio"
                        checked={correctOption === optionItem.label}
                        onChange={() => setCorrectOption(optionItem.label)}
                      />
                      <div className="flex-1 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 focus-within:border-[#1C00BC] transition-colors">
                        <span className="font-bold text-slate-500">{optionItem.label}.</span>
                        <input
                          className="w-full bg-transparent border-0 focus:ring-0 p-0 font-medium"
                          type="text"
                          value={optionItem.value}
                          onChange={(e) => handleOptionChange(optionItem.label, e.target.value)}
                        />
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
                <button type="button" onClick={handleAutoSolve} className="w-full sm:w-auto px-4 py-2 bg-[#FBB100] text-[#281900] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Auto-Solve via SmashAI
                </button>
              </div>
              <div className="space-y-4 relative">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provide a deep conceptual breakdown. Explain <span className="font-bold">why</span> the correct answer is right and why the distractors are wrong.
                </p>
                <textarea
                  className="w-full bg-slate-50 border-0 border-b border-[#1C00BC]/30 focus:ring-0 focus:border-[#1C00BC] p-6 font-body text-sm leading-relaxed rounded-t-xl"
                  placeholder="Step 1: Identify the function f(x)..."
                  rows={6}
                  value={explanationBody}
                  onChange={(e) => setExplanationBody(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_20px_40px_rgba(11,28,48,0.05)]">
              <h4 className="font-black text-slate-900 mb-4">Entry Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Syllabus Mapping</span>
                  {syllabusTags.length > 0 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Validated
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <CircleAlert className="w-4 h-4" />
                      Missing
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Option Balance</span>
                  {answerOptions.every((option) => option.value.trim().length > 0) ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Uniform
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <CircleAlert className="w-4 h-4" />
                      Incomplete
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">AI Explanation</span>
                  {explanationBody.trim().length > 0 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <CircleAlert className="w-4 h-4" />
                      Needs Review
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <button type="button" onClick={handlePublish} className="w-full py-4 bg-[#1C00BC] text-white font-bold rounded-xl shadow-lg shadow-[#1C00BC]/30 hover:bg-[#2B0AFA] transition-all active:scale-[0.98]">
                  Publish Question
                </button>
                <button type="button" onClick={handleSaveDraft} className="w-full py-3 bg-slate-50 text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all">
                  Save as Draft
                </button>
                <button type="button" onClick={handleDiscard} className="w-full py-3 text-red-600 font-bold text-sm hover:underline">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] border border-slate-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Review Queue</h3>
                <p className="text-sm text-slate-500">Questions needing validation before publishing</p>
              </div>
              <button type="button" onClick={() => setViewAllRows((prev) => !prev)} className="text-sm font-bold text-[#1C00BC] flex items-center gap-1 hover:underline">
                {viewAllRows ? "Show less" : "View all"}
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
                  {visibleRows.map((row) => (
                    <tr key={row.id} className={`hover:bg-slate-50 transition-colors ${activeQuestionId === row.id ? "bg-[#1C00BC]/5" : ""}`}>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{row.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{row.subject} <span className="text-xs text-slate-400">({row.year})</span></td>
                      <td className="px-4 py-4 text-sm text-slate-700">{row.topic}</td>
                      <td className="px-4 py-4">
                        <Badge variant={row.status === "Validated" ? "default" : row.status === "Needs Review" ? "secondary" : "outline"}>{row.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button type="button" onClick={() => handleOpenRow(row.id)} className="inline-flex items-center gap-1 text-xs font-bold text-[#1C00BC] hover:underline">
                          <Eye className="w-4 h-4" />
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleRows.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No rows match the current filter selection.</p>
            ) : null}
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
                    <p className="text-xs text-slate-500">{selectedSubject === "All Subjects" ? "Mathematics" : selectedSubject}</p>
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
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

export default QuestionBank;
