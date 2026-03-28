import { useState } from "react";
import type { User } from "@/types";
import {
  BookOpen,
  Calculator,
  Zap,
  Beaker,
  TrendingUp,
  Target,
  Clock,
  Flame,
  Award,
  Settings,
  LogOut,
  Search,
  Bell,
  Lightbulb,
  Send,
  Play,
  BarChart3,
  Users,
  Brain,
  Menu,
  X,
} from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

interface SubjectCard {
  id: string;
  name: string;
  icon: typeof BookOpen;
  proficiency: number;
  status: "compulsory" | "mastered" | "weak" | "on-track";
  color: string;
  bgColor: string;
}

const SUBJECTS: SubjectCard[] = [
  {
    id: "english",
    name: "Use of English",
    icon: BookOpen,
    proficiency: 81,
    status: "compulsory",
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    proficiency: 94,
    status: "mastered",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
  {
    id: "physics",
    name: "Physics",
    icon: Zap,
    proficiency: 62,
    status: "weak",
    color: "text-red-600",
    bgColor: "bg-red-600/10",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: Beaker,
    proficiency: 78,
    status: "on-track",
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
  },
];

const RECENT_ACTIVITIES = [
  {
    id: "1",
    type: "drill",
    title: "Equilibrium Systems (Physics)",
    description: "Focused on 2018-2023 Past Questions • 14/20 correct",
    icon: BookOpen,
    actionLabel: "Resume",
  },
  {
    id: "2",
    type: "mock",
    title: "SmashUTME Standard Mock #04",
    description: "Completed yesterday • Score: 312/400 • Ranked #42",
    icon: Lightbulb,
    actionLabel: "Review Errors",
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: TrendingUp, active: true },
    { label: "Syllabus", icon: BookOpen, active: false },
    { label: "CBT Practice", icon: BarChart3, active: false },
    { label: "AI Review", icon: Brain, active: false },
    { label: "Performance", icon: TrendingUp, active: false },
    { label: "Study Room", icon: Users, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-brand-blue text-white p-2 rounded-lg"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-900 flex flex-col py-8 px-4 z-40 transition-transform md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 px-4">
          <div className="flex items-center mb-2 overflow-hidden">
            <img src={smashutmeLogo} alt="SmashUTME" className="h-28 w-28 object-cover object-center scale-[2] mx-12 -my-10" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Personalised Dashboard
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                item.active
                  ? "text-brand-blue dark:text-brand-blue bg-white dark:bg-white/5 border-r-4 border-brand-blue"
                  : "text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button className="w-full bg-brand-blue text-white hover:bg-brand-blue/90">
            Start Mock Exam
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                ID: 2024/JAMB/081
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const TopNavBar = () => {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center px-4 md:px-8 gap-4">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            className="w-full bg-slate-100 dark:bg-slate-800 border-none pl-10 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-brand-blue/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative">
          <Flame className="w-5 h-5 text-brand-gold" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
        </button>

        <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
          <Target className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#2B0AFA" />
            <stop offset="100%" stopColor="#1c00bc" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">
          {percentage}%
        </span>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
          Covered
        </span>
      </div>
    </div>
  );
};

const MainContent = ({ user }: { user?: User | null }) => {
  return (
    <main className="pl-0 md:pl-64 pt-20 md:pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10">
        {/* Greeting & Hero Section */}
        <section className="grid grid-cols-12 gap-4 md:gap-8 items-start">
          <div className="col-span-12 lg:col-span-7 space-y-4 md:space-y-6">
            <header>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-wrap gap-2 items-start">
                  <span className="px-2 py-1 bg-brand-gold/20 text-amber-700 dark:text-amber-300 text-xs font-bold rounded tracking-widest uppercase">
                    JAMB 2024
                  </span>
                  <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold text-xs md:text-sm bg-brand-gold/10 px-2 py-1 rounded-full">
                    <Flame className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Day 4 Streak</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {user?.name || "Scholar"}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-md">
                Your projected score is currently in the top 5th percentile for MBBS candidates.
                Focus on Physics calculations today.
              </p>
            </header>

            {/* Main Hero Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-8 shadow-lg border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-brand-blue/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="w-32 md:w-40 flex-shrink-0">
                  <CircularProgress percentage={78} />
                </div>

                <div className="flex-1 space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                      JAMB Score Projection
                    </h3>
                    <div className="text-3xl md:text-4xl font-bold text-brand-blue mt-2">315 / 400</div>

                    <div className="mt-3 md:mt-4 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-brand-blue p-3 md:p-4 rounded-r-lg">
                      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-brand-blue">AI Strategy:</span> Your current
                        aggregate meets the 2023 cut-off for UI Medicine. Ensure your O'level
                        results are uploaded to CAPS to secure your ranking.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 md:gap-4 flex-wrap">
                    <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 text-sm">
                      Full Mock
                    </Button>
                    <Button variant="outline" className="text-sm">Past Qs</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 md:gap-4">
            {/* Target Institution Widget */}
            <div className="bg-brand-gold text-slate-900 dark:text-white p-4 md:p-6 rounded-xl relative overflow-hidden shadow-lg">
              <div className="absolute -right-4 -bottom-4 opacity-15">
                <Award className="w-20 md:w-24 h-20 md:h-24 text-slate-900" />
              </div>
              <div className="relative z-10 flex items-start gap-3 md:gap-4">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 md:w-6 h-5 md:h-6 text-white font-bold" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                    Target
                  </p>
                  <p className="font-bold text-base md:text-lg leading-tight text-slate-900 dark:text-white truncate">University of Ibadan</p>
                  <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-semibold">Medicine & Surgery</p>
                </div>
              </div>
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-400/30 flex justify-between items-center gap-2">
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">Rating</span>
                <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-md shadow-md">
                  HIGHLY COMP.
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">
                  Drills
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">1,402</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 md:mt-2">
                  Questions
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 md:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">
                  Time
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">24h</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-1 md:mt-2">
                  +12% avg
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subject Overview Grid */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Subjects
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Aligned with JAMB requirements.
              </p>
            </div>
            <Button variant="ghost" className="text-brand-blue font-bold text-xs md:text-sm">
              View Progress →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
            {SUBJECTS.map((subject) => (
              <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <div className={`p-2 md:p-3 ${subject.bgColor} ${subject.color} rounded-lg`}>
                    <subject.icon className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 md:py-1 rounded uppercase ${
                      subject.status === "compulsory"
                        ? "bg-brand-blue/10 text-brand-blue"
                        : subject.status === "mastered"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          : subject.status === "weak"
                            ? "bg-red-100/50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                            : "bg-brand-gold/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {subject.status === "compulsory"
                      ? "Compulsory"
                      : subject.status === "mastered"
                        ? "Mastered"
                        : subject.status === "weak"
                          ? "Weak Area"
                          : "On Track"}
                  </span>
                </div>

                <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
                  {subject.name}
                </h4>

                <div className="space-y-2 mb-3 md:mb-6 flex-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                    <span>Level</span>
                    <span>{subject.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-blue to-brand-blue/70 transition-all"
                      style={{ width: `${subject.proficiency}%` }}
                    ></div>
                  </div>
                </div>

                <Button variant="outline" className="w-full text-xs md:text-sm">
                  {subject.status === "weak"
                    ? "Focus: Optics & Waves"
                    : subject.status === "compulsory"
                      ? "Focus: High-Yield Lexis"
                      : "High-Yield Calculations"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-12 gap-4 md:gap-8 pb-20 md:pb-0">
          {/* Recent Activity */}
          <div className="col-span-12 lg:col-span-8 space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Activity
            </h3>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="p-3 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center text-brand-blue flex-shrink-0">
                    <activity.icon className="w-4 md:w-5 h-4 md:h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      {activity.type === "drill" ? "Drill" : "Mock Exam"}
                    </p>
                    <h5 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">{activity.title}</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {activity.description}
                    </p>
                  </div>

                  <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 text-xs md:text-sm flex-shrink-0">
                    {activity.actionLabel}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tutor Quick-Access */}
          <div className="col-span-12 lg:col-span-4 bg-brand-blue text-white p-4 md:p-8 rounded-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Brain className="w-24 md:w-32 h-24 md:h-32" />
            </div>

            <div className="relative z-10">
              <h4 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 leading-tight">JAMB AI</h4>
              <p className="text-brand-blue/80 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                Ask about syllabus or CAPS status.
              </p>

              <div className="space-y-2 mb-6">
                <div className="bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded border border-white/10 cursor-pointer transition-all">
                  <p className="text-xs font-bold text-white/60 uppercase mb-1">Question</p>
                  <p className="text-xs md:text-sm line-clamp-1">Best subjects for Pharmacy?</p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 bg-white text-brand-blue p-2 rounded-md">
                <Input
                  placeholder="Ask..."
                  className="bg-transparent border-none text-xs focus-visible:ring-0 placeholder:text-brand-blue/40 px-1"
                />
                <button className="bg-brand-blue text-white p-1.5 rounded hover:bg-brand-blue/90 transition-colors flex-shrink-0">
                  <Send className="w-3 md:w-4 h-3 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-brand-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30 hover:bg-brand-blue/90">
        <Play className="w-5 h-5" />
      </button>
    </main>
  );
};

export default function DashboardNew() {
  const { user, isAuthenticated, isLoading } = useAuth();

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

  return (
    <div>
      <Sidebar />
      <TopNavBar />
      <MainContent user={user} />
    </div>
  );
}
