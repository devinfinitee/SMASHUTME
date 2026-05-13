import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-fetch";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  BookOpen,
  Brain,
  Lightbulb,
} from "lucide-react";

interface HeadingAnalysis {
  headings: string[];
  estimatedSections: number;
  contentQuality: "good" | "fair" | "poor";
  suggestedTopicName: string;
}

interface AnalysisResult {
  topicName: string;
  overview: string;
  referenceBook: string;
  jambFocus: string[];
  learningGoals: string[];
  prerequisites: string[];
  relatedTopics: string[];
  revisionPriority: "low" | "medium" | "high" | "critical";
  sections: Array<{
    sectionTitle: string;
    order: number;
    definition: string;
    explanation: string;
    examples: string[];
    jambPoint: string;
    quickTip: string;
    aiExplanation: { paragraphs: string[] };
  }>;
}

interface SmartNoteEditorProps {
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  onHeadingsDetected?: (headings: HeadingAnalysis) => void;
}

export function SmartNoteEditor({ onAnalysisComplete, onHeadingsDetected }: SmartNoteEditorProps) {
  const [noteText, setNoteText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [headingAnalysis, setHeadingAnalysis] = useState<HeadingAnalysis | null>(null);
  const [showHeadingPreview, setShowHeadingPreview] = useState(false);
  const analyzeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect headings from the note text with improved pattern matching
  function analyzeHeadings(text: string): HeadingAnalysis {
    const lines = text.split("\n");
    const headingPatterns = [
      /^\*{2}\s+(.+?)\s+\*{2}$/,  // ** heading ** format (PRIORITY)
      /^#+\s+(.+)$/,               // Markdown headers
      /^(?:Chapter|Section|Part)\s+\d+\s*:?\s*(.+)$/i,
      /^(\d+[\).:-]\s+.+)$/,       // Numbered items
      /^(?:Definition|Explanation|Example|Note|Important|Key Point|Overview|Introduction)\s*:?\s*(.*)$/i,
    ];

    const headings: string[] = [];
    let detectedSections = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      for (const pattern of headingPatterns) {
        if (pattern.test(trimmed)) {
          // Clean up the heading text
          let cleanHeading = trimmed
            .replace(/^\*{2}\s+/, "")
            .replace(/\s+\*{2}$/, "")
            .replace(/^#+\s+/, "")
            .replace(/^\d+[\).:-]\s+/, "")
            .trim();
          
          if (cleanHeading) {
            headings.push(cleanHeading);
            detectedSections++;
          }
          break;
        }
      }
    }

    // Estimate content quality based on structure
    let contentQuality: "good" | "fair" | "poor" = "poor";
    if (detectedSections >= 5) contentQuality = "good";
    else if (detectedSections >= 2) contentQuality = "fair";

    // Suggest topic name from first heading
    let suggestedTopicName = "";
    if (headings.length > 0) {
      suggestedTopicName = headings[0];
    }

    return {
      headings: headings.slice(0, 10),
      estimatedSections: detectedSections,
      contentQuality,
      suggestedTopicName,
    };
  }

  // Real-time heading detection
  useEffect(() => {
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }

    if (!noteText.trim()) {
      setHeadingAnalysis(null);
      return;
    }

    analyzeTimeoutRef.current = setTimeout(() => {
      const headings = analyzeHeadings(noteText);
      setHeadingAnalysis(headings);
      onHeadingsDetected?.(headings);
    }, 500);

    return () => {
      if (analyzeTimeoutRef.current) {
        clearTimeout(analyzeTimeoutRef.current);
      }
    };
  }, [noteText, onHeadingsDetected]);

  // Analyze full note with Gemini
  async function handleAnalyzeNote() {
    setAnalysisError(null);
    setAnalysisMessage(null);

    if (!noteText.trim()) {
      setAnalysisError("Please enter some note content before analyzing.");
      return;
    }

    if (noteText.length < 100) {
      setAnalysisError("Note content is too short. Please provide at least 100 characters.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await apiFetch("/api/admin/topics/parse-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: noteText.trim(),
          topicName: headingAnalysis?.suggestedTopicName || "Untitled Topic",
        }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody?.error || "Unable to analyze note.");
      }

      const analysis = responseBody?.data || {};
      onAnalysisComplete?.(analysis);
      setAnalysisMessage(responseBody?.message || "Note analyzed successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to analyze note.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleCopyHeading(heading: string) {
    navigator.clipboard.writeText(heading);
  }

  function handleClearNotes() {
    if (window.confirm("Clear all notes? This cannot be undone.")) {
      setNoteText("");
      setHeadingAnalysis(null);
      setAnalysisError(null);
      setAnalysisMessage(null);
    }
  }

  const contentLength = noteText.length;
  const wordCount = noteText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-blue" />
          <h3 className="font-black text-lg">Smart Note Editor</h3>
          <Badge className="bg-blue-100 text-blue-700 border border-blue-300 text-[10px] font-bold">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-600">
          Paste or type your study notes. AI will analyze the content and auto-fill the structured form based on headings
          and content.
        </p>
      </div>

      {/* Editor Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Note Content</Label>
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
            <span>{contentLength} characters</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>
        </div>

        <div className="relative">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Paste your study notes, chapters, or lesson content here. Include headings like '# Atomic Theory' or 'Section 1: Definitions' for better analysis..."
            className="min-h-64 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
          />

          {noteText && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(noteText)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                title="Copy all text"
              >
                <Copy className="w-4 h-4 text-slate-600" />
              </button>
              <button
                type="button"
                onClick={handleClearNotes}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                title="Clear all notes"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Heading Detection */}
      {headingAnalysis && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-brand-blue" />
              <p className="font-semibold text-sm text-slate-900 dark:text-white">Heading Detection</p>
            </div>
            <Badge className="bg-white dark:bg-slate-800 text-brand-blue border border-brand-blue text-[10px]">
              {headingAnalysis.estimatedSections} sections found
            </Badge>
          </div>

          {/* Content Quality Indicator */}
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Content Quality:</p>
            <div className="flex gap-1">
              {["poor", "fair", "good"].map((quality) => (
                <div
                  key={quality}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    quality === headingAnalysis.contentQuality
                      ? quality === "good"
                        ? "bg-green-500"
                        : quality === "fair"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize ml-2">
                {headingAnalysis.contentQuality}
              </span>
            </div>
          </div>

          {/* Suggested Topic Name */}
          {headingAnalysis.suggestedTopicName && (
            <div className="bg-white dark:bg-slate-800/50 rounded p-3 space-y-1">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Suggested Topic Name:</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {headingAnalysis.suggestedTopicName}
              </p>
            </div>
          )}

          {/* Detected Headings Preview */}
          {headingAnalysis.headings.length > 0 && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowHeadingPreview(!showHeadingPreview)}
                className="text-xs font-semibold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1"
              >
                {showHeadingPreview ? "▼" : "▶"} Show {headingAnalysis.headings.length} detected headings
              </button>

              {showHeadingPreview && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {headingAnalysis.headings.map((heading, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 bg-white dark:bg-slate-800 rounded border border-blue-100 dark:border-blue-900 text-xs"
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-semibold min-w-fit">{idx + 1}.</span>
                      <span className="text-slate-700 dark:text-slate-300 flex-1 line-clamp-2">{heading}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyHeading(heading)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAnalyzeNote}
          disabled={!noteText.trim() || isAnalyzing}
          className="flex-1 bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze and Auto-Fill Form
            </>
          )}
        </Button>
      </div>

      {/* Feedback Messages */}
      {analysisError && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-red-900 dark:text-red-200">Analysis Error</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{analysisError}</p>
          </div>
        </div>
      )}

      {analysisMessage && (
        <div className="flex gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-green-900 dark:text-green-200">Success</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">{analysisMessage}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              The form has been auto-filled with analyzed content. Review and adjust as needed.
            </p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Tips for Best AI Analysis
        </p>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-2 ml-4">
          <li className="font-semibold text-blue-900 dark:text-blue-100">📌 Recommended Format:</li>
          <li className="ml-2">
            <code className="bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded text-[11px] font-mono">** Section Title **</code>
            <span className="ml-2">for headings with double asterisks</span>
          </li>
          <li>Content below each heading is automatically associated with it</li>
          <li>First line after heading becomes the definition</li>
          <li>Include examples with: "e.g.", "for instance", "such as"</li>
          <li>Mark JAMB focus with: "JAMB", "exam", "important", "note"</li>
          <li>Add memory tricks with: "remember", "tip", "mnemonic"</li>
          <li className="font-semibold text-blue-900 dark:text-blue-100 mt-2">💡 Example Structure:</li>
          <li className="ml-2 bg-white/30 dark:bg-slate-800/30 p-2 rounded font-mono text-[10px]">
            ** Atomic Theory **<br/>
            Definition of atoms and core concepts.<br/>
            Examples include hydrogen and helium atoms.<br/>
            JAMB tests definition-based questions here.
          </li>
        </ul>
      </div>
    </div>
  );
}
