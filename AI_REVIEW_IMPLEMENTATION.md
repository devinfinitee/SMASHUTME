# AI Review Page: Implementation Logic

This document explains how the user AI Review page now works end-to-end.

## Objective

Make the AI Review page production-functional by:
- pulling real review items from user CBT history,
- providing validated AI follow-up explanations,
- handling loading/empty/error states clearly,
- keeping the UI flow aligned with onboarding subject/topic selection.

## Architecture Overview

Frontend:
- AI Review page drives a 3-step flow:
  1. Subject selection
  2. Topic selection
  3. AI deep-dive on incorrect attempts
- Uses API-backed hooks (`useAiReview`, `useExplain`) instead of mock-only behavior.

Backend:
- `GET /api/ai/review` builds a personalized queue from submitted CBT sessions.
- `POST /api/ai/explain` validates and returns an explanation strategy for follow-up questions.

Authentication:
- Both endpoints are protected by `requireAuth` and `requireActiveUser`.

## Backend Logic

File: server/src/controllers/aiController.js

### 1) Review Queue Endpoint
Endpoint:
- `GET /api/ai/review?subjectSlug=...&topicSlug=...`

Data source:
- Reads latest submitted `QuizSession` records for the authenticated user.
- Extracts wrong results (`isCorrect === false`) from session `results`.
- Resolves each wrong result against the session `questions` snapshot.

Filtering:
- If `subjectSlug` is provided, it resolves subject name and filters by subject.
- If `topicSlug` is provided, it resolves topic name and filters by topic.
- If filter produces no rows, it falls back to unfiltered wrong-question pool.

Transformation:
Each item is transformed into AI Review UI format:
- question stem and options
- chosen option vs correct option
- estimated time spent per question
- fail rate estimate
- generated coaching blocks:
  - wrong path explanation
  - foundation concept line
  - mnemonic helper

Response shape:
- `{ message, questions: [...] }`

### 2) Explain Endpoint
Endpoint:
- `POST /api/ai/explain`

Validation:
- `text` required
- min length = 3
- max length = 500

Output:
- Structured step-by-step explanation guidance.
- Includes optional context when provided.

## Frontend Logic

### Hook Layer
File: client/src/hooks/use-ai.ts

`useAiReview(subjectSlug, topicSlug)`:
- calls `/api/ai/review`
- passes query parameters only when available
- returns typed review payload for rendering

`useExplain()`:
- calls `/api/ai/explain`
- returns validated explanation text
- surfaces backend errors to UI

### Page Layer
File: client/src/pages/ai-review.tsx

Step 1 and Step 2:
- unchanged flow for selecting subject and topic

Step 3 (deep-dive):
- loads real review queue from backend
- states handled:
  - loading: skeletons
  - empty: actionable message + CTA to CBT page
  - error: inline error + retry button
- keeps question navigation (`Next Question`) and saved insight counter
- follow-up ask panel uses real explain endpoint with contextual prompt

## Why This Is Reliable

- Review data is based on persisted CBT attempts, not static demo arrays.
- User-specific filtering prevents cross-user data leakage.
- Question snapshot usage keeps analysis stable even if question bank changes later.
- Backend validation ensures malformed follow-up requests do not pass through.

## Practical Usage Notes

- If a user has not completed CBT attempts yet, AI Review intentionally shows an empty-state CTA.
- As more CBT sessions are submitted, AI Review becomes richer and more targeted automatically.

## Suggested Next Improvements

1. Add confidence score per reviewed item (based on repeated misses).
2. Add topic-priority ranking in response (most-missed first).
3. Persist saved insights server-side instead of local storage.
4. Add markdown rendering for follow-up response formatting in AI Review page.
