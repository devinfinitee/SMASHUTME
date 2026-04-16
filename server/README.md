# SmashUTME Express Server

Standalone Express backend for this project. The API runs independently from the frontend.

## Project structure (MVC)

- `index.js`: server bootstrap
- `src/app.js`: app setup and middleware registration
- `src/routes/`: route definitions
- `src/controllers/`: controller logic
- `src/models/`: data/model layer
- `src/middlewares/`: centralized middleware

## Setup

From the `server` folder:

1. `npm install`
2. copy `.env.example` to `.env`

## Security middleware enabled

- `helmet`: secure HTTP headers
- `express-rate-limit`: API throttling
- `hpp`: HTTP parameter pollution protection
- `express-mongo-sanitize`: blocks Mongo operator injection in input
- `compression`: gzip compression
- `cookie-parser`: cookie parsing for auth/session work
- `morgan`: structured request logging

## Run in development

From the `server` folder:

1. `npm run dev`

## Run in production mode

From the `server` folder:

1. `npm start`

## Environment variables

Copy this and customize if needed:

- `server/.env.example` -> `server/.env`

### Available variables

- `PORT`: Port for the API server (default: `4000`)

## Endpoints

- `GET /api/v1/system/status`
- `GET /api/v1/system`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/subjects`
- `GET /api/v1/subjects/:slug`
- `GET /api/v1/topics/:slug`
- `PATCH /api/v1/topics/:slug/progress`
- `POST /api/v1/quiz/sessions`
- `POST /api/v1/quiz/sessions/:sessionId/submit`
- `GET /api/v1/candidates`
- `GET /api/v1/candidates/:candidateId`
- `GET /api/v1/admin/support/tickets`
- `GET /api/v1/admin/revenue/summary`
- `POST /api/v1/ai/explain`

Legacy compatibility routes are also mounted under `/api/*`.
