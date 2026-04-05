# Routes

Last updated: 2026-04-04

Whenever a new route is added to the app, append it to this file with the same format.

## Public Routes

| Route | Page | Purpose |
| --- | --- | --- |
| / | Landing | Public marketing homepage |
| /about | About | About page |
| /contact | Contact | Contact/support page |
| /signup | Sign Up | Account registration |
| /login | Login | User sign-in |
| /reset-password | Reset Password | Password recovery |
| /onboarding/target | Onboarding Target | Set target institution and course |
| /onboarding/subjects | Onboarding Subjects | Select study subjects |
| /onboarding/baseline | Onboarding Baseline | Capture baseline study habits |
| /onboarding/review | Onboarding Review | Review onboarding choices |

## User Dashboard Routes

| Route | Page | Purpose |
| --- | --- | --- |
| /dashboard | DashboardNew | Main learner dashboard |
| /syllabus | SyllabusPage | Subjects hub |
| /cbt | CbtPage | CBT practice center |
| /ai-review | AiReviewPage | AI review flow |
| /profile | Profile | User profile page |
| /subjects/:slug | SubjectDetail | Subject detail and topic listing |
| /topics/:slug | TopicStudy | Topic study page |
| /topics/:slug/quiz | Quiz | Topic quiz page |

## Admin Routes

| Route | Page | Purpose |
| --- | --- | --- |
| /admin/dashboard | AdminDashboard | Admin command center |
| /admin/content-management | ContentManagement | Syllabus upload studio |
| /admin/quiz-results | QuizResults | Quiz results and analytics |
| /admin/question-bank | QuestionBank | Past question engine |
| /admin/candidates | Candidates | Candidate management and profiles |
| /admin/support | Support | Support desk for candidate issues |
| /admin/revenue | Revenue | Revenue tracking and pricing management |

## Fallback Route

| Route | Page | Purpose |
| --- | --- | --- |
| * | NotFound | Catch-all fallback for unknown routes |