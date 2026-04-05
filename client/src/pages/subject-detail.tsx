import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { useSubject } from "@/hooks/use-subjects";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Flame,
  Lightbulb,
  CircleHelp,
} from "lucide-react";

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`;
}

function getTopicProgress(index: number, isHighYield: boolean) {
  if (isHighYield) {
    const values = [72, 0, 45, 31, 64, 12, 85];
    return values[index % values.length];
  }

  const values = [100, 78, 56, 43, 88, 67, 52];
  return values[index % values.length];
}

export default function SubjectDetail() {
  const [, params] = useRoute("/subjects/:slug");
  const { data: subject, isLoading } = useSubject(params?.slug || "");
  const [showHighYieldOnly, setShowHighYieldOnly] = useState(false);

  const topicRows = useMemo(() => {
    if (!subject?.topics) return [];

    const base = showHighYieldOnly
      ? subject.topics.filter((topic) => topic.isHighYield)
      : subject.topics;

    return base.map((topic, index) => {
      const progress = getTopicProgress(index, topic.isHighYield);
      const masteryState =
        progress === 100
          ? "Mastered"
          : progress === 0
            ? "Not Started"
            : progress >= 60
              ? "Mastery Imminent"
              : "Reading";

      return {
        topic,
        progress,
        masteryState,
      };
    });
  }, [subject?.topics, showHighYieldOnly]);

  if (isLoading) {
    return (
      <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
        <div className="p-6 md:p-12 space-y-5">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-[480px] w-full rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (!subject) {
    return (
      <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
        <div className="p-6 md:p-12">
          <p className="text-slate-600">Subject not found.</p>
        </div>
      </AppShell>
    );
  }

  const subjectTopics = subject.topics ?? [];
  const totalTopics = subjectTopics.length;
  const highYieldTopics = subjectTopics.filter((topic) => topic.isHighYield);
  const masteredCount = topicRows.filter((row) => row.progress >= 80).length;
  const totalProgress = totalTopics === 0 ? 0 : Math.round((masteredCount / totalTopics) * 100);
  const avgQuiz = Math.min(95, 64 + Math.round(totalProgress / 3));

  return (
    <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
      <div className="relative p-6 md:p-12 max-w-7xl mx-auto">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-blue/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              <span>Subjects</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#2B0AFA]">{subject.name}</span>
            </nav>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{subject.name}</h2>
            <p className="text-slate-600 mt-2 flex flex-wrap items-center gap-2 font-medium text-sm">
              <span className="w-2 h-2 rounded-full bg-[#2B0AFA] animate-pulse"></span>
              {masteredCount} of {totalTopics} Topics Mastered
              <span className="text-slate-300">•</span>
              <span className="text-[#FAB100] font-bold">{totalProgress}% Total Progress</span>
            </p>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/70 bg-white/80 p-1.5 shadow-sm backdrop-blur md:w-auto flex flex-col sm:flex-row gap-1">
            <button
              onClick={() => setShowHighYieldOnly(false)}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all text-left sm:text-center ${
                !showHighYieldOnly ? "bg-white shadow-sm text-brand-blue border border-brand-blue/20" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              View All Topics
            </button>
            <button
              onClick={() => setShowHighYieldOnly(true)}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 text-left sm:text-center ${
                showHighYieldOnly ? "bg-white shadow-sm text-[#8A5C00] border border-[#FAB100]/35" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Flame className="w-4 h-4" />
              High-Yield Only (80/20)
            </button>
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] backdrop-blur">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.05em] mb-1">Time to Mastery</p>
            <p className="text-2xl font-black text-slate-900">{Math.max(6, totalTopics * 1.8).toFixed(1)} hrs</p>
            <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#2B0AFA]" style={{ width: formatPercent(totalProgress) }}></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] backdrop-blur">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.05em] mb-1">Avg. Quiz Score</p>
            <p className="text-2xl font-black text-slate-900">{avgQuiz}%</p>
            <p className="text-[10px] text-[#FAB100] font-bold mt-2 uppercase tracking-tighter">+5% from last week</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_rgba(11,28,48,0.05)] backdrop-blur">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.05em] mb-1">High-Yield Coverage</p>
            <p className="text-2xl font-black text-slate-900">
              {topicRows.filter((row) => row.topic.isHighYield && row.progress >= 60).length}/{highYieldTopics.length}
            </p>
            <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-tighter">
              {Math.max(0, highYieldTopics.length - topicRows.filter((row) => row.topic.isHighYield && row.progress >= 60).length)} priority remaining
            </p>
          </div>
          <div className="rounded-2xl border border-[#FAB100]/50 bg-gradient-to-br from-[#2B0AFA] to-[#2408CF] p-6 shadow-lg shadow-[#2B0AFA]/20">
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.05em] mb-1">Upcoming Exam</p>
            <p className="text-2xl font-black text-white">UTME 2024</p>
            <p className="text-[10px] text-white font-bold mt-2 uppercase tracking-tighter">42 Days to go</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] backdrop-blur">
          <div className="hidden md:grid grid-cols-12 px-8 py-5 border-b border-slate-100 bg-slate-50/70">
            <div className="col-span-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Topic Subject</div>
            <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weightage</div>
            <div className="col-span-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mastery Status</div>
            <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</div>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {topicRows.map((row, index) => (
              <div key={`mobile-${row.topic.id}`} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-1 h-10 rounded-full ${row.topic.isHighYield ? "bg-[#FAB100]" : "bg-[#2B0AFA]"}`}></div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm">{row.topic.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {row.topic.summary || "High impact concept for JAMB preparation."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${
                    row.topic.isHighYield
                      ? "bg-[#FAB100]/20 text-[#8A5C00] border-[#FAB100]/40"
                      : "bg-[#2B0AFA]/10 text-[#2B0AFA] border-[#2B0AFA]/20"
                  }`}>
                    {row.topic.isHighYield ? `High-Yield (${80 + (index % 15)}%)` : "Foundational"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border bg-slate-100 text-slate-600 border-slate-200">
                    {row.masteryState}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>Mastery</span>
                    <span>{row.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2B0AFA]" style={{ width: formatPercent(row.progress) }}></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/topics/${row.topic.slug}`}>
                    <button className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-all text-xs font-bold">
                      Read Concept
                    </button>
                  </Link>
                  <Link href={`/topics/${row.topic.slug}/quiz`}>
                    <button className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[#FAB100]/20 text-[#8A5C00] hover:bg-[#FAB100] hover:text-[#1F1400] transition-all text-xs font-bold">
                      Take Quiz
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block divide-y divide-slate-100">
            {topicRows.map((row, index) => (
              <div key={row.topic.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors group">
                <div className="col-span-5 flex items-start gap-4">
                  <div className={`w-1 h-12 rounded-full ${row.topic.isHighYield ? "bg-[#FAB100]" : "bg-[#2B0AFA]"}`}></div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-[#2B0AFA] transition-colors">{row.topic.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {row.topic.summary || "High impact concept for JAMB preparation."}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${
                    row.topic.isHighYield
                      ? "bg-[#FAB100]/20 text-[#8A5C00] border-[#FAB100]/40"
                      : "bg-[#2B0AFA]/10 text-[#2B0AFA] border-[#2B0AFA]/20"
                  }`}>
                    {row.topic.isHighYield ? `High-Yield (${80 + (index % 15)}%)` : "Foundational"}
                  </span>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2B0AFA]" style={{ width: formatPercent(row.progress) }}></div>
                    </div>
                    {row.progress >= 100 ? (
                      <CheckCircle2 className="text-[#2B0AFA] w-4 h-4" />
                    ) : (
                      <span className="text-xs font-black text-slate-800">{row.progress}%</span>
                    )}
                  </div>
                  <p className={`text-[9px] font-bold uppercase mt-1 ${
                    row.progress >= 100 ? "text-[#2B0AFA]" : row.progress === 0 ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {row.masteryState}
                  </p>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <Link href={`/topics/${row.topic.slug}`}>
                    <button className="p-2.5 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-all" title="Read Concept">
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href={`/topics/${row.topic.slug}/quiz`}>
                    <button className="p-2.5 rounded-lg bg-[#FAB100]/20 text-[#8A5C00] hover:bg-[#FAB100] hover:text-[#1F1400] transition-all" title="Take Quiz">
                      <CircleHelp className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 md:p-6 bg-slate-50/70 text-center">
            <button className="text-xs font-bold text-[#2B0AFA] hover:underline uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
              View More High-Yield Topics
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 bg-white relative overflow-hidden rounded-3xl p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-[#2B0AFA]/15">
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2">Feeling Overwhelmed?</h3>
              <p className="text-slate-600 text-sm max-w-md leading-relaxed mb-6">
                Our algorithm suggests focusing on <span className="font-bold text-slate-900">{highYieldTopics[0]?.name || "high-yield topics"}</span> today. It accounts for a large share of recurring JAMB questions.
              </p>
              <Button className="w-full md:w-auto bg-[#2B0AFA] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#2408CF]">
                Enter Study Flow State
              </Button>
            </div>
            <div className="w-64 h-64 bg-[#2B0AFA]/8 rounded-full blur-3xl absolute -right-20 -bottom-20"></div>
            <div className="w-32 h-32 bg-[#FAB100]/25 rounded-full blur-2xl absolute right-10 top-0"></div>
          </div>

          <div className="xl:col-span-4 bg-amber-50 border border-amber-200/40 rounded-3xl p-8">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-6">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-black text-slate-900 mb-2">Did you know?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Most students skip <span className="font-bold">{highYieldTopics[1]?.name || "a key high-yield topic"}</span>, but it can be an easy win for top scorers.
            </p>
            <button className="mt-4 text-xs font-bold text-amber-500 uppercase tracking-widest hover:underline inline-flex items-center gap-1">
              Explore Topic <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
