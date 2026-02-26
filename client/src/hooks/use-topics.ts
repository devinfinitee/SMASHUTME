import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { mockTopics, mockQuestions } from "@/lib/mockData";
import type { Topic, Question } from "../types";

export function useTopic(slug: string) {
  return useQuery({
    queryKey: ["/topics", slug],
    queryFn: async (): Promise<Topic | null> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const topic = mockTopics.find(t => t.slug === slug);
      return topic || null;
    },
    enabled: !!slug,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ topicId, status }: { topicId: number; status: "not_started" | "in_progress" | "completed" }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful update
      return { success: true, topicId, status };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/subjects"] });
      toast({
        title: "Progress Updated",
        description: `Topic marked as ${variables.status.replace('_', ' ')}`,
        variant: "default",
      });
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful submission
      return { 
        success: true, 
        topicId, 
        score, 
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Quiz Completed!",
        description: `You scored ${data.score}/${data.totalQuestions} (${data.percentage}%)`,
        variant: "default",
      });
      // Invalidate to refresh progress
      queryClient.invalidateQueries({ queryKey: ["/subjects"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",  
      });
    },
  });
}

export function useTopicQuestions(topicId: number) {
  return useQuery({
    queryKey: ["/topics", topicId, "questions"],
    queryFn: async (): Promise<Question[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockQuestions.filter(q => q.topicId === topicId);
    },
    enabled: !!topicId,
  });
}
