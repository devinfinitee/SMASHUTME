import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { mockSubjects, mockTopics } from "@/lib/mockData";
import type { Subject } from "../types";

export function useSubjects() {
  return useQuery({
    queryKey: ["/subjects"],
    queryFn: async (): Promise<Subject[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add topics to each subject
      return mockSubjects.map(subject => ({
        ...subject,
        topics: mockTopics.filter(topic => topic.subjectId === subject.id),
      }));
    },
  });
}

export function useSubject(slug: string) {
  return useQuery({
    queryKey: ["/subjects", slug],
    queryFn: async (): Promise<Subject | null> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const subject = mockSubjects.find(s => s.slug === slug);
      if (!subject) return null;
      
      return {
        ...subject,
        topics: mockTopics.filter(topic => topic.subjectId === subject.id),
      };
    },
    enabled: !!slug,
  });
}
