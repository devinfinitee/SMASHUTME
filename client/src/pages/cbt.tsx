import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjects } from "@/hooks/use-subjects";
import { apiFetch } from "@/lib/api-fetch";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  Flag,
  Flame,
  Gauge,
  Lightbulb,
  Target,
  Timer,
  Trophy,
} from "lucide-react";

type CbtStep = 1 | 2 | 3 | 4;
type CbtMode = "drill" | "mock";

type ExamQuestion = {
  id: string;
  subject: string;
  topic: string;
  prompt: string;
  options: Record<string, string>;
  correctOption: string;
  explanation: string;
};

type SubjectScore = {
  subject: string;
  score: number;
};

type QuestionResult = {
  questionId: string;
  isCorrect: boolean;
  selectedOption: string | null;
  correctOption: string;
};

type SessionAnalytics = {
  score: number;
  totalQuestions: number;
  accuracy: number;
  paceSeconds: number;
  percentileLabel: string;
  projectedAggregate: number;
  subjectBreakdown: SubjectScore[];
  questionResults: QuestionResult[];
};

const STEP_LABELS = [
  "CBT Selection Hub",
  "Drill Configurator",
  "CBT Exam Engine",
  "Post-Exam Analytics",
] as const;

const DRILL_QUESTION_COUNTS = [10, 20, 30];
const DRILL_DURATIONS = [10, 20, 30, 45];

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function CbtPage() {
  const { data: subjects, isLoading } = useSubjects();

  const [step, setStep] = useState<CbtStep>(1);
  const [mode, setMode] = useState<CbtMode>("drill");
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>("");
  const [questionCount, setQuestionCount] = useState(20);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [sessionAnalytics, setSessionAnalytics] = useState<SessionAnalytics | null>(null);

  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Record<string, boolean>>({});
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<Record<string, boolean>>({});

  const preferredSubjects = useMemo(() => {
    if (!subjects || subjects.length === 0) return [];
    return subjects.slice(0, 4);
  }, [subjects]);

  const selectedSubject = useMemo(() => {
    return preferredSubjects.find((subject) => subject.slug === selectedSubjectSlug);
  }, [preferredSubjects, selectedSubjectSlug]);

  const currentQuestion = examQuestions[currentQuestionIndex];
  const currentSelectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progress = examQuestions.length > 0 ? ((currentQuestionIndex + 1) / examQuestions.length) * 100 : 0;
  const answeredCount = examQuestions.filter((question) => Boolean(answers[question.id])).length;

  const questionSubjects = useMemo(() => {
    const unique = new Set(examQuestions.map((question) => question.subject));
    return Array.from(unique);
  }, [examQuestions]);

  const correctCount = useMemo(() => {
    return examQuestions.reduce((count, question) => {
      return answers[question.id] === question.correctOption ? count + 1 : count;
    }, 0);
  }, [answers, examQuestions]);

  const accuracy = sessionAnalytics?.accuracy ?? (examQuestions.length > 0 ? Math.round((correctCount / examQuestions.length) * 100) : 0);
  const paceSeconds = sessionAnalytics?.paceSeconds ?? (examQuestions.length > 0 ? Math.max(20, Math.round((durationMinutes * 60) / examQuestions.length)) : 0);
  const percentileLabel = sessionAnalytics?.percentileLabel ?? (accuracy >= 85 ? "Top 3%" : accuracy >= 70 ? "Top 8%" : "Top 20%");
  const projectedAggregate = sessionAnalytics?.projectedAggregate ?? Math.round(220 + (accuracy / 100) * 120);

  const subjectBreakdown = useMemo(() => {
    if (sessionAnalytics?.subjectBreakdown?.length) {
      return sessionAnalytics.subjectBreakdown;
    }

    const grouped = new Map<string, { total: number; correct: number }>();

    examQuestions.forEach((question) => {
      const bucket = grouped.get(question.subject) ?? { total: 0, correct: 0 };
      bucket.total += 1;
      if (answers[question.id] === question.correctOption) {
        bucket.correct += 1;
      }
      grouped.set(question.subject, bucket);
    });

    const result = Array.from(grouped.entries()).map(([subject, stats]) => ({
      subject,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));

    if (result.length > 0) return result;

    return [
      { subject: "Use of English", score: 82 },
      { subject: "Biology", score: 71 },
      { subject: "Chemistry", score: 68 },
      { subject: "Physics", score: 79 },
    ];
  }, [answers, examQuestions, sessionAnalytics]);

  useEffect(() => {
    if (step !== 3 || isSubmittingSession) {
      return undefined;
    }

    if (remainingSeconds <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [step, isSubmittingSession, remainingSeconds]);

  const startDrillConfigurator = () => {
    setEngineError(null);
    setMode("drill");
    setStep(2);
  };

  async function initializeSession(payload: {
    mode: CbtMode;
    questionCount: number;
    durationMinutes: number;
    highYieldOnly: boolean;
    subjectSlug?: string;
    subjectName?: string;
  }) {
    setEngineError(null);
    setIsStartingSession(true);

    try {
      const response = await apiFetch("/api/quiz/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody?.error || "Unable to start CBT session.");
      }

      const questions = Array.isArray(responseBody?.questions)
        ? responseBody.questions.map((question: ExamQuestion) => ({
            id: question.id,
            subject: question.subject,
            topic: question.topic,
            prompt: question.prompt,
            options: question.options,
            correctOption: question.correctOption,
            explanation: question.explanation || "No explanation provided.",
          }))
        : [];

      if (!questions.length) {
        throw new Error("No CBT questions were available for this configuration.");
      }

      setSessionId(responseBody.sessionId || null);
      setMode(payload.mode);
      setQuestionCount(payload.questionCount);
      setDurationMinutes(payload.durationMinutes);
      setHighYieldOnly(payload.highYieldOnly);
      setExamQuestions(questions);
      setAnswers({});
      setFlaggedQuestionIds({});
      setVisitedQuestionIds(questions[0] ? { [questions[0].id]: true } : {});
      setCurrentQuestionIndex(0);
      setSessionAnalytics(null);
      setRemainingSeconds(payload.durationMinutes * 60);
      setStep(3);
    } catch (error) {
      setEngineError(error instanceof Error ? error.message : "Unable to start CBT session.");
    } finally {
      setIsStartingSession(false);
    }
  }

  const startMiniMock = async () => {
    await initializeSession({
      mode: "mock",
      questionCount: 20,
      durationMinutes: 15,
      highYieldOnly: true,
    });
  };

  const launchDrillExam = async () => {
    if (!selectedSubject) {
      setEngineError("Please choose a subject before starting a drill.");
      return;
    }

    await initializeSession({
      mode: "drill",
      questionCount,
      durationMinutes,
      highYieldOnly,
      subjectSlug: selectedSubject.slug,
      subjectName: selectedSubject.name,
    });
  };

  const submitExam = async () => {
    if (!sessionId) {
      setEngineError("No active CBT session was found.");
      return;
    }

    if (isSubmittingSession) {
      return;
    }

    setIsSubmittingSession(true);

    try {
      const response = await apiFetch(`/api/quiz/sessions/${sessionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          flaggedQuestionIds: Object.keys(flaggedQuestionIds).filter((key) => flaggedQuestionIds[key]),
          timeSpentSeconds: Math.max(0, (durationMinutes * 60) - remainingSeconds),
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody?.error || "Unable to submit CBT session.");
      }

      setSessionAnalytics({
        score: responseBody.score || 0,
        totalQuestions: responseBody.totalQuestions || examQuestions.length,
        accuracy: responseBody.accuracy || 0,
        paceSeconds: responseBody.paceSeconds || 0,
        percentileLabel: responseBody.percentileLabel || "Top 20%",
        projectedAggregate: responseBody.projectedAggregate || 220,
        subjectBreakdown: responseBody.subjectBreakdown || [],
        questionResults: responseBody.questionResults || [],
      });
      setStep(4);
    } catch (error) {
      setEngineError(error instanceof Error ? error.message : "Unable to submit CBT session.");
    } finally {
      setIsSubmittingSession(false);
    }
  };

  useEffect(() => {
    if (step === 3 && remainingSeconds === 0 && !isSubmittingSession) {
      void submitExam();
    }
  }, [step, remainingSeconds, isSubmittingSession]);

  const goNext = () => {
    if (!currentQuestion) return;
    if (!currentSelectedOption) return;

    if (currentQuestionIndex < examQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = examQuestions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      if (nextQuestion) {
        setVisitedQuestionIds((prev) => ({ ...prev, [nextQuestion.id]: true }));
      }
      return;
    }

    void submitExam();
  };

  const goPrevious = () => {
    if (currentQuestionIndex <= 0) return;
    const prevIndex = currentQuestionIndex - 1;
    const prevQuestion = examQuestions[prevIndex];
    setCurrentQuestionIndex(prevIndex);
    if (prevQuestion) {
      setVisitedQuestionIds((prev) => ({ ...prev, [prevQuestion.id]: true }));
    }
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = examQuestions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      if (nextQuestion) {
        setVisitedQuestionIds((prev) => ({ ...prev, [nextQuestion.id]: true }));
      }
      return;
    }
    void submitExam();
  };

  const jumpToQuestion = (index: number) => {
    const question = examQuestions[index];
    if (!question) return;
    setCurrentQuestionIndex(index);
    setVisitedQuestionIds((prev) => ({ ...prev, [question.id]: true }));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestionIds((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  const resetFlow = () => {
    setStep(1);
    setMode("drill");
    setSelectedSubjectSlug("");
    setQuestionCount(20);
    setDurationMinutes(20);
    setHighYieldOnly(false);
    setExamQuestions([]);
    setAnswers({});
    setFlaggedQuestionIds({});
    setVisitedQuestionIds({});
    setCurrentQuestionIndex(0);
    setSessionId(null);
    setRemainingSeconds(0);
    setSessionAnalytics(null);
    setEngineError(null);
  };

  if (isLoading) {
    return (
      <AppShell searchPlaceholder="Search drills, subjects, or exam records...">
        <div className="p-6 md:p-12 space-y-6">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell searchPlaceholder="Search drills, subjects, or exam records...">
      <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[#2B0AFA] font-bold text-[10px] tracking-widest uppercase">
            <span className="w-8 h-[2px] bg-[#2B0AFA]" />
            CBT Flow
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">CBT Practice Center</h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Complete the full workflow: selection hub, configurator, exam engine, and post-exam analytics.
              </p>
            </div>
            <div className="inline-flex items-center px-3 py-2 rounded-lg border border-[#2B0AFA]/20 bg-[#2B0AFA]/5 text-xs font-bold text-[#2B0AFA]">
              Step {step} of 4 • {STEP_LABELS[step - 1]}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {STEP_LABELS.map((label, index) => {
              const indexStep = (index + 1) as CbtStep;
              const active = indexStep === step;
              const complete = indexStep < step;
              return (
                <div
                  key={label}
                  className={`rounded-lg px-3 py-2 border text-xs font-bold ${
                    active
                      ? "bg-[#2B0AFA] text-white border-[#2B0AFA]"
                      : complete
                        ? "bg-[#FAB100]/20 text-[#8A5C00] border-[#FAB100]/40"
                        : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
              <div className="group relative bg-white p-8 rounded-xl shadow-[0_4px_32px_rgba(28,0,188,0.04)] border border-transparent hover:border-[#2B0AFA]/20 transition-all duration-300 flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1 h-24 bg-[#2B0AFA]/25 rounded-full my-8 ml-1" />
                <div>
                  <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-8 group-hover:bg-[#2B0AFA] transition-colors duration-300">
                    <Target className="text-[#2B0AFA] w-7 h-7 group-hover:text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Targeted Practice</h2>
                  <p className="text-slate-600 mb-8">Focus on specific subjects and topics to bridge weak points before your exam.</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={startDrillConfigurator}
                    className="w-full bg-[#2B0AFA] text-white hover:bg-[#2408CF]"
                  >
                    Select Subject
                  </Button>
                </div>
              </div>

              <div className="group relative bg-white p-8 rounded-xl shadow-[0_4px_32px_rgba(28,0,188,0.04)] border border-transparent hover:border-[#FAB100]/35 transition-all duration-300 flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1 h-24 bg-[#FAB100]/45 rounded-full my-8 ml-1" />
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-[#FAB100]/15 rounded-lg flex items-center justify-center group-hover:bg-[#FAB100] transition-colors duration-300">
                      <Flame className="text-[#8A5C00] w-7 h-7 group-hover:text-white" />
                    </div>
                    <span className="bg-[#FAB100]/25 text-[#8A5C00] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Daily Challenge
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Mini Mock Test</h2>
                  <p className="text-slate-600 mb-8">A curated set of 20 high-yield questions across your subjects in 15 minutes.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1 px-1">
                    <span>Today Completion Rate</span>
                    <span className="font-bold text-slate-900">64%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#2B0AFA] w-[64%]" />
                  </div>
                  <Button
                    onClick={startMiniMock}
                    disabled={isStartingSession}
                    className="w-full bg-[#2B0AFA] text-white hover:bg-[#2408CF] flex items-center gap-2"
                  >
                    {isStartingSession ? "Preparing Mock..." : "Start Mini Mock"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {engineError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {engineError}
              </div>
            ) : null}

            <section className="mt-8 max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Recent Diagnostic History</h3>
                <button className="text-[#2B0AFA] font-semibold text-sm hover:underline">View All Records</button>
              </div>
              <div className="bg-slate-100 rounded-xl p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                      <th className="pb-4 px-4">Date</th>
                      <th className="pb-4 px-4">Type</th>
                      <th className="pb-4 px-4">Subject Focus</th>
                      <th className="pb-4 px-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="hover:bg-white/70 transition-colors">
                      <td className="py-4 px-4 text-slate-500">Oct 24, 2023</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FAB100]" />
                          Mini Mock
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-medium">Mixed (English, Bio, Chem, Phys)</td>
                      <td className="py-4 px-4 text-right font-bold text-[#2B0AFA]">18/20</td>
                    </tr>
                    <tr className="hover:bg-white/70 transition-colors">
                      <td className="py-4 px-4 text-slate-500">Oct 22, 2023</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#2B0AFA]/50" />
                          Targeted Practice
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-medium">Biology: Genetics and Evolution</td>
                      <td className="py-4 px-4 text-right font-bold text-[#2B0AFA]">85%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}

        {step === 2 ? (
          <section className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#2B0AFA]">Step 2 • Drill Configurator</p>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">Build Your Practice Drill</h2>
                  <p className="text-sm text-slate-600 mt-2">Tune your session settings before entering the exam engine.</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">1. Choose Subject</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {preferredSubjects.map((subject) => {
                      const active = selectedSubjectSlug === subject.slug;
                      const highYieldCount = (subject.topics ?? []).filter((topic) => topic.isHighYield).length;
                      return (
                        <button
                          key={subject.id}
                          onClick={() => setSelectedSubjectSlug(subject.slug)}
                          className={`text-left rounded-xl border p-4 transition-all ${
                            active
                              ? "border-[#2B0AFA] bg-[#2B0AFA]/5 shadow-[0_6px_24px_rgba(43,10,250,0.1)]"
                              : "border-slate-200 hover:border-[#2B0AFA]/40 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-slate-900">{subject.name}</p>
                            {active ? <CheckCircle2 className="w-4 h-4 text-[#2B0AFA]" /> : null}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{subject.topics?.length ?? 0} topics available</p>
                          <p className="text-[11px] font-bold text-[#8A5C00] mt-2">{highYieldCount} high-yield topics</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setQuestionCount(10);
                      setDurationMinutes(10);
                      setHighYieldOnly(false);
                    }}
                    className="rounded-xl border border-slate-200 p-4 text-left bg-slate-50 hover:border-[#2B0AFA]/40 transition-all"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Quick Sprint</p>
                    <p className="text-base font-bold text-slate-900 mt-1">10 Questions • 10 Minutes</p>
                    <p className="text-xs text-slate-600 mt-2">Fast confidence boost before school or class.</p>
                  </button>
                  <button
                    onClick={() => {
                      setQuestionCount(20);
                      setDurationMinutes(20);
                      setHighYieldOnly(true);
                    }}
                    className="rounded-xl border border-[#FAB100]/45 p-4 text-left bg-[#FAB100]/15 hover:border-[#FAB100] transition-all"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-[#8A5C00]">Exam Pressure</p>
                    <p className="text-base font-bold text-slate-900 mt-1">20 Questions • 20 Minutes</p>
                    <p className="text-xs text-slate-600 mt-2">Balanced challenge with high-yield prioritization.</p>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">2. Question Count</p>
                    <div className="grid grid-cols-3 gap-2">
                      {DRILL_QUESTION_COUNTS.map((count) => (
                        <button
                          key={count}
                          onClick={() => setQuestionCount(count)}
                          className={`rounded-lg py-2 text-sm font-bold border ${
                            questionCount === count
                              ? "bg-[#2B0AFA] text-white border-[#2B0AFA]"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">3. Duration (Minutes)</p>
                    <div className="grid grid-cols-4 gap-2">
                      {DRILL_DURATIONS.map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setDurationMinutes(mins)}
                          className={`rounded-lg py-2 text-sm font-bold border ${
                            durationMinutes === mins
                              ? "bg-[#2B0AFA] text-white border-[#2B0AFA]"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {mins}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setHighYieldOnly((prev) => !prev)}
                  className={`w-full rounded-xl border p-4 text-left text-sm font-semibold transition-all ${
                    highYieldOnly
                      ? "bg-[#FAB100]/20 border-[#FAB100]/50 text-[#8A5C00]"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    High-Yield Only: {highYieldOnly ? "ON" : "OFF"}
                  </span>
                </button>
              </div>

              <div className="xl:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Drill Summary</p>
                  <h3 className="text-xl font-black text-slate-900 mt-2">Ready to Launch</h3>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Subject</span>
                      <span className="font-bold text-slate-900">{selectedSubject?.name ?? "Not selected"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Questions</span>
                      <span className="font-bold text-slate-900">{questionCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Time Limit</span>
                      <span className="font-bold text-slate-900">{durationMinutes} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">High-Yield Focus</span>
                      <span className={`font-bold ${highYieldOnly ? "text-[#8A5C00]" : "text-slate-900"}`}>{highYieldOnly ? "Enabled" : "Off"}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Estimated Pace</p>
                    <p className="text-2xl font-black text-[#2B0AFA]">{Math.max(20, Math.round((durationMinutes * 60) / Math.max(1, questionCount)))}s</p>
                    <p className="text-xs text-slate-600">per question</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <Gauge className="w-3.5 h-3.5" />
                      Keep under 45s for top percentile timing.
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back to Hub
                    </Button>
                    <Button
                      onClick={launchDrillExam}
                      disabled={!selectedSubjectSlug || isStartingSession}
                      className="bg-[#2B0AFA] text-white hover:bg-[#2408CF]"
                    >
                      {isStartingSession ? "Preparing Session..." : "Start CBT Exam"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FAB100]/40 bg-[#FAB100]/15 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-[#8A5C00]">Coach Tip</p>
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    Configure one short drill first, then run a second attempt with the same settings to measure real improvement.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-[0_4px_32px_rgba(28,0,188,0.04)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {questionSubjects.map((subject) => {
                    const active = currentQuestion?.subject === subject;
                    return (
                      <button
                        key={subject}
                        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                          active
                            ? "text-[#2B0AFA] border-b-2 border-[#2B0AFA]"
                            : "text-slate-500 hover:text-[#2B0AFA]"
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>

                <div className="inline-flex items-center gap-2 bg-[#EFF4FF] px-4 py-1.5 rounded-full">
                  <Timer className="w-4 h-4 text-[#2B0AFA]" />
                  <span className="font-mono text-base md:text-lg font-black text-[#2B0AFA]">{formatTime(remainingSeconds)}</span>
                </div>

                <Button onClick={submitExam} disabled={isSubmittingSession} className="bg-[#2B0AFA] text-white hover:bg-[#2408CF] w-full lg:w-auto">
                  {isSubmittingSession ? "Submitting..." : "Submit Test"}
                </Button>
              </div>
            </div>

            {engineError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {engineError}
              </div>
            ) : null}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-8 flex flex-col gap-6">
                {currentQuestion ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Question {currentQuestionIndex + 1} of {examQuestions.length}</span>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900">Subject: {currentQuestion.subject}</h2>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={toggleFlag} className={`p-2.5 rounded-md transition-all ${flaggedQuestionIds[currentQuestion.id] ? "bg-[#FAB100]/25 text-[#8A5C00]" : "bg-slate-100 text-[#2B0AFA] hover:bg-slate-200"}`}>
                          <Flag className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-md bg-slate-100 text-[#2B0AFA] hover:bg-slate-200 transition-all">
                          <Lightbulb className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-5 md:p-8 rounded-xl border border-slate-200">
                      <p className="text-lg md:text-xl leading-relaxed text-slate-900 font-medium mb-8 md:mb-10">{currentQuestion.prompt}</p>

                      <div className="flex flex-col gap-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => {
                          const selected = currentSelectedOption === key;
                          return (
                            <button
                              key={key}
                              onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }))}
                              className={`group flex items-center text-left p-4 md:p-5 border-2 rounded-xl transition-all ${
                                selected
                                  ? "bg-white border-[#2B0AFA] shadow-[0_8px_24px_rgba(28,0,188,0.08)]"
                                  : "bg-slate-100 border-transparent hover:border-[#2B0AFA]/20 hover:bg-white"
                              }`}
                            >
                              <div className={`w-9 h-9 flex items-center justify-center rounded-md font-bold mr-4 ${selected ? "bg-[#2B0AFA] text-white" : "bg-white border border-slate-300 text-slate-500 group-hover:bg-[#2B0AFA] group-hover:text-white"}`}>
                                {key}
                              </div>
                              <span className={`text-base md:text-lg ${selected ? "font-bold text-slate-900" : "font-medium text-slate-800"}`}>{value}</span>
                              {selected ? <CheckCircle2 className="w-4 h-4 text-[#2B0AFA] ml-auto" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <Button onClick={goPrevious} variant="outline" disabled={currentQuestionIndex === 0} className="font-bold">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>

                      <div className="flex gap-2 w-full lg:w-auto">
                        <Button onClick={skipQuestion} variant="outline" className="font-bold w-full lg:w-auto">
                          Skip
                        </Button>
                        <Button onClick={goNext} disabled={!currentSelectedOption || isSubmittingSession} className="bg-[#2B0AFA] text-white hover:bg-[#2408CF] font-bold w-full lg:w-auto">
                          {currentQuestionIndex < examQuestions.length - 1 ? "Save & Next" : "Finish Exam"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-500">No active exam questions found.</div>
                )}
              </div>

              <div className="xl:col-span-4">
                <div className="sticky top-24 flex flex-col gap-5 bg-slate-100 p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">Question Map</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2B0AFA]" />
                      <span className="text-xs font-bold text-slate-500">{answeredCount}/{examQuestions.length} Answered</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {examQuestions.map((question, index) => {
                      const active = index === currentQuestionIndex;
                      const answered = Boolean(answers[question.id]);
                      const flagged = Boolean(flaggedQuestionIds[question.id]);
                      const visited = Boolean(visitedQuestionIds[question.id]);

                      let className = "bg-white text-slate-500 border border-slate-300";
                      if (answered) {
                        className = "bg-[#2B0AFA] text-white border border-[#2B0AFA]";
                      }
                      if (flagged && !active) {
                        className = "bg-[#FAB100] text-[#1F1400] border border-[#FAB100]";
                      }
                      if (!visited && !answered && !flagged && !active) {
                        className = "bg-white text-slate-500 border border-slate-300";
                      }

                      return (
                        <button
                          key={question.id}
                          onClick={() => jumpToQuestion(index)}
                          className={`aspect-square flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                            active
                              ? "bg-white border-2 border-[#2B0AFA] text-[#2B0AFA] ring-4 ring-[#2B0AFA]/10"
                              : className
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-300/50 flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="w-3 h-3 rounded-sm bg-[#2B0AFA]" />
                      Answered
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="w-3 h-3 rounded-sm bg-white border border-slate-300" />
                      Not Visited
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="w-3 h-3 rounded-sm bg-[#FAB100]" />
                      Flagged
                    </div>
                  </div>

                  <div className="bg-white/70 p-4 rounded-lg border border-[#2B0AFA]/15">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Brain className="w-4 h-4 text-[#2B0AFA]" />
                      <span className="text-xs font-bold text-[#2B0AFA] uppercase">Quick Tip</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Watch for distractors that sound correct but ignore key qualifiers in the question stem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed left-0 top-1/2 -translate-y-1/2 w-1 h-24 bg-[#2B0AFA] rounded-r-full shadow-lg shadow-[#2B0AFA]/25" />
          </section>
        ) : null}

        {step === 4 ? (
          <section className="space-y-8">
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#2B0AFA] font-medium tracking-wide text-xs uppercase">
                <span className="w-2 h-2 bg-[#2B0AFA] rounded-full animate-pulse" />
                Performance Review
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{mode === "mock" ? "Mini Mock Completed" : "Drill Session Completed"}</h1>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-6 md:p-10 rounded-xl relative overflow-hidden border border-slate-200 shadow-[0_4px_32px_rgba(28,0,188,0.04)]">
                <div className="relative z-10 flex flex-col justify-center h-full">
                  <span className="text-slate-500 font-medium text-xs uppercase tracking-widest mb-2">Overall Proficiency</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl md:text-7xl font-black text-[#2B0AFA] tracking-tighter">{accuracy}%</span>
                    <span className="text-xl md:text-2xl font-bold text-slate-500">Mastery</span>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">Projected Aggregate</p>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">~{projectedAggregate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-sm font-medium">Percentile Rank</p>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{percentileLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#2B0AFA]/5 rounded-full blur-3xl" />
              </div>

              <div className="bg-[#2B0AFA] p-6 md:p-8 rounded-xl flex flex-col justify-between text-white shadow-[0_20px_40px_rgba(28,0,188,0.15)]">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-white/70 text-xs uppercase tracking-widest font-bold">Pacing Metric</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold mt-1 leading-tight">Average Speed: {paceSeconds} Seconds/Question</h2>
                  <p className="mt-4 text-white/80 text-sm leading-relaxed">You are moving with strong exam tempo. Keep balancing speed with option elimination.</p>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Subject Breakdown</h3>
                <span className="text-slate-500 text-sm font-medium">Diagnostic Overview</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-100 p-6 md:p-8 rounded-xl border border-slate-200">
                {Array.from({ length: 2 }).map((_, colIndex) => (
                  <div key={`col-${colIndex}`} className="space-y-6">
                    {subjectBreakdown
                      .filter((_, index) => index % 2 === colIndex)
                      .map((item) => (
                        <div key={item.subject} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold text-slate-900">
                            <span>{item.subject}</span>
                            <span>{item.score}%</span>
                          </div>
                          <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-[#2B0AFA]" style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="bg-white border-l-4 border-[#FAB100] p-6 md:p-8 rounded-r-xl shadow-sm border-y border-r border-slate-200">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#FAB100]/20 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#8A5C00]" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">SmashAI Insight</h4>
                      <p className="text-slate-600 text-base leading-relaxed mt-2">
                        {accuracy >= 80
                          ? "Excellent consistency across this session. Push into harder timed drills and review flagged questions first to protect your score ceiling."
                          : accuracy >= 60
                            ? "Your pace is strong but a few conceptual gaps are reducing your aggregate. Focus on flagged and incorrect questions to gain the fastest score lift."
                            : "You need a fundamentals reset in your weakest topics. Run shorter drills and prioritize explanation review before your next full mock."}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <Button className="bg-[#2B0AFA] text-white hover:bg-[#2408CF] font-bold">
                        Review Explanations
                      </Button>
                      <Button variant="outline" className="font-bold text-[#2B0AFA] border-[#2B0AFA]/30 hover:bg-[#2B0AFA]/5">
                        Download Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Question Review Snapshot</h3>
              <div className="space-y-2">
                {examQuestions.slice(0, 8).map((question, index) => {
                  const serverResult = sessionAnalytics?.questionResults.find((item) => item.questionId === question.id);
                  const isCorrect = serverResult ? serverResult.isCorrect : answers[question.id] === question.correctOption;
                  return (
                    <div key={question.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-slate-600">Q{index + 1} • {question.subject}</p>
                        <p className="text-sm text-slate-800 truncate">{question.topic}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCorrect ? "bg-[#2B0AFA]/10 text-[#2B0AFA]" : "bg-red-100 text-red-600"}`}>
                        {isCorrect ? "Correct" : "Wrong"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button variant="outline" onClick={resetFlow}>Return to CBT Hub</Button>
              <Button className="bg-[#2B0AFA] text-white hover:bg-[#2408CF]" onClick={() => setStep(1)}>
                Start Another Session
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
