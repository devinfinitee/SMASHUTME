import { Link, useRoute } from "wouter";
import { useSubject } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, Circle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubjectDetail() {
  const [, params] = useRoute("/subjects/:slug");
  const { data: subject, isLoading } = useSubject(params?.slug || "");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!subject) return <div>Subject not found</div>;

  // Group topics
  const highYieldTopics = subject.topics.filter(t => t.isHighYield);
  const regularTopics = subject.topics.filter(t => !t.isHighYield);

  const TopicList = ({ topics }: { topics: typeof subject.topics }) => (
    <div className="space-y-3">
      {topics.map((topic) => {
        const isCompleted = topic.progress?.status === "completed";
        const isInProgress = topic.progress?.status === "in_progress";
        
        return (
          <Link key={topic.id} href={`/topics/${topic.slug}`}>
            <div className={cn(
              "group flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer",
              isCompleted 
                ? "bg-secondary/5 border-secondary/20 hover:bg-secondary/10" 
                : "bg-card border-border hover:border-primary/50 hover:shadow-md"
            )}>
              <div className="mr-4">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                ) : (
                  <Circle className={cn(
                    "w-6 h-6",
                    isInProgress ? "text-primary fill-primary/20" : "text-muted-foreground group-hover:text-primary"
                  )} />
                )}
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold text-base mb-1",
                  isCompleted ? "text-secondary-foreground/80 line-through decoration-secondary/30" : "text-foreground"
                )}>
                  {topic.name}
                </h4>
                {topic.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{topic.summary}</p>
                )}
              </div>
              {isInProgress && !isCompleted && (
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                  In Progress
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/">
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="space-y-4">
        <h1 className="text-4xl font-display font-bold text-foreground">{subject.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{subject.topics.length} Topics</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{highYieldTopics.length} High Yield</span>
        </div>
      </div>

      {highYieldTopics.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold font-display">High Yield Topics</h2>
          </div>
          <div className="bg-secondary/10 dark:bg-secondary/5 border border-secondary/20 dark:border-secondary/30 rounded-2xl p-6">
            <p className="text-secondary-foreground text-sm mb-4 font-medium">
              These topics appear frequently in JAMB exams. Master them first!
            </p>
            <TopicList topics={highYieldTopics} />
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold font-display mb-4">All Topics</h2>
        <TopicList topics={regularTopics} />
      </section>
    </div>
  );
}
