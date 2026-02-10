import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useExplain() {
  return useMutation({
    mutationFn: async ({ text, context }: { text: string; context?: string }) => {
      const res = await fetch(api.ai.explain.path, {
        method: api.ai.explain.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to get explanation");
      return api.ai.explain.responses[200].parse(await res.json());
    },
  });
}
