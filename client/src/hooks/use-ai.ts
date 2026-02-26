import { useMutation } from "@tanstack/react-query";

export function useExplain() {
  return useMutation({
    mutationFn: async ({ text, context }: { text: string; context?: string }) => {
      // Simulate network delay  
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock AI explanation response
      const explanation = `Here's an explanation for "${text}": This is a detailed explanation that would normally come from an AI service. ${context ? `Given the context: ${context}. ` : ''}This is a mock response for demo purposes.`;
      
      return { explanation };
    },
  });
}
