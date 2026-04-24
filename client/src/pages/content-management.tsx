import { FormEvent, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-fetch";
import { FileText, Upload, Sparkles, Search, Trophy, Zap, Gauge, Share2, CheckCircle2, Plus, Trash2, X } from "lucide-react";

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
  [key: string]: string | undefined;
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

interface SectionDraft {
  sectionTitle: string;
  definition: string;
  explanation: string;
  examplesInput: string;
  jambPoint: string;
  quickTip: string;
  aiParagraphsInput: string;
  illustrationImageUrl: string;
  illustrationFileName: string;
}

const buildEmptySection = (): SectionDraft => ({
  sectionTitle: "",
  definition: "",
  explanation: "",
  examplesInput: "",
  jambPoint: "",
  quickTip: "",
  aiParagraphsInput: "",
  illustrationImageUrl: "",
  illustrationFileName: "",
});

export default function ContentManagement() {
  const noteFileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicName, setTopicName] = useState("");
  const [referenceBook, setReferenceBook] = useState("");
  const [overview, setOverview] = useState("");
  const [jambFocusInput, setJambFocusInput] = useState("");
  const [learningGoalsInput, setLearningGoalsInput] = useState("");
  const [prerequisitesInput, setPrerequisitesInput] = useState("");
  const [relatedTopicsInput, setRelatedTopicsInput] = useState("");
  const [revisionPriority, setRevisionPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [sections, setSections] = useState<SectionDraft[]>([buildEmptySection()]);
  const [yieldClass, setYieldClass] = useState<"foundational" | "high" | "low">("high");
  const [extractionItems, setExtractionItems] = useState(INITIAL_EXTRACTION_ITEMS);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedNoteFile, setSelectedNoteFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isParsingNote, setIsParsingNote] = useState(false);
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

  async function handleUploadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadMessage(null);
    setTopicErrors({});

    if (!selectedSubject) {
      setUploadError("Please select a JAMB subject before parsing.");
      return;
    }

    if (!selectedNoteFile) {
      setUploadError("Please upload the note file to parse.");
      return;
    }

    setIsParsingNote(true);

    try {
      const formData = new FormData();
      formData.append("noteFile", selectedNoteFile);
      formData.append("topicName", topicName.trim());

      const response = await apiFetch("/api/admin/topics/parse-note", {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody?.error || "Unable to parse note file.");
      }

      const parsed = responseBody?.data || {};
      const parsedSections = Array.isArray(parsed.sections) ? parsed.sections : [];

      setTopicName(String(parsed.topicName || topicName).trim());
      setOverview(String(parsed.overview || "").trim());
      setReferenceBook(String(parsed.referenceBook || "").trim());
      setJambFocusInput((parsed.jambFocus || []).join("\n"));
      setLearningGoalsInput((parsed.learningGoals || []).join("\n"));
      setPrerequisitesInput((parsed.prerequisites || []).join("\n"));
      setRelatedTopicsInput((parsed.relatedTopics || []).join("\n"));
      setRevisionPriority(
        ["low", "medium", "high", "critical"].includes(String(parsed.revisionPriority || "").toLowerCase())
          ? (String(parsed.revisionPriority).toLowerCase() as "low" | "medium" | "high" | "critical")
          : "medium",
      );

      if (parsedSections.length > 0) {
        setSections(
          parsedSections.map((section: any) => ({
            sectionTitle: String(section?.sectionTitle || "").trim(),
            definition: String(section?.definition || "").trim(),
            explanation: String(section?.explanation || "").trim(),
            examplesInput: Array.isArray(section?.examples) ? section.examples.join("\n") : "",
            jambPoint: String(section?.jambPoint || "").trim(),
            quickTip: String(section?.quickTip || "").trim(),
            aiParagraphsInput: Array.isArray(section?.aiExplanation?.paragraphs)
              ? section.aiExplanation.paragraphs.join("\n\n")
              : "",
            illustrationImageUrl: String(section?.illustrationImageUrl || "").trim(),
            illustrationFileName: "",
          })),
        );
      }

      setExtractionItems((prev) => [
        {
          name: `${selectedSubject} - Parsed - ${selectedNoteFile.name}`,
          score: responseBody?.meta?.usedGemini ? "AI Parsed" : "Parsed",
          processing: false,
        },
        ...prev,
      ]);
      setUploadError(null);
      setUploadMessage(responseBody?.message || "Note parsed and form auto-filled.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to parse note file.";
      setUploadError(message);
    } finally {
      setIsParsingNote(false);
    }
  }

  function validateTopicDraft() {
    const nextErrors: TopicFormErrors = {};
    const trimmedTopicName = topicName.trim();
    const parsedJambFocus = jambFocusInput.split("\n").map((item) => item.trim()).filter(Boolean);
    const parsedLearningGoals = learningGoalsInput.split("\n").map((item) => item.trim()).filter(Boolean);

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

    if (!overview.trim()) {
      nextErrors.overview = "Overview is required.";
    }

    if (parsedLearningGoals.length === 0) {
      nextErrors.learningGoals = "Add at least one learning goal (one per line).";
    }

    if (parsedJambFocus.length === 0) {
      nextErrors.jambFocus = "Add at least one JAMB focus point (one per line).";
    }

    if (sections.length === 0) {
      nextErrors.sections = "Add at least one section.";
    }

    sections.forEach((section, index) => {
      if (!section.sectionTitle.trim()) {
        nextErrors[`sections.${index}.sectionTitle`] = "Section title is required.";
      }
      if (!section.definition.trim() && !section.explanation.trim()) {
        nextErrors[`sections.${index}.explanation`] = "Add a definition or explanation.";
      }
      const paragraphCount = section.aiParagraphsInput
        .split("\n\n")
        .map((item) => item.trim())
        .filter(Boolean).length;
      if (paragraphCount === 0) {
        nextErrors[`sections.${index}.aiExplanation`] = "Add at least one AI explanation paragraph (separate with blank lines).";
      }
      if (section.illustrationImageUrl && !section.illustrationImageUrl.startsWith("data:image/")) {
        nextErrors[`sections.${index}.illustrationImageUrl`] = "Section image must be a valid image file.";
      }
    });

    if (sections.filter((section) => section.illustrationImageUrl).length > 4) {
      nextErrors.sectionsImages = "Use up to 4 section illustrations per topic to keep uploads light.";
    }

    if (!["foundational", "high", "low"].includes(yieldClass)) {
      nextErrors.yieldClass = "Please choose a valid yield classification.";
    }

    return nextErrors;
  }

  function handleSectionImageSelect(index: number, file: File | null) {
    if (!file) {
      updateSection(index, { illustrationImageUrl: "", illustrationFileName: "" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setTopicErrors((prev) => ({ ...prev, [`sections.${index}.illustrationImageUrl`]: "Only image files are allowed." }));
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setTopicErrors((prev) => ({
        ...prev,
        [`sections.${index}.illustrationImageUrl`]: "Image must be 1.5MB or less.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateSection(index, {
        illustrationImageUrl: typeof reader.result === "string" ? reader.result : "",
        illustrationFileName: file.name,
      });
      setTopicErrors((prev) => ({ ...prev, [`sections.${index}.illustrationImageUrl`]: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function updateSection(index: number, patch: Partial<SectionDraft>) {
    setSections((prev) => prev.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  }

  function addSection() {
    setSections((prev) => [...prev, buildEmptySection()]);
  }

  function removeSection(index: number) {
    setSections((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function resetTopicForm() {
    setTopicName("");
    setReferenceBook("");
    setOverview("");
    setJambFocusInput("");
    setLearningGoalsInput("");
    setPrerequisitesInput("");
    setRelatedTopicsInput("");
    setRevisionPriority("medium");
    setSections([buildEmptySection()]);
    setSelectedSubject("");
    setSelectedNoteFile(null);
    setYieldClass("high");
    setTopicErrors({});
    setTopicMessage(null);
    setUploadMessage(null);
    setUploadError(null);
    if (noteFileInputRef.current) {
      noteFileInputRef.current.value = "";
    }
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
      const parsedJambFocus = jambFocusInput.split("\n").map((item) => item.trim()).filter(Boolean);
      const parsedLearningGoals = learningGoalsInput.split("\n").map((item) => item.trim()).filter(Boolean);
      const parsedPrerequisites = prerequisitesInput.split("\n").map((item) => item.trim()).filter(Boolean);
      const parsedRelatedTopics = relatedTopicsInput.split("\n").map((item) => item.trim()).filter(Boolean);
      const firstSection = sections[0];
      const normalizedSections = sections.map((section, index) => ({
        sectionTitle: section.sectionTitle.trim(),
        order: index,
        definition: section.definition.trim(),
        explanation: section.explanation.trim(),
        examples: section.examplesInput.split("\n").map((item) => item.trim()).filter(Boolean),
        jambPoint: section.jambPoint.trim(),
        quickTip: section.quickTip.trim(),
        illustrationImageUrl: section.illustrationImageUrl || null,
        aiExplanation: {
          paragraphs: section.aiParagraphsInput
            .split("\n\n")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      }));
      const highYieldSummary = overview.trim();
      const keyDefinitions = normalizedSections.map((item) => item.definition).filter(Boolean);
      const importantFormulasFacts = normalizedSections.map((item) => item.jambPoint).filter(Boolean);
      const simpleExplanation = firstSection?.explanation?.trim() || firstSection?.definition?.trim() || highYieldSummary;
      const aiParagraphs = firstSection?.aiParagraphsInput
        ?.split("\n\n")
        .map((item) => item.trim())
        .filter(Boolean) || [];

      const payload = {
        subject: selectedSubject,
        topicName: topicName.trim(),
        highYieldSummary,
        keyDefinitions,
        simpleExplanation,
        importantFormulasFacts,
        aiExplanations: {
          whyCorrectIsCorrect: "Correct options follow the section definitions and rule conditions.",
          whyOthersAreWrong: "Wrong options usually violate the concept definition or a required condition.",
          simpleBreakdown: "Read question, identify tested concept, apply rule, eliminate distractors.",
          paragraphs: aiParagraphs,
        },
        yieldClass,
        summary: highYieldSummary,
        content: simpleExplanation,
        commonTraps: [],
        order: 0,
        status: "active",
        overview: overview.trim(),
        referenceBook: referenceBook.trim(),
        jambFocus: parsedJambFocus,
        learningGoals: parsedLearningGoals,
        prerequisites: parsedPrerequisites,
        relatedTopics: parsedRelatedTopics,
        revisionPriority,
        sections: normalizedSections,
      };

      const response = await apiFetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (responseBody?.fieldErrors) {
          setTopicErrors(responseBody.fieldErrors);
        }
        throw new Error(responseBody?.error || "Unable to save topic.");
      }

      setTopicMessage(responseBody?.message || "Topic saved successfully.");
      resetTopicForm();
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
                  ref={noteFileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleChooseNoteFile(e.target.files?.[0] ?? null)}
                />

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Study Note File</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => noteFileInputRef.current?.click()}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left"
                    >
                      {selectedNoteFile ? selectedNoteFile.name : "Choose note file (.pdf or .docx)"}
                    </button>
                    {selectedNoteFile && (
                      <button
                        type="button"
                        onClick={() => handleChooseNoteFile(null)}
                        className="rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 text-red-600 hover:bg-red-100 transition-colors"
                        title="Clear selected file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => noteFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-brand-blue/30 rounded-2xl p-8 text-center space-y-4 hover:border-brand-blue transition-colors bg-gradient-to-b from-brand-blue/5 to-brand-gold/10"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Upload Note File to Auto-Fill Form</p>
                    <p className="text-xs text-slate-500">Max file size: 50MB. Supports .pdf, .docx</p>
                  </div>
                </button>

                {uploadError ? <p className="text-xs font-medium text-red-600">{uploadError}</p> : null}
                {uploadMessage ? <p className="text-xs font-medium text-green-700">{uploadMessage}</p> : null}

                <Button type="submit" className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25">
                  {isParsingNote ? "Parsing Note..." : "Parse and Fill Structured Form"}
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
              <div className="rounded-full bg-brand-blue/10 border border-brand-blue/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                Structured Note Form
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

              <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference Book</Label>
                      <Input
                        value={referenceBook}
                        onChange={(e) => setReferenceBook(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl"
                        placeholder="e.g., New School Chemistry by Osei Yaw Ababio"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revision Priority</Label>
                      <select
                        value={revisionPriority}
                        onChange={(e) => setRevisionPriority(e.target.value as "low" | "medium" | "high" | "critical")}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overview</Label>
                    <Textarea
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      className="w-full bg-brand-blue/5 border border-brand-blue/10 rounded-xl h-28 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-6"
                      placeholder="Give a concise overview of this topic as it appears in your note."
                    />
                    {topicErrors.overview ? <p className="text-xs font-medium text-red-600">{topicErrors.overview}</p> : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">JAMB Focus Points</Label>
                      <Textarea
                        value={jambFocusInput}
                        onChange={(e) => setJambFocusInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl h-32 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                        placeholder={"One point per line\nDefinition-based questions\nTrend/periodicity questions"}
                      />
                      {topicErrors.jambFocus ? <p className="text-xs font-medium text-red-600">{topicErrors.jambFocus}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Learning Goals</Label>
                      <Textarea
                        value={learningGoalsInput}
                        onChange={(e) => setLearningGoalsInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl h-32 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                        placeholder={"One goal per line\nDefine the core concept\nApply it to objective questions"}
                      />
                      {topicErrors.learningGoals ? <p className="text-xs font-medium text-red-600">{topicErrors.learningGoals}</p> : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prerequisites</Label>
                      <Textarea
                        value={prerequisitesInput}
                        onChange={(e) => setPrerequisitesInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl h-28 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                        placeholder={"One prerequisite per line"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Related Topics</Label>
                      <Textarea
                        value={relatedTopicsInput}
                        onChange={(e) => setRelatedTopicsInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl h-28 text-slate-800 leading-relaxed focus-visible:ring-2 focus-visible:ring-brand-blue/20 resize-none p-4"
                        placeholder={"One related topic per line"}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Structured Sections</Label>
                      <Button type="button" onClick={addSection} className="h-8 bg-brand-blue text-white hover:bg-brand-blue/90 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Section
                      </Button>
                    </div>

                    {sections.map((section, index) => (
                      <div key={`section-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-800">Section {index + 1}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeSection(index)}
                            className="h-8 text-red-600 hover:bg-red-50"
                            disabled={sections.length === 1}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Section Title</Label>
                          <Input
                            value={section.sectionTitle}
                            onChange={(e) => updateSection(index, { sectionTitle: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl"
                            placeholder="e.g., Dalton's Atomic Theory"
                          />
                          {topicErrors[`sections.${index}.sectionTitle`] ? (
                            <p className="text-xs font-medium text-red-600">{topicErrors[`sections.${index}.sectionTitle`]}</p>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Definition</Label>
                            <Textarea
                              value={section.definition}
                              onChange={(e) => updateSection(index, { definition: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">JAMB Point</Label>
                            <Textarea
                              value={section.jambPoint}
                              onChange={(e) => updateSection(index, { jambPoint: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Explanation</Label>
                          <Textarea
                            value={section.explanation}
                            onChange={(e) => updateSection(index, { explanation: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none"
                          />
                          {topicErrors[`sections.${index}.explanation`] ? (
                            <p className="text-xs font-medium text-red-600">{topicErrors[`sections.${index}.explanation`]}</p>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Examples</Label>
                            <Textarea
                              value={section.examplesInput}
                              onChange={(e) => updateSection(index, { examplesInput: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none"
                              placeholder={"One example per line"}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Quick Tip</Label>
                            <Textarea
                              value={section.quickTip}
                              onChange={(e) => updateSection(index, { quickTip: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">AI Explanation Paragraphs</Label>
                          <Textarea
                            value={section.aiParagraphsInput}
                            onChange={(e) => updateSection(index, { aiParagraphsInput: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl h-28 resize-none"
                            placeholder={"Separate each paragraph with one blank line."}
                          />
                          {topicErrors[`sections.${index}.aiExplanation`] ? (
                            <p className="text-xs font-medium text-red-600">{topicErrors[`sections.${index}.aiExplanation`]}</p>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Section Illustration (Optional)</Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSectionImageSelect(index, e.target.files?.[0] ?? null)}
                            className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue/10 file:px-3 file:py-2 file:font-semibold file:text-brand-blue hover:file:bg-brand-blue/20"
                          />
                          {section.illustrationFileName ? (
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <p className="text-xs text-slate-600">Selected: {section.illustrationFileName}</p>
                              <button
                                type="button"
                                onClick={() => handleSectionImageSelect(index, null)}
                                className="text-red-600 hover:text-red-700 transition-colors"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : null}
                          {section.illustrationImageUrl ? (
                            <div className="space-y-2">
                              <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 relative group">
                                <img src={section.illustrationImageUrl} alt={`Section ${index + 1} illustration`} className="w-full max-h-48 object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleSectionImageSelect(index, null)}
                                  className="absolute top-2 right-2 rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {topicErrors[`sections.${index}.illustrationImageUrl`] ? (
                            <p className="text-xs font-medium text-red-600">{topicErrors[`sections.${index}.illustrationImageUrl`]}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {topicErrors.sections ? <p className="text-xs font-medium text-red-600">{topicErrors.sections}</p> : null}
                    {topicErrors.sectionsImages ? <p className="text-xs font-medium text-red-600">{topicErrors.sectionsImages}</p> : null}
                  </div>
              </>

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
                onClick={resetTopicForm}
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
