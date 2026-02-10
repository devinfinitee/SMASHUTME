import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth and Chat models to re-export
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === TABLE DEFINITIONS ===

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(), // Lucide icon name
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  isHighYield: boolean("is_high_yield").default(false),
  content: text("content"), // Markdown content
  summary: text("summary"),
  commonTraps: jsonb("common_traps").$type<string[]>().default([]),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topics.id),
  content: text("content").notNull(),
  options: jsonb("options").$type<Record<string, string>>().notNull(), // e.g. { "A": "...", "B": "..." }
  correctOption: text("correct_option").notNull(), // "A", "B", etc.
  explanation: text("explanation"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // Using auth.users id (string)
  topicId: integer("topic_id").notNull().references(() => topics.id),
  status: text("status").$type<"not_started" | "in_progress" | "completed">().default("not_started"),
  lastStudiedAt: timestamp("last_studied_at").defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  topicId: integer("topic_id").notNull().references(() => topics.id),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const subjectsRelations = relations(subjects, ({ many }) => ({
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [topics.subjectId],
    references: [subjects.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  topic: one(topics, {
    fields: [questions.topicId],
    references: [topics.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  topic: one(topics, {
    fields: [userProgress.topicId],
    references: [topics.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, lastStudiedAt: true });
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Subject = typeof subjects.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

// Request types
export type UpdateProgressRequest = {
  status: "not_started" | "in_progress" | "completed";
};

export type SubmitQuizRequest = {
  score: number;
  totalQuestions: number;
};

export type GenerateExplanationRequest = {
  topicId: number;
  concept: string; // What specific part they want explained
  context?: string; // Optional context (e.g. "I don't understand option B")
};

// Response types
export type TopicWithProgress = Topic & {
  progress?: UserProgress;
};

export type SubjectWithTopics = Subject & {
  topics: TopicWithProgress[];
  progress: number; // calculated percentage
};

export type QuizResultResponse = QuizAttempt & {
  message: string;
};

export type ExplanationResponse = {
  explanation: string;
};
