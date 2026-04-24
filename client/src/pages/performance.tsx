import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  AlertTriangle,
  Flame,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  Lock,
} from "lucide-react";

const MOCK_MOCK_SESSIONS = [
  { date: "Mar 10", score: 245, english: 58, chemistry: 62, physics: 55, biology: 70 },
  { date: "Mar 14", score: 258, english: 65, chemistry: 72, physics: 60, biology: 61 },
  { date: "Mar 18", score: 272, english: 70, chemistry: 68, physics: 72, biology: 62 },
  { date: "Mar 22", score: 281, english: 72, chemistry: 75, physics: 68, biology: 66 },
  { date: "Mar 26", score: 284, english: 75, chemistry: 78, physics: 70, biology: 61 },
];

const SUBJECT_MASTERY = [
  { subject: "Use of English", percentage: 78, color: "bg-brand-blue" },
  { subject: "Chemistry", percentage: 72, color: "bg-brand-gold" },
  { subject: "Physics", percentage: 65, color: "bg-red-500" },
  { subject: "Biology", percentage: 71, color: "bg-emerald-500" },
];

const HIGH_YIELD_WEAKNESSES = [
  {
    topic: "Organic Chemistry",
    description: "Failed 6/8 recent questions",
    icon: AlertTriangle,
    color: "text-red-600",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
  },
  {
    topic: "Projectile Motion",
    description: "SPQ too slow: 65s average (target: 40s)",
    icon: Clock,
    color: "text-amber-600",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
  },
  {
    topic: "Verb Tenses & Anomalies",
    description: "Accuracy 54% in last 3 attempts",
    icon: AlertTriangle,
    color: "text-orange-600",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
  },
];

export default function PerformancePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [hasData, setHasData] = useState(true);

  // Mock target data from onboarding
  const targetCourse = user?.targetCourse || "Medicine and Surgery";
  const targetInstitution = user?.targetInstitution || "University of Ibadan";
  const targetScore = 300;

  // Calculate metrics
  const currentScore = MOCK_MOCK_SESSIONS[MOCK_MOCK_SESSIONS.length - 1].score;
  const previousScore = MOCK_MOCK_SESSIONS[MOCK_MOCK_SESSIONS.length - 2].score;
  const scoreTrend = currentScore >= previousScore;
  const admissionProbability = Math.round((currentScore / targetScore) * 100);
  const averageSPQ = 38;

  const mockSessionsData = MOCK_MOCK_SESSIONS.map((session) => ({
    ...session,
    name: session.date,
  }));

  if (!hasData) {
    return (
      <AppShell searchPlaceholder="Search performance insights...">
        <div className="relative max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-12 shadow-sm backdrop-blur space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-500/5 backdrop-blur-sm"></div>
            <Lock className="w-16 h-16 text-slate-400 mx-auto relative z-10" />
            <div className="text-center space-y-3 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900">Insufficient Data</h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                Complete your first Diagnostic Mini-Mock to generate your performance metrics and see your predictive analytics.
              </p>
              <Button onClick={() => setLocation("/cbt")} className="bg-brand-blue text-white hover:bg-brand-blue/90 mx-auto">
                Start Diagnostic Mini-Mock
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell searchPlaceholder="Search performance insights...">
      <div className="relative max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-blue/10 to-transparent blur-3xl" />

        {/* Header */}
        <div className="relative space-y-2 mb-8">
          <h1 className="text-4xl font-display font-bold text-brand-blue">Performance Analytics Hub</h1>
          <p className="text-slate-600 font-medium">
            Real-time predictive insights for {targetCourse} at {targetInstitution}
          </p>
        </div>

        {/* Section 1: Executive Readiness Snapshot */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Readiness Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Predictive Aggregate Score */}
            <div className="rounded-3xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 to-white p-8 shadow-[0_10px_30px_rgba(43,10,250,0.08)] space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">Predictive Aggregate</p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-brand-blue">{currentScore}</span>
                      <span className="text-2xl font-bold text-slate-400">/400</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Current Trajectory</p>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    scoreTrend
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {scoreTrend ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-brand-blue/10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Score</p>
                <p className="text-lg font-bold text-brand-blue">{targetScore} (Required)</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-brand-blue rounded-full h-2 transition-all"
                    style={{ width: `${(currentScore / targetScore) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {currentScore >= targetScore
                    ? "✓ On target!"
                    : `${targetScore - currentScore} points needed`}
                </p>
              </div>
            </div>

            {/* Card 2: Admission Probability Engine */}
            <div className="rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/5 to-white p-8 shadow-[0_10px_30px_rgba(250,177,10,0.08)] space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Admission Probability</p>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${(admissionProbability / 100) * 282} 282`}
                      strokeLinecap="round"
                      className="text-brand-gold transform -rotate-90 origin-center transition-all"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-brand-gold">{admissionProbability}%</span>
                    <span className="text-xs text-slate-500 font-bold">Probability</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-brand-gold/10">
                <div className="flex items-center gap-2">
                  {admissionProbability >= 80 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        On Track
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        At Risk
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compared to historical cut-off marks for {targetCourse}.
                </p>
              </div>
            </div>

            {/* Card 3: Cognitive Pacing */}
            <div className="rounded-3xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-white p-8 shadow-[0_10px_30px_rgba(168,85,247,0.08)] space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-700">Cognitive Pacing (SPQ)</p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-4xl font-black text-purple-700">{averageSPQ}s</span>
                    <span className="text-sm text-slate-500 font-bold">/question</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Average across all subjects</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-purple-200/30">
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                    <span>JAMB Optimal Pace</span>
                    <span className="font-bold">40s</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full h-2"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold mt-2">✓ You're pacing well!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mock Performance Matrix */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mock Performance Trend</h2>
          <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_10px_30px_rgba(11,28,48,0.05)] backdrop-blur">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={mockSessionsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2B0AFA" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2B0AFA" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" style={{ fontSize: "12px" }} />
                <YAxis domain={[0, 400]} stroke="#94A3B8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(11,28,48,0.1)",
                  }}
                  labelStyle={{ color: "#0F172A", fontSize: "12px", fontWeight: "bold" }}
                  formatter={(value) => [value, "Score"]}
                  cursor={{ stroke: "#2B0AFA", strokeWidth: 1 }}
                />
                <ReferenceLine
                  y={targetScore}
                  stroke="#FAB10A"
                  strokeDasharray="5 5"
                  label={{
                    value: `Target: ${targetScore}`,
                    position: "right",
                    fill: "#856404",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2B0AFA"
                  strokeWidth={3}
                  dot={(props) => (
                    <circle
                      {...props}
                      fill="#2B0AFA"
                      stroke="#FFF"
                      strokeWidth={2}
                      r={5}
                    />
                  )}
                  activeDot={{ r: 7, fill: "#FAB10A" }}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-600 mt-6 text-center font-medium">
              Hover over points to see subject-wise score breakdown for each mock session.
            </p>
          </div>
        </section>

        {/* Section 3: 80/20 Subject & Topic Mastery Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">80/20 Subject & Topic Mastery</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column A: Subject Mastery Breakdown */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_10px_30px_rgba(11,28,48,0.05)] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Subject Mastery Breakdown</h3>
                <p className="text-sm text-slate-600">Based on high-yield topics completed vs. failed in drills.</p>
              </div>
              <div className="space-y-4">
                {SUBJECT_MASTERY.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900">{subject.subject}</span>
                      <span className="text-xs font-bold text-brand-blue">{subject.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${subject.color}`}
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column B: High-Yield Remediation Targets */}
            <div className="rounded-3xl border border-red-200/50 bg-red-50/50 p-8 shadow-[0_10px_30px_rgba(239,68,68,0.05)] space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900">High-Yield Remediation Targets</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Top 3 topics bleeding the most points. Fix these first.</p>
              <div className="space-y-3">
                {HIGH_YIELD_WEAKNESSES.map((weakness, index) => {
                  const Icon = weakness.icon;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border-2 ${weakness.borderColor} ${weakness.bgColor} p-4 space-y-3`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${weakness.color}`} />
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${weakness.color}`}>{weakness.topic}</p>
                          <p className="text-xs text-slate-600 mt-1">{weakness.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setLocation("/syllabus")}
                        className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 text-xs font-bold h-8"
                      >
                        Remediate Now <ArrowRight className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Behavioral & Consistency Stats */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Behavioral & Consistency Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            {/* Card 1: Study Streak */}
            <div className="rounded-3xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 to-white p-8 shadow-[0_10px_30px_rgba(43,10,250,0.08)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">Study Streak</p>
                  <p className="text-3xl font-black text-brand-blue">12</p>
                  <p className="text-sm text-slate-600 font-medium">Days Consecutive</p>
                </div>
                <Flame className="w-8 h-8 text-brand-gold flex-shrink-0" />
              </div>
              <div className="pt-4 border-t border-brand-blue/10">
                <p className="text-xs text-slate-600">Keep it up! You're on fire. 🔥</p>
              </div>
            </div>

            {/* Card 2: AI Remediation Load */}
            <div className="rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/5 to-white p-8 shadow-[0_10px_30px_rgba(250,177,10,0.08)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">AI Remediation</p>
                  <p className="text-3xl font-black text-brand-gold">45</p>
                  <p className="text-sm text-slate-600 font-medium">Explanations Generated</p>
                </div>
                <BookOpen className="w-8 h-8 text-brand-blue flex-shrink-0" />
              </div>
              <div className="pt-4 border-t border-brand-gold/10">
                <p className="text-xs text-slate-600">You're leveraging AI well for deep learning.</p>
              </div>
            </div>

            {/* Card 3: Combat Hours */}
            <div className="rounded-3xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-white p-8 shadow-[0_10px_30px_rgba(168,85,247,0.08)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-2">Combat Hours</p>
                  <p className="text-3xl font-black text-purple-700">14h 30m</p>
                  <p className="text-sm text-slate-600 font-medium">Time in CBT Simulation</p>
                </div>
                <Zap className="w-8 h-8 text-purple-600 flex-shrink-0" />
              </div>
              <div className="pt-4 border-t border-purple-200/30">
                <p className="text-xs text-slate-600">Quality work. This volume is high-impact.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
