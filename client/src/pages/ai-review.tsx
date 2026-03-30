import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Lightbulb,
  Send,
  Share2,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  XCircle,
  CheckCircle2,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";
import { useExplain } from "@/hooks/use-ai";
import { AppShell } from "@/components/app-shell";

type ReviewOption = {
  key: string;
  text: string;
};

type ReviewQuestion = {
  id: string;
  subject: string;
  topic: string;
  trail: string[];
  prompt: string;
  options: ReviewOption[];
  chosen: string;
  correct: string;
  timeSpent: string;
  difficulty: string;
  failRate: string;
  wrongPath: string;
  foundation: string;
  mnemonic: string;
};

const REVIEW_QUESTIONS: ReviewQuestion[] = [
  {
    id: "bio-cell-14",
    subject: "Biology",
    topic: "Cell Theory",
    trail: ["Biology", "Cell Theory", "Question 14 Analysis"],
    prompt:
      "Which of the following cellular components is responsible for the synthesis of adenosine triphosphate (ATP) via oxidative phosphorylation?",
    options: [
      { key: "A", text: "Ribosomes" },
      { key: "B", text: "Golgi Apparatus" },
      { key: "C", text: "Mitochondria" },
      { key: "D", text: "Lysosomes" },
    ],
    chosen: "B",
    correct: "C",
    timeSpent: "0:42s",
    difficulty: "Hard",
    failRate: "64%",
    wrongPath:
      "You linked ATP to packaging. The Golgi modifies and ships proteins, but it does not generate ATP; it consumes energy.",
    foundation:
      "The mitochondrion is the cell's power plant. It builds a proton gradient and drives ATP synthase to convert ADP to ATP.",
    mnemonic: "Mighty Mitochondria Makes Money (ATP).",
  },
  {
    id: "chem-eq-07",
    subject: "Chemistry",
    topic: "Chemical Equilibrium",
    trail: ["Chemistry", "Chemical Equilibrium", "Question 7 Analysis"],
    prompt:
      "When pressure is increased in the Haber process, the equilibrium shifts toward which side of the reaction?",
    options: [
      { key: "A", text: "Reactants" },
      { key: "B", text: "Products" },
      { key: "C", text: "No shift" },
      { key: "D", text: "Catalyst side" },
    ],
    chosen: "C",
    correct: "B",
    timeSpent: "0:35s",
    difficulty: "Medium",
    failRate: "49%",
    wrongPath:
      "You treated pressure change like temperature change. Pressure favors the side with fewer gas moles in gaseous equilibria.",
    foundation:
      "For N2 + 3H2 <-> 2NH3, products have fewer gas molecules. Increasing pressure pushes equilibrium to ammonia formation.",
    mnemonic: "Pressure prefers the side with fewer particles.",
  },
];

function parseStorage<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function AiReviewPage() {
  const [, setLocation] = useLocation();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [followUp, setFollowUp] = useState("");
  const [savedCount, setSavedCount] = useState(() => Number(localStorage.getItem("smashutme-ai-saved-insights") ?? 0));
  const [customReply, setCustomReply] = useState<string | null>(null);
  const { mutate: explain, isPending } = useExplain();

  const onboardedSubjects = useMemo(() => {
    const data = parseStorage<{ selectedLabels?: string[]; selected?: string[] }>("smashutme-onboarding-subjects");
    if (Array.isArray(data?.selectedLabels) && data.selectedLabels.length > 0) {
      return ["Use of English", ...data.selectedLabels];
    }
    if (Array.isArray(data?.selected) && data.selected.length > 0) {
      return ["Use of English", ...data.selected.map((s) => s.charAt(0).toUpperCase() + s.slice(1))];
    }
    return ["Use of English", "Biology", "Chemistry", "Physics"];
  }, []);

  const current = REVIEW_QUESTIONS[questionIndex % REVIEW_QUESTIONS.length];
  const recommendedSubject = onboardedSubjects.find((s) => s.toLowerCase().includes(current.subject.toLowerCase())) ?? onboardedSubjects[1] ?? current.subject;

  const handleSaveInsight = () => {
    const next = savedCount + 1;
    localStorage.setItem("smashutme-ai-saved-insights", String(next));
    setSavedCount(next);
  };

  const handleAskAi = () => {
    if (!followUp.trim()) return;
    explain(
      {
        text: followUp,
        context: `${current.subject} - ${current.topic} | ${current.prompt}`,
      },
      {
        onSuccess: (data) => {
          setCustomReply(data.explanation);
        },
      },
    );
  };

  return (
    <AppShell searchPlaceholder="Search topics, questions, or AI insights...">
      <main className="pb-12 px-4 md:px-12 min-h-screen">
        <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
          <div className="min-w-0">
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
              {current.trail.map((crumb, index) => (
                <div key={`${crumb}-${index}`} className="flex items-center gap-2">
                  <span className={index === current.trail.length - 1 ? "text-brand-blue" : ""}>{crumb}</span>
                  {index < current.trail.length - 1 ? <ChevronRight className="w-3.5 h-3.5" /> : null}
                </div>
              ))}
            </nav>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">Post-Quiz AI Deep-Dive</h2>
            <p className="text-xs text-slate-500 mt-1">
              Personalized with your selected combination: {onboardedSubjects.join(", ")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <Button variant="outline" onClick={handleSaveInsight} className="font-bold text-sm w-full sm:w-auto">
              <Share2 className="w-4 h-4 mr-2" /> Save Insight ({savedCount})
            </Button>
            <Button
              className="bg-brand-blue text-white hover:bg-brand-blue/90 w-full sm:w-auto"
              onClick={() => {
                setQuestionIndex((prev) => prev + 1);
                setCustomReply(null);
                setFollowUp("");
              }}
            >
              Next Question
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-4 md:p-8 rounded-xl relative overflow-hidden border border-slate-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 flex items-center justify-center rounded-bl-3xl">
                <XCircle className="text-red-600 w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded mb-6">
                Incorrect Attempt
              </div>
              <p className="text-lg font-medium leading-relaxed mb-8">{current.prompt}</p>

              <div className="space-y-3">
                {current.options.map((option) => {
                  const isChosen = option.key === current.chosen;
                  const isCorrect = option.key === current.correct;
                  return (
                    <div
                      key={option.key}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        isChosen
                          ? "border-2 border-red-200 bg-red-50"
                          : isCorrect
                            ? "border-2 border-brand-blue/30 bg-brand-blue/5"
                            : "bg-slate-100"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                          isChosen
                            ? "bg-red-500 text-white"
                            : isCorrect
                              ? "bg-brand-blue text-white"
                              : "bg-white text-slate-600"
                        }`}
                      >
                        {option.key}
                      </span>

                      <div className="flex-1 flex justify-between items-center gap-2">
                        <span
                          className={`text-sm ${
                            isChosen
                              ? "font-semibold text-red-700"
                              : isCorrect
                                ? "font-semibold text-brand-blue"
                                : "text-slate-700"
                          }`}
                        >
                          {option.text}
                        </span>
                        {isChosen ? <XCircle className="text-red-600 w-4 h-4" /> : null}
                        {isCorrect ? <CheckCircle2 className="text-brand-blue w-4 h-4" /> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Timer className="text-slate-500 w-4 h-4" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Time Spent</p>
                  <p className="text-sm font-bold">{current.timeSpent}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-300/60" />
              <div className="flex items-center gap-3">
                <TrendingUp className="text-slate-500 w-4 h-4" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Difficulty</p>
                  <p className="text-sm font-bold">{current.difficulty} ({current.failRate} fail)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-1 bg-white rounded-xl shadow-xl shadow-brand-blue/5 border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-brand-blue/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-brand-blue flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">The First-Principle Breakdown</h3>
                    <p className="text-[10px] font-medium text-brand-blue">Powered by AI Mentor • Anti-Cram Logic</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-brand-blue rounded-full" />
                  <span className="w-1 h-1 bg-brand-blue rounded-full opacity-50" />
                  <span className="w-1 h-1 bg-brand-blue rounded-full opacity-25" />
                </div>
              </div>

              <div className="p-4 md:p-8 flex-1 overflow-y-auto space-y-8">
                <section>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Why your selected answer was wrong
                  </h4>
                  <div className="pl-4 border-l-2 border-red-200">
                    <p className="text-sm leading-relaxed text-slate-600">{current.wrongPath}</p>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                    Foundation Concept
                  </h4>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-600">
                      Think from first principles and ask: what process actually produces the result in this system?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-100 rounded-lg">
                        <p className="text-[10px] font-black text-brand-blue mb-1 uppercase">Subject</p>
                        <p className="text-xs leading-snug">{current.subject}</p>
                      </div>
                      <div className="p-4 bg-brand-blue/10 rounded-lg">
                        <p className="text-[10px] font-black text-brand-blue mb-1 uppercase">Focus Topic</p>
                        <p className="text-xs leading-snug">{current.topic}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{current.foundation}</p>
                  </div>
                </section>

                <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-amber-500 w-4 h-4 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-800 mb-1 uppercase">Clinical Mnemonic</p>
                      <p className="text-sm text-amber-900 font-medium">{current.mnemonic}</p>
                    </div>
                  </div>
                </div>

                {customReply ? (
                  <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Follow-up Response</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{customReply}</p>
                  </div>
                ) : null}
              </div>

              <div className="p-4 md:p-6 bg-slate-100 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-500 mb-3">
                  Still confused? Ask AI Mentor a specific question about {recommendedSubject}.
                </p>
                <div className="relative flex items-center">
                  <Input
                    className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-4 pr-12 text-sm"
                    placeholder="e.g. Explain this concept with another example"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAskAi();
                      }
                    }}
                  />
                  <button
                    onClick={handleAskAi}
                    className="absolute right-2 p-1.5 bg-brand-blue text-white rounded-md disabled:opacity-40"
                    disabled={isPending || !followUp.trim()}
                  >
                    {isPending ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {["Explain like I am 12", "Give 2 likely JAMB traps", "How to remember fast"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setFollowUp(chip);
                        setCustomReply(null);
                      }}
                      className="text-[10px] font-bold text-brand-blue px-2 py-1 bg-brand-blue/5 rounded border border-brand-blue/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 relative flex items-center justify-center text-[10px] font-black">
                  75%
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      className="text-brand-blue"
                      cx="24"
                      cy="24"
                      fill="none"
                      r="20"
                      stroke="currentColor"
                      strokeDasharray="125"
                      strokeDashoffset="30"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-black tracking-tight">{current.topic} Mastery</p>
                  <p className="text-[10px] text-slate-500">2 questions remaining in this sub-topic</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/30 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">JD</div>
                  <div className="w-6 h-6 rounded-full bg-indigo-300 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">AK</div>
                  <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">+12</div>
                </div>
                <p className="text-[10px] font-medium text-slate-500">studying this now</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button
        onClick={() => setLocation("/contact")}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        aria-label="Support"
      >
        <LifeBuoy className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <button
        onClick={() => setQuestionIndex((prev) => prev + 1)}
        className="fixed bottom-4 right-20 md:bottom-8 md:right-28 px-3 md:px-4 h-12 md:h-14 bg-brand-blue text-white rounded-full shadow-xl hover:bg-brand-blue/90 transition-all z-50 flex items-center gap-2 text-xs font-bold"
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </AppShell>
  );
}
