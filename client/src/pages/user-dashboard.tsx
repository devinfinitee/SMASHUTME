import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  BookOpen,
  Calculator,
  Zap,
  Beaker,
  TrendingUp,
  Target,
  Flame,
  Award,
  Brain,
  Send,
  Play,
  BarChart3,
  Clock,
  Lightbulb,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-fetch";
import { useAuth } from "@/hooks/use-auth";
import type { DashboardOverview, DashboardRecentActivity, DashboardSubjectCard } from "@/types";

interface SubjectCardView {
  id: string;
  name: string;
  slug?: string;
  icon: typeof BookOpen;
  proficiency: number;
  status: "compulsory" | "mastered" | "weak" | "on-track";
  color: string;
  bgColor: string;
}

const FALLBACK_ACTIVITY_ICON = {
  drill: BookOpen,
  mock: Lightbulb,
};

const CARD_COLORS = [
  { color: "text-brand-blue", bgColor: "bg-brand-blue/10" },
  { color: "text-purple-600", bgColor: "bg-purple-600/10" },
  { color: "text-red-600", bgColor: "bg-red-600/10" },
  { color: "text-amber-600", bgColor: "bg-amber-600/10" },
];

function iconForSubject(subjectName: string): typeof BookOpen {
  const normalized = subjectName.toLowerCase();
  if (normalized.includes("math")) return Calculator;
  if (normalized.includes("physics")) return Zap;
  if (normalized.includes("chem")) return Beaker;
  if (normalized.includes("econom")) return TrendingUp;
  if (normalized.includes("government") || normalized.includes("history") || normalized.includes("civic")) return Target;
  if (normalized.includes("commerce") || normalized.includes("account")) return BarChart3;
  if (normalized.includes("agric")) return Flame;
  return BookOpen;
}

function buildFallbackSubjectCards(subjects: string[]): SubjectCardView[] {
  return subjects.slice(0, 4).map((subject, index) => ({
    id: subject.toLowerCase(),
    name: subject,
    slug: undefined,
    icon: iconForSubject(subject),
    proficiency: 0,
    status: index === 0 ? "compulsory" : "on-track",
    color: CARD_COLORS[index % CARD_COLORS.length].color,
    bgColor: CARD_COLORS[index % CARD_COLORS.length].bgColor,
  }));
}

function buildDashboardSubjectCards(cards?: DashboardSubjectCard[]): SubjectCardView[] {
  if (!Array.isArray(cards) || cards.length === 0) {
    return [];
  }

  return cards.slice(0, 4).map((card, index) => ({
    id: card.id,
    name: card.name,
    slug: card.slug,
    icon: iconForSubject(card.name),
    proficiency: Number(card.proficiency) || 0,
    status: card.status,
    color: card.color || CARD_COLORS[index % CARD_COLORS.length].color,
    bgColor: card.bgColor || CARD_COLORS[index % CARD_COLORS.length].bgColor,
  }));
}

function buildActivityIcon(activity: DashboardRecentActivity) {
  return activity.iconKey ? FALLBACK_ACTIVITY_ICON[activity.iconKey] : BookOpen;
}

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#dashboard-gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="dashboard-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#2B0AFA" />
            <stop offset="100%" stopColor="#1c00bc" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">{safePercentage}%</span>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Covered</span>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }: { activity: DashboardRecentActivity }) => {
  const ActivityIcon = buildActivityIcon(activity);

  return (
    <div className="p-3 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center text-brand-blue flex-shrink-0">
        <ActivityIcon className="w-4 md:w-5 h-4 md:h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
          {activity.type === "drill" ? "Drill" : "Mock Exam"}
        </p>
        <h5 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">{activity.title}</h5>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">{activity.description}</p>
      </div>
      <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 text-xs md:text-sm flex-shrink-0">{activity.actionLabel}</Button>
    </div>
  );
};

export default function UserDashboardPage() {
  const { user, isAuthenticated, isLoading, refetchUser } = useAuth();
  const [, setLocation] = useLocation();

  const dashboardQuery = useQuery<DashboardOverview | null>({
    queryKey: ["/dashboard/overview", user?.id],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const response = await apiFetch("/api/dashboard/overview", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      return payload?.data || null;
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      void refetchUser();
    }
  }, [isAuthenticated, refetchUser]);

  useEffect(() => {
    if (isAuthenticated && user?.role && ["admin", "super-admin"].includes(user.role)) {
      setLocation("/admin/dashboard");
      return;
    }

    if (isAuthenticated && user && user.onboardingCompleted === false) {
      setLocation("/onboarding/target");
    }
  }, [isAuthenticated, setLocation, user]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin">
          <Flame className="w-8 h-8 text-brand-blue" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Please log in</div>;
  }

  if (user?.onboardingCompleted === false) {
    return null;
  }

  const dashboard = dashboardQuery.data?.dashboard || user?.dashboard || null;
  const profile = dashboardQuery.data?.profile || null;
  const targetInstitution = profile?.targetInstitution || user?.targetInstitution || "University of Ibadan";
  const targetCourse = profile?.targetCourse || user?.targetCourse || "Medicine and Surgery";
  const studyMomentum = dashboard?.studyMomentumPercent ?? 0;
  const highYieldTopicsCount = dashboard?.highYieldTopicsCount ?? 0;
  const projectedScore = dashboard?.projectedScore ?? 0;
  const percentile = dashboard?.percentile ?? 0;
  const streakDays = dashboard?.streakDays ?? 0;
  const totalDrillsCompleted = dashboard?.totalDrillsCompleted ?? 0;
  const totalTimeSpentMinutes = dashboard?.totalTimeSpentMinutes ?? 0;
  const averageAccuracy = dashboard?.averageAccuracy ?? 0;
  const weakAreas = dashboard?.weakAreas || [];
  const subjectCards = dashboardQuery.data?.subjectCards?.length
    ? buildDashboardSubjectCards(dashboardQuery.data.subjectCards)
    : buildFallbackSubjectCards(user?.selectedSubjectLabels && user.selectedSubjectLabels.length > 0 ? ["Use of English", ...user.selectedSubjectLabels] : ["Use of English", "Mathematics", "Physics", "Chemistry"]);
  const recentActivities = dashboardQuery.data?.recentActivities || [];
  const nextExamLabel = "UTME";
  const weakestSubject = [...subjectCards].sort((left, right) => left.proficiency - right.proficiency)[0] || null;
  const progressTargetHref = weakestSubject?.slug ? `/subjects/${weakestSubject.slug}` : "/syllabus";

  return (
    <AppShell searchPlaceholder="Search dashboard insights...">
      <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl dark:bg-slate-800/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Study momentum</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{studyMomentum}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Projected score coverage this week.</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">High-yield focus</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{highYieldTopicsCount} topics</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ready for revision first.</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Next exam</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{nextExamLabel}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.studyTime || user?.studyTime || "1-2"} study window.</p>
            </div>
          </section>

          <section className="grid grid-cols-12 gap-4 md:gap-8 items-start">
            <div className="col-span-12 lg:col-span-7 space-y-4 md:space-y-6">
              <header>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex flex-wrap gap-2 items-start">
                    <span className="px-2 py-1 bg-brand-gold/20 text-amber-700 dark:text-amber-300 text-xs font-bold rounded tracking-widest uppercase">JAMB</span>
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold text-xs md:text-sm bg-brand-gold/10 px-2 py-1 rounded-full">
                      <Flame className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Day {Math.max(streakDays, 0)} Streak</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {user?.name || profile?.name || "Scholar"}
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-md">
                  Your projected score is currently {percentile > 0 ? `in the top ${Math.max(1, 100 - percentile)}%` : "starting from zero"} for {targetCourse} candidates.
                  Focus on your weakest subject to improve quickly.
                </p>
              </header>

              <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-white to-slate-50 p-4 md:p-8 shadow-[0_20px_60px_rgba(11,28,48,0.08)] dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                <div className="absolute top-0 right-0 h-48 w-48 -mr-16 -mt-16 rounded-full bg-brand-blue/10 blur-3xl md:h-64 md:w-64" />
                <div className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="w-32 md:w-40 flex-shrink-0">
                    <CircularProgress percentage={studyMomentum} />
                  </div>

                  <div className="flex-1 space-y-4 md:space-y-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">JAMB Score Projection</h3>
                      <div className="text-3xl md:text-4xl font-bold text-brand-blue mt-2">{projectedScore || 0} / 400</div>

                      <div className="mt-3 md:mt-4 rounded-2xl border border-brand-blue/15 bg-brand-blue/5 p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-brand-blue">AI Strategy:</span> Average accuracy is {averageAccuracy}%.
                          {weakAreas.length > 0 ? ` Focus on ${weakAreas[0]} first.` : " Keep drilling the subjects you selected during onboarding."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 md:gap-4 flex-wrap">
                      <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 text-sm" onClick={() => setLocation("/cbt")}>Full Mock</Button>
                      <Button variant="outline" className="text-sm" onClick={() => setLocation(progressTargetHref)}>View Progress</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 md:gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold via-brand-gold to-amber-500 p-4 md:p-6 text-slate-900 shadow-lg dark:text-white">
                <div className="absolute -right-4 -bottom-4 opacity-15">
                  <Award className="w-20 md:w-24 h-20 md:h-24 text-slate-900" />
                </div>
                <div className="relative z-10 flex items-start gap-3 md:gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 md:w-6 h-5 md:h-6 text-white font-bold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">Target</p>
                    <p className="font-bold text-base md:text-lg leading-tight text-slate-900 dark:text-white truncate">{targetInstitution}</p>
                    <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-semibold">{targetCourse}</p>
                  </div>
                </div>
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-400/30 flex justify-between items-center gap-2">
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">Study Time: {profile?.studyTime || user?.studyTime || "1-2"}</span>
                  <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-md shadow-md">HIGHLY COMP.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 md:p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">Drills</p>
                  <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{totalDrillsCompleted}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 md:mt-2">Completed</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 md:p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">Time</p>
                  <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{Math.max(0, Math.round(totalTimeSpentMinutes / 60))}h</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-1 md:mt-2">{averageAccuracy}% avg</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Subjects</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">Aligned with your selected subjects.</p>
              </div>
              <Button variant="ghost" className="text-brand-blue font-bold text-xs md:text-sm" onClick={() => setLocation(progressTargetHref)}>
                View Progress →
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
              {subjectCards.map((subject) => (
                <div key={subject.id} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:p-6">
                  <div className="flex justify-between items-start mb-3 md:mb-6">
                    <div className={`p-2 md:p-3 ${subject.bgColor} ${subject.color} rounded-lg`}>
                      <subject.icon className="w-4 md:w-5 h-4 md:h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 md:py-1 rounded uppercase ${subject.status === "compulsory" ? "bg-brand-blue/10 text-brand-blue" : subject.status === "mastered" ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" : subject.status === "weak" ? "bg-red-100/50 dark:bg-red-950/30 text-red-700 dark:text-red-400" : "bg-brand-gold/20 text-amber-700 dark:text-amber-300"}`}>
                      {subject.status === "compulsory" ? "Compulsory" : subject.status === "mastered" ? "Mastered" : subject.status === "weak" ? "Weak Area" : "On Track"}
                    </span>
                  </div>

                  <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-3 md:mb-4">{subject.name}</h4>

                  <div className="space-y-2 mb-3 md:mb-6 flex-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                      <span>Level</span>
                      <span>{subject.proficiency}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-blue to-brand-blue/70 transition-all" style={{ width: `${subject.proficiency}%` }} />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-xs md:text-sm"
                    onClick={() => setLocation(subject.slug ? `/subjects/${subject.slug}` : progressTargetHref)}
                  >
                    {subject.status === "weak" ? `Focus: ${subject.name}` : subject.status === "compulsory" ? `Focus: ${subject.name}` : subject.status === "mastered" ? "Mastery maintained" : "Continue revision"}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-12 gap-4 md:gap-8 pb-20 md:pb-0">
            <div className="col-span-12 lg:col-span-8 space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/90">
                {(recentActivities.length > 0 ? recentActivities : [
                  { id: "empty-1", type: "drill", title: "No activity yet", description: "Start a drill or mock exam to populate your dashboard.", actionLabel: "Start", iconKey: "drill" },
                ]).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            <div className="relative col-span-12 lg:col-span-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue to-blue-700 p-4 text-white shadow-[0_18px_48px_rgba(28,0,188,0.28)] md:p-8 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Brain className="w-24 md:w-32 h-24 md:h-32" />
              </div>

              <div className="relative z-10">
                <h4 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 leading-tight">JAMB AI</h4>
                <p className="text-brand-blue/80 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">Ask about syllabus or CAPS status.</p>

                <div className="space-y-2 mb-6">
                  <div className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded border border-white/10 cursor-pointer transition-all">
                    <p className="text-xs font-bold text-white/60 uppercase mb-1">Question</p>
                    <p className="text-xs md:text-sm line-clamp-1">Best strategy for {targetCourse}?</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 rounded-2xl bg-white p-2 text-brand-blue shadow-lg shadow-black/10">
                  <Input placeholder="Ask..." className="bg-transparent border-none text-xs focus-visible:ring-0 placeholder:text-brand-blue/40 px-1" />
                  <button className="bg-brand-blue text-white p-1.5 rounded hover:bg-brand-blue/90 transition-colors flex-shrink-0">
                    <Send className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <button className="fixed bottom-6 right-6 md:bottom-10 md:right-10 h-14 w-14 rounded-full bg-brand-blue text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-brand-blue/90 z-30">
          <Play className="w-5 h-5" />
        </button>
      </main>
    </AppShell>
  );
}
