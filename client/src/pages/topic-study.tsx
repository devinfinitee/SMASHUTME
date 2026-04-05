import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import ReactMarkdown from 'react-markdown';
import { useTopic, useUpdateProgress } from "@/hooks/use-topics";
import { AiHelper } from "@/components/ai-helper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function TopicStudy() {
  const [, params] = useRoute("/topics/:slug");
  const { data: topic, isLoading } = useTopic(params?.slug || "");
  const { mutate: updateProgress } = useUpdateProgress();
  
  // Track reading progress roughly by scroll or time?
  // For MVP, just mark in-progress on load
  useEffect(() => {
    if (topic && topic.id) {
      updateProgress({ topicId: topic.id, status: "in_progress" });
    }
  }, [topic?.id]);

  if (isLoading) {
    return (
      <AppShell searchPlaceholder="Search topic notes...">
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse p-4 md:p-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!topic) return <div>Topic not found</div>;

  return (
    <AppShell searchPlaceholder="Search topic notes...">
      <div className="relative max-w-3xl mx-auto pb-24 p-4 md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-blue/10 to-transparent blur-3xl" />
      {/* Navigation Header */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white/90 p-5 md:p-8 shadow-[0_20px_40px_rgba(11,28,48,0.05)] backdrop-blur">
        <Link href={`/subjects/${topic.subject.slug}`}>
          <Button variant="ghost" className="pl-0 hover:bg-transparent text-[#2B0AFA] hover:text-[#2408CF] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {topic.subject.name}
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
          {topic.name}
        </h1>
        {topic.isHighYield && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FAB100]/20 text-[#8A5C00] border border-[#FAB100]/40">
            High Yield Topic
          </span>
        )}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAB100]/20 border border-[#FAB100]/40">
          <span className="w-2 h-2 rounded-full bg-[#FAB100]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5C00]">Secondary Focus Mode</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_40px_rgba(11,28,48,0.05)] backdrop-blur">
        <div className="prose prose-lg dark:prose-invert max-w-none p-5 md:p-8">
          <ReactMarkdown>
            {topic.content || "No content available for this topic yet."}
          </ReactMarkdown>
        </div>
      </div>

      {/* Action Footer */}
      <div className="rounded-3xl border border-[#2B0AFA]/15 bg-gradient-to-br from-white to-slate-50 p-8 shadow-[0_20px_40px_rgba(11,28,48,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold mb-1">Ready to test your knowledge?</h3>
          <p className="text-muted-foreground text-sm">Take a quick quiz to cement what you've learned.</p>
        </div>
        <Link href={`/topics/${topic.slug}/quiz`}>
          <Button size="lg" className="w-full md:w-auto rounded-full px-8 bg-[#2B0AFA] hover:bg-[#2408CF] text-white shadow-lg shadow-[#2B0AFA]/25 border border-[#FAB100]/40">
            Take Quiz
            <PlayCircle className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      <AiHelper topicContext={`Topic: ${topic.name}. Content: ${topic.content}`} />
      </div>
    </AppShell>
  );
}
