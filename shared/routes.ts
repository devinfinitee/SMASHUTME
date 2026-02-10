import { z } from 'zod';
import { insertSubjectSchema, insertTopicSchema, insertQuestionSchema, insertUserProgressSchema, insertQuizAttemptSchema, subjects, topics, questions, userProgress, quizAttempts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  subjects: {
    list: {
      method: 'GET' as const,
      path: '/api/subjects' as const,
      responses: {
        200: z.array(z.custom<typeof subjects.$inferSelect & { progress: number; topicCount: number }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/subjects/:slug' as const,
      responses: {
        200: z.custom<typeof subjects.$inferSelect & { topics: (typeof topics.$inferSelect & { progress?: typeof userProgress.$inferSelect })[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  topics: {
    get: {
      method: 'GET' as const,
      path: '/api/topics/:slug' as const,
      responses: {
        200: z.custom<typeof topics.$inferSelect & { subject: typeof subjects.$inferSelect; questions?: typeof questions.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  progress: {
    update: {
      method: 'POST' as const,
      path: '/api/topics/:id/progress' as const,
      input: z.object({
        status: z.enum(["not_started", "in_progress", "completed"]),
      }),
      responses: {
        200: z.custom<typeof userProgress.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  quiz: {
    submit: {
      method: 'POST' as const,
      path: '/api/topics/:id/quiz' as const,
      input: z.object({
        score: z.number(),
        totalQuestions: z.number(),
      }),
      responses: {
        201: z.custom<typeof quizAttempts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  ai: {
    explain: {
      method: 'POST' as const,
      path: '/api/ai/explain' as const,
      input: z.object({
        text: z.string(),
        context: z.string().optional(),
      }),
      responses: {
        200: z.object({ explanation: z.string() }),
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
