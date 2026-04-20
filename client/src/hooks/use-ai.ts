import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-fetch";

type ReviewItem = {
  id: string;
  subject: string;
  topic: string;
  prompt: string;
  options: Array<{ key: string; text: string }>;
  chosen: string;
  correct: string;
  timeSpent: string;
  difficulty: string;
  failRate: string;
  wrongPath: string;
  foundation: string;
  mnemonic: string;
};

type AiReviewResponse = {
  message: string;
  questions: ReviewItem[];
};

export function useAiReview(subjectSlug?: string | null, topicSlug?: string | null) {
  return useQuery({
    queryKey: ["/ai/review", subjectSlug || "all", topicSlug || "all"],
    queryFn: async (): Promise<AiReviewResponse> => {
      const params = new URLSearchParams();
      if (subjectSlug) {
        params.set("subjectSlug", subjectSlug);
      }
      if (topicSlug) {
        params.set("topicSlug", topicSlug);
      }

      const query = params.toString();
      const endpoint = query ? `/api/ai/review?${query}` : "/api/ai/review";

      const response = await apiFetch(endpoint, {
        method: "GET",
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || "Unable to fetch AI review queue.");
      }

      return {
        message: body?.message || "AI review queue loaded.",
        questions: Array.isArray(body?.questions) ? body.questions : [],
      };
    },
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useExplain() {
  return useMutation({
    mutationFn: async ({ text, context }: { text: string; context?: string }) => {
      const response = await apiFetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || "Unable to generate AI explanation.");
      }

      return { explanation: body?.explanation || "No explanation was returned." };
    },
  });
}
