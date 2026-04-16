// Basic types for the frontend-only version

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  status?: string;
  authProvider?: string;
  avatarUrl?: string | null;
  onboardingCompleted?: boolean;
}

export interface Subject {
  id: number;
  name: string;
  slug: string;
  icon: string;
  topics?: Topic[];
}

export interface Topic {
  id: number;
  subjectId: number;
  name: string;
  slug: string;
  isHighYield: boolean;
  content?: string;
  summary?: string;
  commonTraps?: string[];
}

export interface Question {
  id: number;
  topicId: number;
  content: string;
  options: Record<string, string>;
  correctOption: string;
  explanation?: string;
}

export interface UserProgress {
  id: number;
  userId: string;
  topicId: number;
  status: "not_started" | "in_progress" | "completed";
  lastStudiedAt: Date;
}