import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { SubjectCard } from "@/components/subject-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Award, Target, Flame, Shield } from "lucide-react";
import { useLocation } from "wouter";
import Landing from "./landing";

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const [, setLocation] = useLocation();

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
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-xl shadow-primary/25">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Target className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">Overall Progress</span>
          </div>
          <div className="text-3xl font-bold font-display">42%</div>
          <p className="text-sm opacity-75 mt-1">Completion across all subjects</p>
        </div>

        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-secondary-foreground shadow-xl shadow-secondary/25">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">Topics Mastered</span>
          </div>
          <div className="text-3xl font-bold font-display">18</div>
          <p className="text-sm opacity-75 mt-1">Keep pushing for 20!</p>
        </div>
        
        {/* Placeholder for future stat */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center border-dashed">
           <p className="text-muted-foreground text-sm font-medium">More stats coming soon</p>
        </div>
      </div>

      {/* Subjects Grid */}
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
