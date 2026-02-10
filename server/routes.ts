import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { ai } from "./replit_integrations/chat/storage"; // Not quite, need GoogleGenAI instance or use AI directly.
// Actually, for the "Explain" feature, I'll use the Gemini integration directly or a helper.
// The blueprint provided `server/replit_integrations/chat/routes.ts` which uses `ai` instance.
// I should export `ai` from somewhere or re-instantiate it.
// The `image/client.ts` exports `ai`. I can use that.
import { ai as geminiAi } from "./replit_integrations/image/client";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth first
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // === APP ROUTES ===

  // Subjects
  app.get(api.subjects.list.path, async (req, res) => {
    const subjects = await storage.getSubjects();
    const userId = req.user?.id; // Replit Auth user ID if logged in

    const result = await Promise.all(subjects.map(async (subject) => {
      const progress = userId ? await storage.getUserSubjectProgress(userId, subject.id) : 0;
      const topics = await storage.getTopicsBySubjectId(subject.id);
      return {
        ...subject,
        progress,
        topicCount: topics.length
      };
    }));

    res.json(result);
  });

  app.get(api.subjects.get.path, async (req, res) => {
    const subject = await storage.getSubjectBySlug(req.params.slug);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    const topics = await storage.getTopicsBySubjectId(subject.id);
    const userId = req.user?.id;

    const topicsWithProgress = await Promise.all(topics.map(async (topic) => {
      const progress = userId ? await storage.getUserProgress(userId, topic.id) : undefined;
      return { ...topic, progress };
    }));

    res.json({ ...subject, topics: topicsWithProgress });
  });

  // Topics
  app.get(api.topics.get.path, async (req, res) => {
    const topic = await storage.getTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const subject = (await storage.getSubjects()).find(s => s.id === topic.subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    const questions = await storage.getQuestionsByTopicId(topic.id);
    res.json({ ...topic, subject, questions });
  });

  // Progress
  app.post(api.progress.update.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.progress.update.input.parse(req.body);
      const userId = req.user!.id;
      const topicId = parseInt(req.params.id);

      const progress = await storage.updateUserProgress({
        userId,
        topicId,
        status: input.status,
      });
      res.json(progress);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Quiz
  app.post(api.quiz.submit.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.quiz.submit.input.parse(req.body);
      const userId = req.user!.id;
      const topicId = parseInt(req.params.id);

      const attempt = await storage.createQuizAttempt({
        userId,
        topicId,
        score: input.score,
        totalQuestions: input.totalQuestions,
      });
      
      // Also mark as completed if score > 70%? Optional.
      if (input.score / input.totalQuestions >= 0.7) {
        await storage.updateUserProgress({
          userId,
          topicId,
          status: "completed",
        });
      }

      res.status(201).json(attempt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // AI Explain
  app.post(api.ai.explain.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { text, context } = req.body;
      const prompt = `
        You are an expert tutor for UTME/JAMB exams in Nigeria.
        Explain the following concept to a high school student simply and clearly.
        Focus on what is important for the exam.
        
        Concept/Text: "${text}"
        ${context ? `Context: ${context}` : ""}
        
        Keep it concise (under 150 words). Use bullet points if helpful.
      `;

      const response = await geminiAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const explanation = response.response.text();
      res.json({ explanation });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to generate explanation" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingSubjects = await storage.getSubjects();
  if (existingSubjects.length > 0) return;

  console.log("Seeding database...");

  const english = await storage.createSubject({ name: "Use of English", slug: "english", icon: "Book" });
  const math = await storage.createSubject({ name: "Mathematics", slug: "math", icon: "Calculator" });
  const physics = await storage.createSubject({ name: "Physics", slug: "physics", icon: "Atom" });
  const biology = await storage.createSubject({ name: "Biology", slug: "biology", icon: "Dna" });
  const chemistry = await storage.createSubject({ name: "Chemistry", slug: "chemistry", icon: "FlaskConical" });

  // Math Topics
  const sets = await storage.createTopic({
    subjectId: math.id,
    name: "Number Bases",
    slug: "number-bases",
    isHighYield: true,
    content: `
# Number Bases

In this topic, we deal with numbers in different bases other than the common base 10 (decimal).

## Key Concepts

1. **Conversion from Base 10 to Base X**: Repeated division by X.
2. **Conversion from Base X to Base 10**: Expansion method using powers of X.
3. **Operations**: Addition, Subtraction, Multiplication in bases.

### Example (UTME Style)

Convert 25 (base 10) to base 2.
- 25 / 2 = 12 rem 1
- 12 / 2 = 6 rem 0
- 6 / 2 = 3 rem 0
- 3 / 2 = 1 rem 1
- 1 / 2 = 0 rem 1

Read from bottom up: **11001 (base 2)**.
    `,
    summary: "Master converting between base 10 and other bases. Watch out for 'find X' questions.",
    commonTraps: ["Forgetting to carry over correctly in addition.", "Misinterpreting the question: Convert TO base 10 vs FROM base 10."]
  });

  // Questions for Sets
  await storage.createQuestion({
    topicId: sets.id,
    content: "If 11011 (base 2) + 111 (base 2) = Y (base 2), find Y.",
    options: { "A": "100010", "B": "11110", "C": "100001", "D": "10010" },
    correctOption: "A",
    explanation: "11011 + 111:\n1+1=10 (write 0 carry 1)\n1+1+1=11 (write 1 carry 1)\n0+1+1=10 (write 0 carry 1)\n1+1=10 (write 0 carry 1)\n1+1=10 (write 0 carry 1)\nResult: 100010"
  });

  // Physics Topics
  await storage.createTopic({
    subjectId: physics.id,
    name: "Motion",
    slug: "motion",
    isHighYield: true,
    content: "# Motion\n\nMotion involves change in position...",
    summary: "Equations of motion are critical. V = U + at, etc.",
    commonTraps: ["Confusing speed (scalar) with velocity (vector)."]
  });

  console.log("Database seeded!");
}
