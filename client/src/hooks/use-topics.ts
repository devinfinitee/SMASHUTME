import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTopic(slug: string) {
  return useQuery({
    queryKey: [api.topics.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.topics.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch topic");
      return api.topics.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ topicId, status }: { topicId: number; status: "not_started" | "in_progress" | "completed" }) => {
      const url = buildUrl(api.progress.update.path, { id: topicId });
      const res = await fetch(url, {
        method: api.progress.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return api.progress.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.subjects.list.path] });
      // Also invalidate specific subject queries if we could get the slug, 
      // but list invalidation is safe enough for dashboard updates.
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ topicId, score, totalQuestions }: { topicId: number; score: number; totalQuestions: number }) => {
      const url = buildUrl(api.quiz.submit.path, { id: topicId });
      const res = await fetch(url, {
        method: api.quiz.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, totalQuestions }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      return api.quiz.submit.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Quiz Completed!",
        description: "Your results have been saved.",
        variant: "default",
      });
      // Invalidate to refresh progress if quiz completion affects it
      queryClient.invalidateQueries({ queryKey: [api.subjects.list.path] });
    },
  });
}
