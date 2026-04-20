# CBT Practice: Functional Flow and Logic

This document explains how the CBT practice feature works end-to-end after implementation.

## Goals

- Make CBT sessions real (not just mock UI state).
- Validate session configuration and submission payloads on backend.
- Support drill and mini-mock workflows.
- Persist session attempts for analytics and traceability.
- Keep frontend and backend validation aligned.

## High-Level Architecture

Frontend (CBT page):
- Collects CBT configuration from user.
- Calls backend to create a session and fetch question set.
- Runs timer and captures answer map/flagged questions.
- Submits session to backend for authoritative scoring.
- Renders post-exam analytics from backend response.

Backend (Quiz controller + model):
- Validates config (`mode`, `questionCount`, `durationMinutes`).
- Resolves subject by `subjectSlug` or `subjectName`.
- Builds question pool from `Question` and `PastQuestion` collections.
- Falls back to synthetic strategy questions when bank is insufficient.
- Persists full session (`QuizSession`) with selected question snapshot.
- Scores answers on submit and returns analytics payload.

## Data Model

File: server/src/models/quizSession.model.js

Main fields:
- `user`: owner of the session.
- `mode`: `drill | mock`.
- `subject` + `subjectLabel`: focused subject metadata.
- `questionCount`, `durationMinutes`, `highYieldOnly`.
- `status`: `in-progress | submitted | expired`.
- `startedAt`, `expiresAt`, `submittedAt`.
- `questions[]`: immutable snapshot used for grading.
- `answers`, `flaggedQuestionIds`.
- `score`, `totalQuestions`, `accuracy`, `timeSpentSeconds`.
- `results[]`: per-question correctness details.

Why snapshot questions?
- Guarantees scoring consistency even if source question bank is edited later.

## Backend Endpoints

### 1) Create Session

Route:
- `POST /api/quiz/sessions`

Validation:
- `mode` must be `drill` or `mock`.
- `questionCount` must be 5 to 120.
- `durationMinutes` must be 5 to 180.
- For drill mode, subject must resolve in DB.

Selection logic:
1. Resolve subject (optional for mock, required for drill).
2. Build topic filter (subject + high-yield if requested).
3. Pull from `Question` and `PastQuestion` collections.
4. Shuffle and slice to requested count.
5. If insufficient questions, generate synthetic fallback questions.
6. Persist `QuizSession` and return question payload.

### 2) Submit Session

Route:
- `POST /api/quiz/sessions/:sessionId/submit`

Validation:
- Session must exist and belong to current authenticated user.
- Session must not already be submitted.
- Answer options normalized to `A|B|C|D` or null.

Scoring logic:
- Compare submitted answer for each question against stored `correctOption`.
- Compute:
  - `score`
  - `accuracy`
  - `subjectBreakdown`
  - `paceSeconds`
  - `percentileLabel`
  - `projectedAggregate`
- Persist final session metrics and per-question result rows.

## Frontend Logic

File: client/src/pages/cbt.tsx

### Session launch
- `initializeSession(...)` posts config to backend.
- Stores `sessionId` and API-provided question set.
- Resets answer/flagged/visited state.
- Starts timer (`remainingSeconds = durationMinutes * 60`).

### Timer behavior
- Runs 1-second interval in step 3.
- Auto-submits when timer reaches zero.

### Answer and navigation behavior
- Supports selecting options, skipping, flagging, and map-jump.
- Tracks answered count and progress in UI.

### Submission behavior
- Posts:
  - `answers` object
  - `flaggedQuestionIds`
  - `timeSpentSeconds`
- Uses backend analytics to render final report card.

## Validation Coverage

Frontend validation:
- Prevents launching drill without selected subject.
- Prevents advancing question without selected option.
- Handles API errors and disabled button states (`Preparing`, `Submitting`).

Backend validation:
- Guards invalid config values.
- Guards non-existent subject in drill mode.
- Guards duplicate submission.
- Guards invalid answer shape/options.
- Uses authenticated user ownership for session access.

## Practical Notes

- If question bank is sparse, synthetic fallback keeps the feature usable.
- As admin uploads more real questions, session quality automatically improves.
- Scoring is backend-authoritative, so users cannot inflate score by client edits.

## Recommended Next Upgrades

1. Add `GET /api/quiz/sessions/history` for real recent history table in CBT hub.
2. Add per-question explanation review endpoint after submission.
3. Add anti-cheat fields (tab switches, inactivity windows, late submit penalties).
4. Add richer analytics (topic-level mastery trend over time).
