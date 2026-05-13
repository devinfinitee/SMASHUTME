import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { SubjectCard } from "@/components/subject-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Award, Target, Flame, Shield, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import Landing from "./landing";

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.role && ["admin", "super-admin"].includes(user.role)) {
      setLocation("/admin/dashboard");
      return;
    }

    if (isAuthenticated && user && user.onboardingCompleted === false) {
      setLocation("/onboarding/target");
    }
  }, [isAuthenticated, setLocation, user]);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  if (user?.onboardingCompleted === false) {
    return null;
  }

  // Calculate projected score and target score for comparison
  const projectedScore = user?.dashboard?.projectedScore ?? 0;
  const targetScore = user?.targetScore ?? 300;
  const scoreGap = Math.max(0, targetScore - projectedScore);
  const progressPercentage = Math.round((projectedScore / targetScore) * 100);
  const isOnTrack = projectedScore >= targetScore;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Let's keep up the momentum. You're making great progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
            <Flame className="w-4 h-4 mr-2" />
            3 Day Streak
          </div>
          <Button 
            onClick={() => setLocation("/admin/dashboard")} 
            variant="outline" 
            className="rounded-full"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-xl shadow-primary/25">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Target className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">Overall Progress</span>
          </div>
          <div className="text-3xl font-bold font-display">42%</div>
          <p className="text-sm opacity-75 mt-1">Completion across all subjects</p>
        </div>

        <div className="bg-secondary rounded-2xl p-6 text-secondary-foreground shadow-xl shadow-secondary/25">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">Topics Mastered</span>
          </div>
          <div className="text-3xl font-bold font-display">18</div>
          <p className="text-sm opacity-75 mt-1">Keep pushing for 20!</p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-amber-200/40 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">Target Score</span>
          </div>
          <div className="text-3xl font-bold font-display">{targetScore} / 400</div>
          <p className="text-sm opacity-75 mt-1">Your UTME target score</p>
        </div>
      </div>

      {/* Score Comparison Card - Projected vs Target */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-brand-blue" />
                Your Score Progress
              </h2>
              <p className="text-slate-600 text-sm mt-1">Track your projected score against your target</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
              isOnTrack 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {isOnTrack ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  On Target! 🎯
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  {scoreGap} points to go
                </>
              )}
            </div>
          </div>

          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Projected Score */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/20 p-6">
              <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-3">Current Projected Score</p>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-brand-blue">{Math.round(projectedScore)}</span>
                  <span className="text-2xl font-bold text-slate-400">/400</span>
                </div>
                <p className="text-sm text-slate-600">
                  Based on your mock performance and study progress
                </p>
                <div className="pt-2 border-t border-brand-blue/10">
                  <p className="text-xs text-slate-600">
                    📈 This score updates as you complete more mocks and drills
                  </p>
                </div>
              </div>
            </div>

            {/* Target Score */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 p-6">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-3">Your Target Score</p>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-brand-gold">{targetScore}</span>
                  <span className="text-2xl font-bold text-slate-400">/400</span>
                </div>
                <p className="text-sm text-slate-600">
                  Your UTME admission goal
                </p>
                <div className="pt-2 border-t border-brand-gold/10">
                  <p className="text-xs text-slate-600">
                    🎓 Set during your onboarding
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">Progress Toward Target</p>
              <p className="text-sm font-bold text-brand-blue">{progressPercentage}%</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-blue to-brand-blue/70 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 pt-2">
              {isOnTrack 
                ? `✨ Amazing! You've reached your target. Time to aim higher! 🚀`
                : `${scoreGap} more points needed to reach your target`
              }
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button 
              onClick={() => setLocation("/cbt")} 
              className="flex-1 bg-brand-blue text-white hover:bg-brand-blue/90"
            >
              Take a Mock Exam 📝
            </Button>
            <Button 
              onClick={() => setLocation("/performance")} 
              variant="outline"
              className="flex-1"
            >
              View Analytics 📊
            </Button>
          </div>
        </div>
      </div>      {/* Subjects Grid */}
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">Your Subjects</h2>
        {subjectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects?.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
