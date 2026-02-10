import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import ReactMarkdown from 'react-markdown';
import { useTopic, useUpdateProgress } from "@/hooks/use-topics";
import { AiHelper } from "@/components/ai-helper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, ChevronRight, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TopicStudy() {
  const [, params] = useRoute("/topics/:slug");
  const { data: topic, isLoading } = useTopic(params?.slug || "");
  const { mutate: updateProgress } = useUpdateProgress();
  const { toast } = useToast();
  
  // Track reading progress roughly by scroll or time?
  // For MVP, just mark in-progress on load
  useEffect(() => {
    if (topic && topic.id) {
      updateProgress({ topicId: topic.id, status: "in_progress" });
    }
  }, [topic?.id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-12 bg-muted rounded w-3/4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="relative max-w-3xl mx-auto pb-24">
      {/* Navigation Header */}
      <div className="mb-8 border-b border-border pb-6">
        <Link href={`/subjects/${topic.subject.slug}`}>
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {topic.subject.name}
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          {topic.name}
        </h1>
        {topic.isHighYield && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            High Yield Topic
          </span>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <ReactMarkdown>
          {topic.content || "No content available for this topic yet."}
        </ReactMarkdown>
      </div>

      {/* Action Footer */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="text-lg font-bold mb-1">Ready to test your knowledge?</h3>
          <p className="text-muted-foreground text-sm">Take a quick quiz to cement what you've learned.</p>
        </div>
        <Link href={`/topics/${topic.slug}/quiz`}>
          <Button size="lg" className="w-full md:w-auto rounded-full px-8 shadow-lg shadow-primary/20">
            Take Quiz
            <PlayCircle className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      <AiHelper topicContext={`Topic: ${topic.name}. Content: ${topic.content}`} />
    </div>
  );
}
