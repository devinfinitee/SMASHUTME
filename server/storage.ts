import { db } from "./db";
import {
  subjects, topics, questions, userProgress, quizAttempts,
  type Subject, type Topic, type Question, type UserProgress, type QuizAttempt,
  type InsertSubject, type InsertTopic, type InsertQuestion, type InsertUserProgress, type InsertQuizAttempt
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Subjects
  getSubjects(): Promise<Subject[]>;
  getSubjectBySlug(slug: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Topics
  getTopicsBySubjectId(subjectId: number): Promise<Topic[]>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;

  // Questions
  getQuestionsByTopicId(topicId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // User Progress
  getUserProgress(userId: string, topicId: number): Promise<UserProgress | undefined>;
  getUserSubjectProgress(userId: string, subjectId: number): Promise<number>; // percentage
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Quiz
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
}

export class DatabaseStorage implements IStorage {
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubjectBySlug(slug: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.slug, slug));
    return subject;
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  async getTopicsBySubjectId(subjectId: number): Promise<Topic[]> {
    return await db.select().from(topics).where(eq(topics.subjectId, subjectId));
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));
    return topic;
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [newTopic] = await db.insert(topics).values(topic).returning();
    return newTopic;
  }

  async getQuestionsByTopicId(topicId: number): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.topicId, topicId));
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }

  async getUserProgress(userId: string, topicId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.topicId, topicId)));
    return progress;
  }

  async getUserSubjectProgress(userId: string, subjectId: number): Promise<number> {
    // This is a simplified calculation: (completed topics / total topics) * 100
    // Real implementation might be more complex
    const topicCount = await db.select({ count: sql<number>`count(*)` })
      .from(topics)
      .where(eq(topics.subjectId, subjectId));
    
    const completedCount = await db.select({ count: sql<number>`count(*)` })
      .from(userProgress)
      .innerJoin(topics, eq(userProgress.topicId, topics.id))
      .where(and(
        eq(userProgress.userId, userId),
        eq(topics.subjectId, subjectId),
        eq(userProgress.status, "completed")
      ));

    const total = Number(topicCount[0]?.count) || 0;
    const completed = Number(completedCount[0]?.count) || 0;

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [updated] = await db.insert(userProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.topicId],
        set: { status: progress.status, lastStudiedAt: new Date() }
      })
      .returning();
    return updated;
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [newAttempt] = await db.insert(quizAttempts).values(attempt).returning();
    return newAttempt;
  }
}

export const storage = new DatabaseStorage();
