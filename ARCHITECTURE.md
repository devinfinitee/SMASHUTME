# SmashUTME System Architecture

**Version**: 1.0  
**Last Updated**: April 4, 2026  
**Author**: Engineering Team

---

## 1. Architecture Overview

SmashUTME follows a **Client-Side SPA (Single Page Application)** architecture with a planned backend microservices structure. The current implementation is frontend-focused with mock data, ready for backend integration.

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser (Client)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React 18 SPA (TypeScript)                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • Router (Wouter)                                   │   │
│  │  • Component Library (shadcn/ui)                     │   │
│  │  • State Management (React Query + Context)          │   │
│  │  • Styling (Tailwind CSS)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Hooks & Services Layer                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • useAuth, useSubjects, useTopics, useAI            │   │
│  │  • Query Client (React Query)                        │   │
│  │  • Utility Functions                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP/JSON
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (TBD)                         │
├─────────────────────────────────────────────────────────────┤
│  • Authentication Service (JWT)                              │
│  • Question Service (CRUD)                                   │
│  • Candidate Service (profiles, progress)                    │
│  • Quiz/Exam Service (execution, grading)                    │
│  • Payment Service (webhook integration)                     │
│  • AI Service (explanation generation)                       │
│  • Analytics Service (reporting)                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  Core Data Layer (TBD)                       │
├─────────────────────────────────────────────────────────────┤
│  • PostgreSQL (primary DB)                                   │
│  • Redis (caching layer)                                     │
│  • File Storage (S3 or similar)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Layered Component Architecture

```
┌─────────────────────────────────────────────────┐
│          Page Components (src/pages/)            │
│  dashboard.tsx, quiz.tsx, admin-dashboard.tsx   │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│      Layout Components (src/components/)        │
│      app-shell.tsx, layout.tsx                  │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│         UI Components (src/components/ui/)      │
│         shadcn/ui components (reusable)        │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│      Custom Hooks (src/hooks/)                  │
│      useAuth, useSubjects, useTopics, useAI     │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│      Utilities & Services (src/lib/)            │
│      queryClient, auth-utils, utils.ts          │
└─────────────────────────────────────────────────┘
```

### 2.2 Directory Structure

```
client/src/
├── components/
│   ├── ui/                    # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── [20+ more components]
│   ├── app-shell.tsx          # Shared layout wrapper for all pages
│   ├── layout.tsx             # Layout utilities
│   ├── ai-helper.tsx          # AI integration component
│   └── subject-card.tsx       # Subject display component
│
├── pages/                     # Page components (route handlers)
│   ├── landing.tsx            # Marketing landing page
│   ├── signup.tsx
│   ├── login.tsx
│   ├── dashboard.tsx          # Main learner dashboard
│   ├── syllabus.tsx
│   ├── cbt.tsx                # Mock exam engine
│   ├── quiz.tsx
│   ├── topic-study.tsx
│   ├── ai-review.tsx
│   ├── profile.tsx
│   ├── admin-dashboard.tsx    # Admin hub
│   ├── candidates.tsx         # Candidate management
│   ├── question-bank.tsx      # Question management
│   ├── support.tsx            # Support desk
│   ├── revenue.tsx            # Revenue tracking
│   ├── content-management.tsx # Syllabus upload
│   ├── quiz-results.tsx
│   └── not-found.tsx
│
├── hooks/                     # Custom React hooks
│   ├── use-auth.ts           # Authentication logic
│   ├── use-subjects.ts       # Subject management
│   ├── use-topics.ts         # Topic queries
│   ├── use-ai.ts             # AI integration
│   ├── use-toast.ts          # Toast notifications
│   └── use-mobile.tsx        # Responsive detection
│
├── lib/                       # Utilities & services
│   ├── queryClient.ts        # React Query configuration
│   ├── auth-utils.ts         # Auth helpers
│   ├── utils.ts              # General utilities
│   └── mockData.ts           # Mock data for development
│
├── types/
│   └── index.ts              # TypeScript type definitions
│
├── App.tsx                    # Main router and app setup
├── main.tsx                   # React entry point
└── index.css                  # Global styles
```

### 2.3 Routing Architecture

**Router**: Wouter (lightweight, modern alternative to React Router)

**Route Organization**:

```typescript
// src/App.tsx - Route registry
const Router = () => (
  <Switch>
    {/* Public routes */}
    <Route path="/" component={Landing} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
    
    {/* User Dashboard routes */}
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/syllabus" component={Syllabus} />
    <Route path="/cbt" component={CBT} />
    
    {/* Admin routes */}
    <Route path="/admin/dashboard" component={AdminDashboard} />
    <Route path="/admin/candidates" component={Candidates} />
    <Route path="/admin/question-bank" component={QuestionBank} />
    
    {/* Fallback */}
    <Route component={NotFound} />
  </Switch>
);
```

See [routes.md](routes.md) for complete route documentation.

---

## 3. Component Architecture

### 3.1 Core Components

#### **AppShell** (`src/components/app-shell.tsx`)
Central layout wrapper used by nearly all pages. Provides:
- Navigation sidebar (responsive)
- Top navigation bar
- Search functionality
- User profile menu
- Route-aware conditional navigation

**Usage Pattern**:
```tsx
// All pages wrap content in AppShell
<AppShell>
  <main className="ml-64">
    {/* Page content */}
  </main>
</AppShell>
```

**Key Features**:
- Conditionally shows admin navigation when on `/admin/*` routes
- Question Bank nav item only visible to admin users
- Responsive design with mobile hamburger menu
- Search placeholder customization per page

#### **UI Components** (`src/components/ui/`)
Reusable shadcn/ui components extensively used across pages:
- Form controls (input, select, checkbox, radio, switch)
- Layout (card, separator, tabs, accordion)
- Dialog/Modal (dialog, drawer, popover)
- Data display (table, badge, progress, skeleton)
- Feedback (alert, toast, tooltip)

**Import Pattern**:
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

### 3.2 Page Component Patterns

#### **Learner Pages** Example (Dashboard)
```tsx
// src/pages/dashboard.tsx
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: subjects } = useSubjects();
  
  return (
    <AppShell searchPlaceholder="Search courses...">
      <main className="ml-64 pt-16">
        {/* Header */}
        {/* KPI Cards */}
        {/* Content Grid */}
      </main>
    </AppShell>
  );
};
```

#### **Admin Pages** Example (Candidates)
```tsx
// src/pages/candidates.tsx
const Candidates: React.FC = () => {
  const [selectedId, setSelectedId] = useState("");
  
  return (
    <AppShell searchPlaceholder="Search candidates...">
      <main className="ml-64">
        {/* Stats Cards */}
        {/* Candidate Table */}
        {/* Dossier Slide-over Panel */}
        {/* Command Ribbon */}
      </main>
    </AppShell>
  );
};
```

---

## 4. State Management

### 4.1 Data Flow

```
┌──────────────────────────────────────────┐
│    React Query (Server State)            │
│  - Queries (fetched data)                │
│  - Mutations (POST/PUT/DELETE)           │
│  - Caching & Synchronization             │
└──────────┬───────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│    Custom Hooks (useSubjects, etc.)      │
│  - Wrapper around React Query            │
│  - Domain-specific business logic        │
└──────────┬───────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│    Components (UI rendering)             │
│  - Consume hooks                         │
│  - Handle local UI state                 │
│  - Respond to user interactions          │
└──────────────────────────────────────────┘
```

### 4.2 State Management Layers

| Layer | Technology | Use Case | Example |
|-------|-----------|----------|---------|
| **Server State** | React Query | API data, caching | `useSubjects()` fetches subjects and caches |
| **Client State** | useState | UI state, forms | `selectedCandidateId`, `showDossier` |
| **Auth State** | useAuth hook | User session | `user`, `logout()` |
| **UI State** | Context (future) | Theme, settings | Dark mode toggle |

### 4.3 Custom Hooks Architecture

**Pattern**: Each custom hook encapsulates domain logic and React Query setup

```tsx
// src/hooks/use-subjects.ts
export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await fetch('/api/subjects');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// src/hooks/use-auth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null);
  
  const logout = () => {
    // Logout logic
    setUser(null);
  };
  
  return { user, logout };
};
```

---

## 5. Data Models & Types

### 5.1 User Model

```typescript
// src/types/index.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'admin' | 'educator';
  avatar?: string;
  createdAt: Date;
  
  // Candidate-specific
  targetUniversity?: string;
  desiredCourse?: string;
  subjectCombination?: string[];
  
  // Admin-specific
  department?: string;
  permissions?: string[];
}

interface Candidate extends User {
  role: 'candidate';
  enrollmentStatus: 'active' | 'inactive' | 'at-risk';
  averageScore: number;
  performanceMetrics: PerformanceMetrics;
}

interface PerformanceMetrics {
  totalMocksTaken: number;
  averagePercentile: number;
  subjectScores: Record<string, number>;
  strengthAreas: string[];
  weaknessAreas: string[];
  lastActivityDate: Date;
}
```

### 5.2 Question Model

```typescript
interface Question {
  id: string;
  subject: string;
  topic: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  aiExplanation?: string; // AI-generated alternative
  difficulty: 'easy' | 'medium' | 'hard';
  year?: number; // UTME year if from past exam
  createdAt: Date;
}
```

### 5.3 Exam Model

```typescript
interface Exam {
  id: string;
  type: 'mock' | 'partial' | 'topic-quiz';
  title: string;
  subject?: string; // For partial exams
  questions: Question[];
  duration: number; // Minutes
  totalQuestions: number;
  createdAt: Date;
}

interface ExamSession {
  id: string;
  candidateId: string;
  examId: string;
  startTime: Date;
  endTime?: Date;
  responses: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  percentile: number;
  subjectBreakdown: Record<string, number>;
}
```

### 5.4 Support Ticket Model

```typescript
interface SupportTicket {
  id: string;
  candidateId: string;
  category: 'question-error' | 'payment' | 'technical' | 'admission-advice';
  title: string;
  description: string;
  messages: TicketMessage[];
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string; // Admin ID
}

interface TicketMessage {
  id: string;
  sender: 'candidate' | 'admin';
  message: string;
  attachments?: string[];
  createdAt: Date;
}
```

---

## 6. Styling Architecture

### 6.1 Tailwind CSS Configuration

**File**: `tailwind.config.ts`

**Key Configurations**:
- Custom color palette (primary: indigo, secondary, tertiary, etc.)
- Custom border radius tokens
- Custom font families (Manrope for headlines, Inter for body)
- Extended spacing and sizing

```typescript
// Color palette mapped to design tokens
const colors = {
  primary: "#1c00bc",           // Main brand color
  "primary-container": "#2b0afa",
  "on-primary": "#ffffff",
  secondary: "#565e74",
  tertiary: "#4c3300",
  "on-tertiary": "#ffffff",
  // ... 30+ design tokens
};
```

### 6.2 Styling Patterns

**Component Scoped Styles** (Tailwind utility classes):
```tsx
<div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm">
  <h3 className="text-lg font-bold text-on-surface font-headline">Title</h3>
</div>
```

**Responsive Design**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Automatically responsive */}
</div>
```

**Dark Mode Ready** (not yet implemented):
```tsx
<div className="bg-white dark:bg-slate-950">
  {/* Supports light/dark mode */}
</div>
```

---

## 7. API Integration Points

### 7.1 Planned Backend Endpoints

```
# Authentication
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

# Questions
GET    /api/questions              (filtered)
POST   /api/questions              (admin)
PUT    /api/questions/:id          (admin)
DELETE /api/questions/:id          (admin)
POST   /api/questions/bulk-import  (admin)

# Candidates
GET    /api/candidates
GET    /api/candidates/:id
PUT    /api/candidates/:id
GET    /api/candidates/:id/performance

# Exams
POST   /api/exams/:examId/start
POST   /api/exams/:sessionId/submit
GET    /api/exams/:sessionId/results

# Support
GET    /api/tickets
POST   /api/tickets
POST   /api/tickets/:id/messages
PATCH  /api/tickets/:id

# Revenue
GET    /api/transactions
GET    /api/revenue/metrics
POST   /api/subscriptions

# AI
POST   /api/ai/generate-explanation
POST   /api/ai/get-recommendation
```

### 7.2 Current State (Mock Data)

Currently using mock data in [src/lib/mockData.ts](./client/src/lib/mockData.ts):
- Fake candidates and subjects
- Static question bank
- Sample exam sessions
- Mock auth flow

**Migration Path**: Replace mock calls with actual API calls when backend is ready.

---

## 8. Performance Optimization

### 8.1 Code Splitting

**Route-based code splitting** (automatic with Vite):
```tsx
// Each route loads only its dependencies
<Route path="/admin/candidates" component={Candidates} />
```

### 8.2 Caching Strategy

**React Query caching**:
- Question bank: 5-minute cache
- User profile: 10-minute cache
- Candidate performance: 30-second cache (frequently updated)

```tsx
staleTime: 5 * 60 * 1000,        // 5 minutes
gcTime: 10 * 60 * 1000,          // Garbage collect after 10 minutes
refetchOnWindowFocus: false,
```

### 8.3 Image Optimization

- User avatars: Use placeholder images or optimized URLs
- Implement lazy loading for images in lists
- Consider CDN for static assets (future)

### 8.4 Bundle Analysis

```bash
npm run build --report  # Generate bundle analysis
```

---

## 9. Security Architecture

### 9.1 Authentication Flow

```
Login Form
    ↓
Credentials → API /auth/login
    ↓
Backend validates → Returns JWT token
    ↓
Store in localStorage / sessionStorage
    ↓
Include in Authorization header for all API calls
    ↓
On token expiry → Refresh endpoint
    ↓
Logout → Clear token + redirect to login
```

### 9.2 Data Protection

- **In Transit**: HTTPS/TLS for all API calls
- **At Rest**: Backend handles encryption (passwords, sensitive data)
- **Frontend**: No storage of sensitive data, use secure storage methods
- **CORS**: Configure backend to allow only trusted origins

### 9.3 Authorization

- **Role-based access control** (RBAC):
  - `candidate` - Can access learner features only
  - `admin` - Full access to admin suite
  - `educator` - Limited admin access

- **Page-level protection**:
```tsx
// Protect admin routes
const adminPagesVisible = location.startsWith("/admin");
if (adminPagesVisible && user?.role !== 'admin') {
  return <Navigate to="/login" />;
}
```

---

## 10. Deployment Architecture

### 10.1 Frontend Deployment (Current)

**Recommended**: Vercel, Netlify, or AWS S3 + CloudFront

```
npm run build
↓
Creates /dist/ folder with optimized static files
↓
Deploy /dist/ to CDN
↓
Configure 404 → /index.html for SPA routing
```

### 10.2 Backend Deployment (TBD)

Planned options:
- Node.js: Heroku, AWS EC2, DigitalOcean
- Python: AWS Lambda, Render
- Database: PostgreSQL on managed service

### 10.3 CI/CD Pipeline (TBD)

```
Git Push
↓
GitHub Actions / GitLab CI
↓
- Lint & type check
- Run tests
- Build production bundle
- Deploy to staging
- Run E2E tests
- Deploy to production
```

---

## 11. Monitoring & Observability

### 11.1 Frontend Monitoring (Future)

- **Error tracking**: Sentry, Rollbar
- **Performance**: Web Vitals, Datadog RUM
- **User analytics**: Google Analytics, Mixpanel
- **Logs**: CloudWatch, ELK Stack

### 11.2 Backend Monitoring (Future)

- **Application metrics**: Prometheus, New Relic
- **Logs**: ELK Stack, Datadog, LogRocket
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Database**: Query performance, connection pooling

---

## 12. Scaling Considerations

### 12.1 Frontend Scaling

✅ Already optimized for:
- Code splitting by route
- Lazy loading components
- Caching with React Query
- CDN-friendly static assets

### 12.2 Backend Scaling (TBD)

Planned architecture:
- **Microservices**: Separate services for auth, questions, exams, AI
- **Load balancing**: Nginx, AWS ELB
- **Database partitioning**: By candidate ID or region
- **Caching layer**: Redis for hot data
- **Message queue**: For async operations (email, AI processing)

---

## 13. Technology Decision Records (ADRs)

### ADR-001: Use Wouter instead of React Router
**Decision**: Use Wouter for routing  
**Rationale**: Lighter bundle size, simpler API, sufficient for SPA needs  
**Status**: Accepted ✅

### ADR-002: Use React Query for server state
**Decision**: Use TanStack React Query  
**Rationale**: Powerful caching, deduplication, automatic refetching  
**Status**: Accepted ✅

### ADR-003: Use shadcn/ui for component library
**Decision**: Use shadcn/ui + Tailwind CSS  
**Rationale**: Composable components, full control, no large dependency footprint  
**Status**: Accepted ✅

### ADR-004: Backend Technology (TBD)
**Options**: Node.js/Express, Python/FastAPI, Rust/Actix  
**Pending**: Team decision based on team expertise  
**Status**: In Review ⏳

---

## 14. Future Enhancements

### Phase 2 & Beyond

- [ ] Implement WebSocket for real-time notifications
- [ ] Add offline support with Service Workers
- [ ] Implement dark mode UI
- [ ] Add E2E testing with Cypress or Playwright
- [ ] Implement analytics dashboard for educators
- [ ] Add peer study groups / collaboration features
- [ ] Mobile app (React Native)
- [ ] Video streaming integration for tutoring
- [ ] Advanced AI features (predictive scoring, content recommendation)

---

## 15. Troubleshooting Guide

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Routes not working | Check route registration in App.tsx, verify path name |
| Styles not applying | Ensure Tailwind classes in tailwind.config.ts, check class spelling |
| Component not rendering | Verify default export, check component import |
| API calls failing | Verify mock data exists, check React Query setup |
| Build fails | Run `npm install`, clear `node_modules`, check TypeScript errors |

---

## 16. Glossary

| Term | Definition |
|------|-----------|
| **SPA** | Single Page Application (client-side routing) |
| **SSR** | Server-Side Rendering (not used in current architecture) |
| **API** | Application Programming Interface (backend endpoints) |
| **JWT** | JSON Web Token (authentication stateless method) |
| **RBAC** | Role-Based Access Control (permission model) |
| **CDN** | Content Delivery Network (edge caching) |

---

**Architecture Version**: 1.0  
**Next Review**: Q3 2026  
**Last Updated**: April 4, 2026

