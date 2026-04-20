import { FormEvent, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-fetch";
import {
  FileText,
  Upload,
  Sparkles,
  Search,
  Bold,
  Italic,
  List,
  Link2,
  Trophy,
  Zap,
  Gauge,
  Share2,
  CheckCircle2,
} from "lucide-react";

const INITIAL_EXTRACTION_ITEMS = [
  { name: "Pathology_Core_2024.pdf", score: "98% Match", processing: false },
  { name: "Cardiology_Draft.pdf", score: "Processing...", processing: true },
];

const collaborators = ["JD", "AK", "TO"];
const JAMB_SUBJECTS = [
  "Use of English",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Government",
  "Literature in English",
  "CRK",
  "IRK",
  "Geography",
  "Commerce",
  "Accounting",
  "Agricultural Science",
  "History",
  "French",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Arabic",
  "Music",
  "Fine Arts",
  "Computer Studies",
  "Home Economics",
  "Technical Drawing",
  "Civic Education",
];

interface TopicFormErrors {
  subject?: string;
  topicName?: string;
  highYieldSummary?: string;
  keyDefinitions?: string;
  simpleExplanation?: string;
  importantFormulasFacts?: string;
  whyCorrectIsCorrect?: string;
  whyOthersAreWrong?: string;
  simpleBreakdown?: string;
  yieldClass?: string;
  general?: string;
}

export default function ContentManagement() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const noteFileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicName, setTopicName] = useState("");
  const [highYieldSummary, setHighYieldSummary] = useState("");
  const [keyDefinitionsInput, setKeyDefinitionsInput] = useState("");
  const [simpleExplanation, setSimpleExplanation] = useState("");
  const [importantFormulasFactsInput, setImportantFormulasFactsInput] = useState("");
  const [whyCorrectIsCorrect, setWhyCorrectIsCorrect] = useState("");
  const [whyOthersAreWrong, setWhyOthersAreWrong] = useState("");
  const [simpleBreakdown, setSimpleBreakdown] = useState("");
  const [yieldClass, setYieldClass] = useState<"foundational" | "high" | "low">("high");
  const [extractionItems, setExtractionItems] = useState(INITIAL_EXTRACTION_ITEMS);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedNoteFile, setSelectedNoteFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [topicErrors, setTopicErrors] = useState<TopicFormErrors>({});
  const [topicMessage, setTopicMessage] = useState<string | null>(null);
  const [isSavingTopic, setIsSavingTopic] = useState(false);

  const allowedExtensions = ["pdf", "docx"];
  const maxFileSizeBytes = 50 * 1024 * 1024;

  function getFileExtension(fileName: string) {
    const parts = fileName.toLowerCase().split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }

  function validateFiles(files: File[]) {
    for (const file of files) {
      const extension = getFileExtension(file.name);
      if (!allowedExtensions.includes(extension)) {
        return `Unsupported file type: ${file.name}. Only .pdf and .docx are allowed.`;
      }
      if (file.size > maxFileSizeBytes) {
        return `File too large: ${file.name}. Maximum allowed size is 50MB.`;
      }
    }
    return null;
  }

  function handleChooseFiles(files: File[]) {
    setUploadMessage(null);
    const validationError = validateFiles(files);
    if (validationError) {
      setUploadError(validationError);
      setSelectedFiles([]);
      return;
    }

    setUploadError(null);
    setSelectedFiles(files);
  }

  function handleChooseNoteFile(file: File | null) {
    setUploadMessage(null);
    if (!file) {
      setSelectedNoteFile(null);
      return;
    }

    const validationError = validateFiles([file]);
    if (validationError) {
      setUploadError(validationError);
      setSelectedNoteFile(null);
      return;
    }

    setUploadError(null);
    setSelectedNoteFile(file);
  }

  function handleUploadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadMessage(null);

    if (!selectedSubject) {
      setUploadError("Please select a JAMB subject before uploading.");
      return;
    }

    if (selectedFiles.length === 0) {
      setUploadError("Please choose at least one file to upload.");
      return;
    }

    if (!selectedNoteFile) {
      setUploadError("Please upload the note file as well.");
      return;
    }

    const queuedItems = selectedFiles.map((file) => ({
      name: `${selectedSubject} - ${file.name}`,
      score: "Queued...",
      processing: true,
    }));

    const noteQueueItem = {
      name: `${selectedSubject} - Note - ${selectedNoteFile.name}`,
      score: "Queued...",
      processing: true,
    };

    setExtractionItems((prev) => [noteQueueItem, ...queuedItems, ...prev]);
    setSelectedFiles([]);
    setSelectedNoteFile(null);
    setUploadError(null);
    setUploadMessage(`Uploaded ${queuedItems.length} topic file(s) and 1 note file for ${selectedSubject}.`);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (noteFileInputRef.current) {
      noteFileInputRef.current.value = "";
    }
  }

  function validateTopicDraft() {
    const nextErrors: TopicFormErrors = {};
    const trimmedTopicName = topicName.trim();
    const trimmedHighYieldSummary = highYieldSummary.trim();
    const trimmedSimpleExplanation = simpleExplanation.trim();
    const parsedKeyDefinitions = keyDefinitionsInput
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const parsedImportantFormulasFacts = importantFormulasFactsInput
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!selectedSubject) {
      nextErrors.subject = "Please select a JAMB subject.";
    } else if (!JAMB_SUBJECTS.includes(selectedSubject)) {
      nextErrors.subject = "Please choose a subject from the list.";
    }

    if (!trimmedTopicName) {
      nextErrors.topicName = "Topic name is required.";
    } else if (trimmedTopicName.length < 3) {
      nextErrors.topicName = "Topic name must be at least 3 characters.";
    } else if (trimmedTopicName.length > 180) {
      nextErrors.topicName = "Topic name must be 180 characters or less.";
    }

    if (!trimmedHighYieldSummary) {
      nextErrors.highYieldSummary = "High-yield summary is required.";
    }

    if (parsedKeyDefinitions.length === 0) {
      nextErrors.keyDefinitions = "Add at least one key definition (one per line).";
    }

    if (!trimmedSimpleExplanation) {
      nextErrors.simpleExplanation = "Simple explanation is required.";
    } else if (trimmedSimpleExplanation.length < 20) {
      nextErrors.simpleExplanation = "Simple explanation must be at least 20 characters.";
    }

    if (parsedImportantFormulasFacts.length === 0) {
      nextErrors.importantFormulasFacts = "Add at least one important formula or fact (one per line).";
    }

    if (!whyCorrectIsCorrect.trim()) {
      nextErrors.whyCorrectIsCorrect = "Why correct answer is correct is required.";
    }

    if (!whyOthersAreWrong.trim()) {
      nextErrors.whyOthersAreWrong = "Why others are wrong is required.";
    }

    if (!simpleBreakdown.trim()) {
      nextErrors.simpleBreakdown = "Simple breakdown is required.";
    }

    if (!["foundational", "high", "low"].includes(yieldClass)) {
      nextErrors.yieldClass = "Please choose a valid yield classification.";
    }

    return nextErrors;
  }

  async function handleSaveTopic() {
    setTopicMessage(null);
    setTopicErrors({});

    const nextErrors = validateTopicDraft();
    if (Object.keys(nextErrors).length > 0) {
      setTopicErrors(nextErrors);
      return;
    }

    setIsSavingTopic(true);

    try {
      const response = await apiFetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          topicName: topicName.trim(),
          highYieldSummary: highYieldSummary.trim(),
          keyDefinitions: keyDefinitionsInput.split("\n").map((item) => item.trim()).filter(Boolean),
          simpleExplanation: simpleExplanation.trim(),
          importantFormulasFacts: importantFormulasFactsInput.split("\n").map((item) => item.trim()).filter(Boolean),
          aiExplanations: {
            whyCorrectIsCorrect: whyCorrectIsCorrect.trim(),
            whyOthersAreWrong: whyOthersAreWrong.trim(),
            simpleBreakdown: simpleBreakdown.trim(),
          },
          yieldClass,
          summary: highYieldSummary.trim(),
          content: simpleExplanation.trim(),
          commonTraps: whyOthersAreWrong.split("\n").map((item) => item.trim()).filter(Boolean),
          order: 0,
          status: "active",
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (responseBody?.fieldErrors) {
          setTopicErrors(responseBody.fieldErrors);
        }
        throw new Error(responseBody?.error || "Unable to save topic.");
      }

      setTopicMessage(responseBody?.message || "Topic saved successfully.");
      setTopicName("");
      setHighYieldSummary("");
      setKeyDefinitionsInput("");
      setSimpleExplanation("");
      setImportantFormulasFactsInput("");
      setWhyCorrectIsCorrect("");
      setWhyOthersAreWrong("");
      setSimpleBreakdown("");
      setSelectedSubject("");
      setYieldClass("high");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save topic.";
      setTopicErrors((prev) => ({
        ...prev,
        general: message,
      }));
    } finally {
      setIsSavingTopic(false);
    }
  }

  const filteredExtractions = useMemo(() => {
    if (!searchQuery.trim()) return extractionItems;
    const q = searchQuery.toLowerCase();
    return extractionItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchQuery, extractionItems]);

  return (
    <AdminShell searchPlaceholder="Search parameters...">
      <div className="relative p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto pb-28 xl:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
          <div className="absolute top-36 right-0 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-brand-blue/10 blur-2xl" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-brand-blue font-bold text-[10px] uppercase tracking-widest bg-white/70 border border-brand-blue/20 rounded-full px-3 py-1">
              <span className="w-6 h-[2px] bg-brand-blue" />
              Topic Upload Studio
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Topic Editor & Importer</h1>
            <p className="text-slate-600 max-w-2xl">Refine AI-extracted modules and finalize curriculum topic structures with a cleaner, faster publishing workflow.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white">Drafts (12)</Button>
            <Button variant="outline" className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white">Revision History</Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          <section className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl ring-1 ring-brand-blue/15 shadow-[0_24px_50px_rgba(11,28,48,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-blue" />
                  Smart Import
                </h3>
                <Badge className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] font-bold uppercase tracking-widest">Beta</Badge>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  multiple
                  className="hidden"
                  onChange={(e) => handleChooseFiles(Array.from(e.target.files ?? []))}
                />
                <input
                  ref={noteFileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleChooseNoteFile(e.target.files?.[0] ?? null)}
                />

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Study Note File</Label>
                  <button
                    type="button"
                    onClick={() => noteFileInputRef.current?.click()}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left"
                  >
                    {selectedNoteFile ? selectedNoteFile.name : "Choose note file (.pdf or .docx)"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-brand-blue/30 rounded-2xl p-8 text-center space-y-4 hover:border-brand-blue transition-colors bg-gradient-to-b from-brand-blue/5 to-brand-gold/10"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Upload Topic File for AI Extraction</p>
                    <p className="text-xs text-slate-500">Max file size: 50MB. Supports .pdf, .docx</p>
                  </div>
                </button>

                {selectedFiles.length > 0 ? (
                  <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Selected Files</p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {selectedFiles.map((file) => (
                        <li key={file.name} className="truncate">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {uploadError ? <p className="text-xs font-medium text-red-600">{uploadError}</p> : null}
                {uploadMessage ? <p className="text-xs font-medium text-green-700">{uploadMessage}</p> : null}

                <Button type="submit" className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25">
                  Add to Extraction Queue
                </Button>
              </form>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Extractions</p>
                  <div className="relative w-44">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search files..."
                      className="h-8 pl-7 text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredExtractions.map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                        item.processing
                          ? "bg-slate-50/60 border-slate-300"
                          : "bg-brand-blue/5 border-brand-gold"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className={`text-sm font-medium ${item.processing ? "text-slate-500" : "text-slate-900"}`}>{item.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono ${item.processing ? "text-slate-500 italic" : "text-brand-blue font-bold"}`}>{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-blue to-indigo-700 p-6 rounded-2xl space-y-3 border border-brand-blue/20 text-white shadow-[0_24px_45px_rgba(28,0,188,0.22)]">
              <h4 className="text-sm font-bold text-white">Extraction Intelligence</h4>
              <p className="text-xs text-white/85 leading-relaxed">
                Our AI identifies key topic relationships and assigns preliminary yields based on historical exam frequency.
              </p>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-brand-gold rounded-full" />
              </div>
              <p className="text-[10px] font-mono text-brand-gold font-bold">API STATUS: OPERATIONAL</p>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-brand-blue/15 shadow-[0_24px_50px_rgba(11,28,48,0.08)] overflow-hidden">
            <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-brand-blue/5 to-brand-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-brand-gold rounded-full" />
                <h3 className="font-black text-xl text-slate-900">Topic Details</h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Auto-saved at 14:02
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3 flex-wrap">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">JAMB Subject</Label>
                    <p className="text-sm text-slate-600 mt-1">Choose one subject from the list before saving the topic.</p>
                  </div>
                  <div className="rounded-full bg-brand-blue/5 border border-brand-blue/15 px-3 py-1 text-[11px] font-bold text-brand-blue">
                    Active: {selectedSubject || "None"}
                  </div>
                </div>

                <div className="rounded-2xl border border-brand-blue/20 bg-white p-4 shadow-sm space-y-3">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">Select JAMB subject</option>
                    {JAMB_SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>

                  <div className="pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-600">Selected Subject: </span>
                    <span className="font-bold text-brand-blue">{selectedSubject || "Not selected"}</span>
                  </div>
                  {topicErrors.subject ? <p className="text-xs font-medium text-red-600">{topicErrors.subject}</p> : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Topic Name</Label>
                <Input
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full bg-brand-blue/5 border-0 border-b-2 border-brand-blue/20 rounded-none text-xl font-bold focus-visible:ring-0 focus-visible:border-brand-blue"
                  placeholder="e.g., Organic Chemistry"
                />
                {topicErrors.topicName ? <p className="text-xs font-medium text-red-600">{topicErrors.topicName}</p> : null}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">High-Yield Summary</Label>
                  <div className="flex gap-2 text-slate-500">
                    <button className="p-1 rounded hover:bg-slate-100" aria-label="Bold"><Bold className="w-4 h-4" /></button>
                    <button className="p-1 rounded hover:bg-slate-100" aria-label="Italic"><Italic className="w-4 h-4" /></button>
                    <button className="p-1 rounded hover:bg-slate-100" aria-label="List"><List className="w-4 h-4" /></button>
                    <button className="p-1 rounded hover:bg-slate-100" aria-label="Link"><Link2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <Textarea
                  value={highYieldSummary}
                  onChange={(e) => setHighYieldSummary(e.target.value)}
                  className="w-full bg-brand-blue/5 border border-brand-blue/10 rounded-xl h-28 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-6"
                  placeholder="High-level summary of what students must not miss..."
                />
                {topicErrors.highYieldSummary ? <p className="text-xs font-medium text-red-600">{topicErrors.highYieldSummary}</p> : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Definitions</Label>
                  <Textarea
                    value={keyDefinitionsInput}
                    onChange={(e) => setKeyDefinitionsInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-36 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                    placeholder={"One definition per line\nAllele: alternative form of a gene\nGenotype: genetic makeup"}
                  />
                  {topicErrors.keyDefinitions ? <p className="text-xs font-medium text-red-600">{topicErrors.keyDefinitions}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Important Formulas / Facts</Label>
                  <Textarea
                    value={importantFormulasFactsInput}
                    onChange={(e) => setImportantFormulasFactsInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-36 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                    placeholder={"One formula/fact per line\nHardy-Weinberg: p^2 + 2pq + q^2 = 1"}
                  />
                  {topicErrors.importantFormulasFacts ? <p className="text-xs font-medium text-red-600">{topicErrors.importantFormulasFacts}</p> : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Simple Explanation</Label>
                <Textarea
                  value={simpleExplanation}
                  onChange={(e) => setSimpleExplanation(e.target.value)}
                  className="w-full bg-brand-blue/5 border border-brand-blue/10 rounded-xl h-44 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-6"
                  placeholder="Explain the topic in very simple language students can quickly understand..."
                />
                {topicErrors.simpleExplanation ? <p className="text-xs font-medium text-red-600">{topicErrors.simpleExplanation}</p> : null}
              </div>

              <div className="space-y-4 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Explanations</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Why Correct Answer Is Correct</Label>
                    <Textarea
                      value={whyCorrectIsCorrect}
                      onChange={(e) => setWhyCorrectIsCorrect(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl h-24 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                      placeholder="State why the correct option is correct."
                    />
                    {topicErrors.whyCorrectIsCorrect ? <p className="text-xs font-medium text-red-600">{topicErrors.whyCorrectIsCorrect}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Why Others Are Wrong</Label>
                    <Textarea
                      value={whyOthersAreWrong}
                      onChange={(e) => setWhyOthersAreWrong(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl h-24 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                      placeholder="Explain why distractor options are wrong."
                    />
                    {topicErrors.whyOthersAreWrong ? <p className="text-xs font-medium text-red-600">{topicErrors.whyOthersAreWrong}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Simple Breakdown</Label>
                    <Textarea
                      value={simpleBreakdown}
                      onChange={(e) => setSimpleBreakdown(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl h-24 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                      placeholder="Give a short step-by-step breakdown students can remember quickly."
                    />
                    {topicErrors.simpleBreakdown ? <p className="text-xs font-medium text-red-600">{topicErrors.simpleBreakdown}</p> : null}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Yield Classification</Label>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setYieldClass("foundational")}
                    className={`flex-1 min-w-[140px] flex flex-col items-center gap-2 p-4 rounded-xl ring-2 transition-all ${
                      yieldClass === "foundational"
                        ? "ring-brand-gold bg-brand-gold/20"
                        : "ring-slate-300 bg-slate-50"
                    }`}
                  >
                    <Trophy className={`w-5 h-5 ${yieldClass === "foundational" ? "text-[#694800]" : "text-slate-500"}`} />
                    <span className={`font-bold text-sm ${yieldClass === "foundational" ? "text-[#694800]" : "text-slate-600"}`}>Foundational</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setYieldClass("high")}
                    className={`flex-1 min-w-[140px] flex flex-col items-center gap-2 p-4 rounded-xl ring-2 transition-all ${
                      yieldClass === "high"
                        ? "ring-brand-blue bg-brand-blue/5 shadow-lg shadow-brand-blue/10"
                        : "ring-slate-300 bg-slate-50"
                    }`}
                  >
                    <Zap className={`w-5 h-5 ${yieldClass === "high" ? "text-[#1C00BC]" : "text-slate-500"}`} />
                    <span className={`font-bold text-sm ${yieldClass === "high" ? "text-[#1C00BC]" : "text-slate-600"}`}>High-Yield</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setYieldClass("low")}
                    className={`flex-1 min-w-[140px] flex flex-col items-center gap-2 p-4 rounded-xl ring-2 transition-all ${
                      yieldClass === "low"
                        ? "ring-slate-500 bg-slate-100"
                        : "ring-slate-300 bg-slate-50"
                    }`}
                  >
                    <Gauge className={`w-5 h-5 ${yieldClass === "low" ? "text-[#464557]" : "text-slate-500"}`} />
                    <span className={`font-bold text-sm ${yieldClass === "low" ? "text-[#464557]" : "text-slate-600"}`}>Low-Yield</span>
                  </button>
                </div>
                {topicErrors.yieldClass ? <p className="text-xs font-medium text-red-600">{topicErrors.yieldClass}</p> : null}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-r from-brand-blue/5 to-brand-gold/5 border-t border-slate-200 flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100"
                onClick={() => {
                  setTopicName("");
                  setHighYieldSummary("");
                  setKeyDefinitionsInput("");
                  setSimpleExplanation("");
                  setImportantFormulasFactsInput("");
                  setWhyCorrectIsCorrect("");
                  setWhyOthersAreWrong("");
                  setSimpleBreakdown("");
                  setSelectedSubject("");
                  setYieldClass("high");
                  setTopicErrors({});
                  setTopicMessage(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveTopic}
                disabled={isSavingTopic}
                className="bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25"
              >
                {isSavingTopic ? "Saving Topic..." : "Save Topic"}
              </Button>
            </div>
            {topicErrors.general ? <p className="px-8 pb-6 text-sm font-medium text-red-600">{topicErrors.general}</p> : null}
            {topicMessage ? <p className="px-8 pb-6 text-sm font-medium text-green-700">{topicMessage}</p> : null}
          </section>
        </div>

        <div className="fixed bottom-6 left-72 right-8 z-30 hidden xl:block">
          <div className="rounded-full py-4 px-8 border border-brand-blue/20 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(11,28,48,0.15)] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {collaborators.map((name) => (
                  <div key={name} className="w-8 h-8 rounded-full border-2 border-white bg-brand-blue/10 text-brand-blue text-[10px] font-bold flex items-center justify-center">
                    {name}
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-slate-500">
                <span className="font-bold text-brand-blue">2 Others</span> are currently editing topics in this module.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="text-xs font-bold">
                <Share2 className="w-4 h-4 mr-2" />
                Export Review
              </Button>
              <Button className="text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Verified
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
