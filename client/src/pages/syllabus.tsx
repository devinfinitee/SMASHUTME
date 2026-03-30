import { useMemo } from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/app-shell";
import { useSubjects } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Flame, Lightbulb, Settings, Zap } from "lucide-react";

type StoredSubjects = {
  selectedLabels?: string[];
  selected?: string[];
};

function parseStorage<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeSubjectLabel(input: string): string {
  const lowered = input.toLowerCase();
  if (lowered === "english") return "use of english";
  return lowered;
}

function getSubjectStats(slug: string) {
  const statsBySlug: Record<string, { mastery: number; highYieldCount: number }> = {
    "use-of-english": { mastery: 72, highYieldCount: 12 },
    chemistry: { mastery: 45, highYieldCount: 12 },
    physics: { mastery: 0, highYieldCount: 10 },
    biology: { mastery: 18, highYieldCount: 11 },
    mathematics: { mastery: 36, highYieldCount: 14 },
    economics: { mastery: 23, highYieldCount: 9 },
    government: { mastery: 29, highYieldCount: 8 },
    "literature-in-english": { mastery: 31, highYieldCount: 7 },
  };

  return statsBySlug[slug] ?? { mastery: 20, highYieldCount: 8 };
}

function getSubjectIcon(slug: string) {
  if (slug.includes("english") || slug.includes("literature")) return BookOpen;
  if (slug.includes("physics")) return Zap;
  return BookOpen;
}

export default function SyllabusPage() {
  const { data: subjects, isLoading } = useSubjects();

  const preferredSubjects = useMemo(() => {
    const storage = parseStorage<StoredSubjects>("smashutme-onboarding-subjects");
    const labels = storage?.selectedLabels;

    if (Array.isArray(labels) && labels.length > 0) {
      return ["Use of English", ...labels];
    }

    const selected = storage?.selected;
    if (Array.isArray(selected) && selected.length > 0) {
      return [
        "Use of English",
        ...selected.map((value) => value.charAt(0).toUpperCase() + value.slice(1)),
      ];
    }

    return ["Use of English", "Chemistry", "Physics", "Biology"];
  }, []);

  const selectedSubjects = useMemo(() => {
    if (!subjects || subjects.length === 0) return [];

    const matched = preferredSubjects
      .map((label) =>
        subjects.find(
          (subject) => normalizeSubjectLabel(subject.name) === normalizeSubjectLabel(label),
        ),
      )
      .filter((subject): subject is NonNullable<typeof subject> => Boolean(subject));

    if (matched.length > 0) return matched;
    return subjects.slice(0, 4);
  }, [preferredSubjects, subjects]);

  if (isLoading) {
    return (
      <AppShell searchPlaceholder="Search subjects, topics, or formulas...">
        <div className="p-6 md:p-12 space-y-6">
          <Skeleton className="h-12 w-80" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-60 rounded-xl" />
            <Skeleton className="h-60 rounded-xl" />
            <Skeleton className="h-60 rounded-xl" />
            <Skeleton className="h-60 rounded-xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell searchPlaceholder="Search subjects, topics, or formulas...">
      <div className="p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Your UTME Blueprint</h1>
            <p className="text-slate-600 font-medium">Focus strictly on the syllabus for your selected subject combination.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B0AFA]/10 border border-[#2B0AFA]/25">
                <span className="w-2 h-2 rounded-full bg-[#2B0AFA]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2B0AFA]">Primary Focus</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAB100]/20 border border-[#FAB100]/45">
                <span className="w-2 h-2 rounded-full bg-[#FAB100]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5C00]">Secondary Support</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold border-[#2B0AFA]/30 text-[#2B0AFA] hover:bg-[#2B0AFA]/10 hover:text-[#2B0AFA]">
            <Settings className="w-4 h-4" />
            Edit Subject Combination
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedSubjects.map((subject, index) => {
              const stats = getSubjectStats(subject.slug);
              const Icon = getSubjectIcon(subject.slug);
              const isCompulsory = subject.slug === "use-of-english";

              return (
                <Link key={subject.id} href={`/subjects/${subject.slug}`}>
                  <div className="group relative flex flex-col bg-white rounded-xl shadow-[0_4px_32px_rgba(28,0,188,0.04)] overflow-hidden cursor-pointer hover:translate-y-[-4px] transition-all duration-300 border border-slate-100">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[#2B0AFA]/10 rounded-lg text-[#2B0AFA]">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                          isCompulsory
                            ? "bg-[#2B0AFA]/10 text-[#2B0AFA]"
                            : "bg-[#FAB100]/20 text-[#8A5C00]"
                        }`}>
                          {isCompulsory ? "Compulsory" : "Selected"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-4">{subject.name}</h3>

                      <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>SYLLABUS MASTERY</span>
                          <span>{stats.mastery}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2B0AFA] transition-all duration-500" style={{ width: `${stats.mastery}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto bg-brand-gold/10 py-3 px-6 border-t border-brand-gold/10">
                      <p className="text-[11px] font-bold text-amber-800 flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5" /> {stats.highYieldCount} High-Yield topics waiting.
                      </p>
                    </div>

                    <div className="absolute inset-y-0 left-0 w-1 bg-[#2B0AFA] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#FAB100]/35">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2B0AFA]" />
                Recommended Next Steps
              </h4>

              <div className="space-y-6">
                <div className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-gold">
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    You have not started <span className="font-bold text-slate-900">Physics</span> yet. Take a 10-question baseline quiz to identify your focus areas.
                  </p>
                  <Button className="w-full bg-[#2B0AFA] text-white hover:bg-[#2408CF] text-sm font-bold flex items-center justify-center gap-2">
                    Start Quiz <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="pt-6 border-t border-slate-300">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Performance</p>
                  <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-[#FAB100]/40">
                    <div className="text-2xl font-black text-[#2B0AFA]">84%</div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Grammar and Lexis</p>
                      <p className="text-slate-500">24 questions completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#2B0AFA] rounded-xl p-8 text-white border border-[#FAB100]/50">
              <div className="relative z-10">
                <h5 className="text-2xl font-black mb-2 italic tracking-tight">THE 2024 SMASH CHALLENGE</h5>
                <p className="text-sm opacity-80 mb-6">Master all 4 subjects before March 15 to unlock the Premium Mock Simulator.</p>
                <div className="flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-3 py-1.5 w-fit">
                  <Lightbulb className="w-4 h-4 text-[#FAB100]" />
                  <span className="text-xs font-bold">14,202 students studying now</span>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <BookOpen className="w-28 h-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
