# Models

This folder contains the backend data models for SmashUTME.

## Collections

- `User`: learner/candidate account, onboarding data, and dashboard snapshot
- `Admin`: admin account, role, permissions, and operational scope
- `Subject`: UTME subjects registry
- `Topic`: subject topics and syllabus content
- `Question`: practice and bank questions
- `PastQuestion`: archived UTME past questions

## Relationships

- `Subject` virtual-populates `topics`
- `Topic` references `subject`
- `Topic` virtual-populates `questions` and `pastQuestions`
- `Question` references `subject` and `topic`
- `PastQuestion` references `subject`, `topic`, and can map back to `Question`

Use these models as the foundation for future controllers and services.
