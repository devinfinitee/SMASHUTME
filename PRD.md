# SmashUTME Product Requirements Document (PRD)

**Version**: 1.0  
**Last Updated**: April 4, 2026  
**Status**: In Development

---

## 1. Executive Summary

SmashUTME is an intelligent exam preparation platform designed to help Nigerian university applicants succeed in the Unified Tertiary Matriculation Examination (UTME). The platform combines comprehensive question banks, AI-powered tutoring, performance analytics, and sophisticated admin tools to create a complete exam preparation ecosystem.

**Core Value Proposition:**
- **For Students**: Achieve higher UTME scores through AI-guided preparation, realistic mock exams, and personalized learning paths
- **For Educators/Admins**: Manage student progress at scale with real-time analytics, targeted interventions, and content management

---

## 2. Product Vision & Goals

### Vision
Become the #1 trusted UTME preparation platform in Nigeria by providing the most effective, user-friendly, and data-driven exam success solution.

### Primary Goals
1. **Student Success**: Help 80%+ of active users achieve their target scores within 6 months
2. **Scale**: Support 10,000+ concurrent candidates by end of Year 1
3. **Engagement**: Maintain 40%+ weekly active user rate and 2+ hours average weekly session time
4. **Revenue**: Generate ₦50M+ in annual recurring revenue through subscriptions and à-la-carte purchases

### Success Metrics
- Student score improvement: +15 percentile points average
- Retention rate: 65%+ month-over-month
- Net Promoter Score (NPS): 50+
- Platform uptime: 99.5%+

---

## 3. User Personas

### 3.1 Primary: Seun (The Ambitious Candidate)
- **Age**: 16-18 years old
- **Goal**: Gain admission to top-tier universities (UI, UNILAG, OAU)
- **Pain Points**: 
  - Limited access to quality practice materials
  - Unclear which topics need more focus
  - No personalized feedback on performance
- **Needs**: Comprehensive question bank, performance tracking, personalized recommendations

### 3.2 Secondary: Dr. Adebayo (The Admin/Educator)
- **Role**: Head of Finance / Admin Operations at exam prep center
- **Goal**: Manage candidate performance and track revenue/operations
- **Pain Points**:
  - Manual candidate tracking is time-consuming
  - No unified view of student progress
  - Difficulty identifying at-risk candidates
- **Needs**: Dashboard overview, bulk candidate management, analytics, revenue tracking

### 3.3 Tertiary: Chioma (The Parent)
- **Goal**: Ensure child's exam preparation is on track
- **Pain Points**: Limited visibility into progress; unsure if platform is effective
- **Needs**: Progress reports, milestone tracking, performance insights

---

## 4. Feature Specifications

### 4.1 Learner Features

#### 4.1.1 Dashboard
- **Status**: ✅ MVP Complete
- **Overview**: Central hub showing:
  - Recent activity feed
  - Current performance metrics
  - Recommended study topics
  - Upcoming mock exam schedule
  - Quick links to key features

#### 4.1.2 Syllabus & Subject Management
- **Status**: ✅ In Development
- **Features**:
  - Complete UTME syllabus by subject (English, Mathematics, Sciences, etc.)
  - Topic-level breakdown with learning outcomes
  - Related practice questions per topic
  - Syllabus progress tracking

#### 4.1.3 Mock Exams (CBT)
- **Status**: ✅ In Development
- **Features**:
  - Full-length mock exams (4 hours)
  - Partial exams by subject or topic
  - Timed test environment matching real UTME conditions
  - Randomized questions to prevent memorization
  - Instant result feedback with explanations

#### 4.1.4 Question Bank & Practice
- **Status**: ⏳ Planned
- **Features**:
  - 10,000+ verified questions with solutions
  - Filter by subject, topic, difficulty, and year
  - Detailed step-by-step explanations
  - AI-generated alternative explanations
  - Mark for review / Bookmark functionality

#### 4.1.5 AI Tutor Review
- **Status**: ⏳ Planned
- **Features**:
  - Analyze candidate answers and identify misconceptions
  - Generate personalized study recommendations
  - AI-powered "anti-cram" explanations (why answers are correct, not just what)
  - Adaptive difficulty based on performance
  - Real-time question clarification

#### 4.1.6 Performance Analytics
- **Status**: ✅ Foundational
- **Features**:
  - Score trends over time
  - Subject-level breakdown with strengths/weaknesses
  - Percentile ranking vs. all candidates
  - Diagnostic analysis of error patterns
  - Predictive UTME score estimation

#### 4.1.7 Profile & Preferences
- **Status**: ✅ Core Implementation
- **Features**:
  - Target university and course selection
  - Subject combination preferences
  - Study session preferences (time, duration)
  - Learning style preferences
  - Progress milestone tracking

---

### 4.2 Admin Features

#### 4.2.1 Admin Dashboard
- **Status**: ✅ Complete
- **Overview**: Metrics cards and operational summaries:
  - Total candidates active
  - Question bank statistics
  - Mock session activity
  - SmashAI usage metrics
  - Recent activity feed
  - Quick-launch hub for all admin pages

#### 4.2.2 Candidate Management
- **Status**: ✅ Complete
- **Features**:
  - Real-time candidate table with filtering
  - Performance metrics (avg score, high performers, at-risk)
  - Individual candidate dossiers with:
    - Subject scores breakdown
    - Subject strengths and weaknesses
    - Performance trend analysis
    - AI recommendations for intervention
  - Bulk actions: Print manifest, send emails
  - Export candidate data to CSV

#### 4.2.3 Question Bank Management
- **Status**: ✅ Core Implementation
- **Features**:
  - Create/edit individual questions with multiple choice (A-D)
  - Associate with syllabus topics
  - AI-powered explanation generation
  - Batch upload from JSON/CSV
  - Verify and publish workflow
  - Tagging and categorization
  - Track question usage and performance

#### 4.2.4 Content Management (Syllabus Upload)
- **Status**: ✅ In Development
- **Features**:
  - Upload syllabus documents (PDF, Word)
  - Map content to topics and subjects
  - Create topic linking and prerequisites
  - Publish curriculum updates
  - Version control for syllabus

#### 4.2.5 Quiz Results & Analytics
- **Status**: ✅ Foundation
- **Features**:
  - Detailed performance analytics by candidate
  - Subject trend analysis
  - Cohort comparison reports
  - Export reports (PDF, CSV)
  - Identify topics needing intervention

#### 4.2.6 Support Desk
- **Status**: ✅ Complete
- **Features**:
  - Support ticket inbox (categorized)
  - Real-time candidate chat/messages
  - Ticket search and filtering
  - Canned response templates
  - AI suggestion engine for responses
  - Resolution tracking and SLA monitoring
  - Candidate support history

#### 4.2.7 Revenue Engine
- **Status**: ✅ Complete
- **Features**:
  - Gross revenue and key metrics
  - Premium subscriber tracking
  - Plan & pricing manager (edit pricing in real-time)
  - Revenue by product breakdown (Premium, Mock Exams, AI Tokens)
  - Live transaction ledger with status
  - Refund processing
  - Gateway payout tracking
  - AI insights on revenue trends

#### 4.2.8 System Audit & Monitoring
- **Status**: ⏳ Planned
- **Features**:
  - Live transaction activity log
  - System health monitoring
  - User activity audit trail
  - Data integrity checks

---

## 5. User Stories

### 5.1 Learner User Stories

**US1: Practice with Mock Exams**
- As a candidate, I want to take full-length mock exams that simulate real UTME conditions
- So that I can practice time management and become comfortable with the test format
- **Acceptance Criteria**:
  - Mock exam is 4 hours long
  - Questions are presented one at a time
  - Timer is visible and counts down
  - Feedback is provided immediately after submission

**US2: Identify Weak Areas**
- As a candidate, I want to see a detailed breakdown of my strengths and weaknesses
- So that I can focus my study time on topics where I struggle
- **Acceptance Criteria**:
  - Dashboard shows subject-level performance
  - Weak topics are clearly marked
  - Recommended study modules are suggested

**US3: Get AI Explanations**
- As a candidate, I want AI-powered explanations for questions I got wrong
- So that I understand why I made the mistake and learn the correct approach
- **Acceptance Criteria**:
  - Explanations are detailed and easy to understand
  - Multiple explanation approaches are available
  - Explanations include common misconceptions

---

### 5.2 Admin User Stories

**US4: Monitor Student Progress**
- As an admin, I want a real-time view of all candidate performance metrics
- So that I can identify at-risk candidates and intervene early
- **Acceptance Criteria**:
  - Dashboard shows candidate statistics updated in real-time
  - I can filter candidates by status (At Risk, Pending, Active)
  - I can click on any candidate to see their detailed profile

**US5: Manage Question Bank**
- As an admin, I want to upload and manage questions in bulk
- So that I can quickly populate the question bank with verified content
- **Acceptance Criteria**:
  - I can upload questions via JSON or CSV
  - Questions are validated before insertion
  - I can see uploadorbit status and any errors

**US6: Track Revenue**
- As an admin, I want to see revenue metrics and transaction history
- So that I can monitor the financial health of the platform
- **Acceptance Criteria**:
  - Revenue dashboard shows key metrics (gross revenue, active subscribers)
  - Transaction ledger shows all payments with status
  - I can filter transactions by date range or status

---

## 6. System Requirements

### 6.1 Functional Requirements
- [ ] User authentication and authorization
- [ ] Question database with 10,000+ items
- [ ] Real-time mock exam engine
- [ ] AI-powered response generation
- [ ] Performance analytics and reporting
- [ ] Payment processing integration
- [ ] Email notification system
- [ ] Admin audit logging

### 6.2 Non-Functional Requirements
- **Performance**: Page load < 2 seconds, exam interface < 500ms interaction latency
- **Availability**: 99.5% uptime SLA
- **Scalability**: Support 10,000+ concurrent users
- **Security**: End-to-end encryption for sensitive data, GDPR/CCPA compliance
- **Accessibility**: WCAG 2.1 AA compliance

---

## 7. Technical Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, TypeScript, Wouter, Tailwind CSS |
| **UI Library** | shadcn/ui, Lucide React |
| **State Management** | React Query (server state), React Context (client state) |
| **Backend** | *(TBD)* Node.js/Express or Python/FastAPI |
| **Database** | *(TBD)* PostgreSQL recommended |
| **Auth** | *(TBD)* JWT or OAuth 2.0 |
| **AI/ML** | *(TBD)* GPT-4 or similar LLM API |
| **Payment** | Paystack, Flutterwave (Nigeria-friendly) |

---

## 8. Roadmap

### Phase 1: MVP (Q2 2026) - ✅ In Progress
- ✅ Learner dashboard and navigation
- ✅ Basic mock exam functionality
- ✅ Question bank (admin side)
- ✅ Performance tracking
- ✅ Admin dashboard and management tools
- ⏳ Support Desk
- ⏳ Revenue tracking

### Phase 2: AI Integration (Q3 2026)
- AI-powered explanations
- Adaptive difficulty
- Predictive score modeling
- Personalized study recommendations
- Chatbot support

### Phase 3: Scale & Optimization (Q4 2026)
- Performance optimization
- Mobile app (React Native)
- Offline mode
- Advanced analytics
- Cohort analysis

### Phase 4: Community & Engagement (Q1 2027)
- Peer study groups
- Leaderboards
- Gamification (badges, rewards)
- Social sharing
- Success stories

---

## 9. Success Criteria & KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Monthly Active Users (MAU) | 5,000+ | Google Analytics, Firebase |
| User Retention (30-day) | 65%+ | Cohort analysis |
| Average Session Duration | 2+ hours/week | User analytics |
| Score Improvement | +15 percentile | Pre/post analytics |
| Net Promoter Score | 50+ | NPS survey |
| System Uptime | 99.5%+ | Uptime monitoring |
| Page Load Time | <2 seconds | Web vitals |
| Support Response Time | <2 hours | Support queue metrics |

---

## 10. Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Poor adoption by students | High | Medium | Strong UX testing, marketing, influencer partnerships |
| Technical scaling issues | High | Medium | Load testing, CDN, auto-scaling infrastructure |
| Inaccurate AI explanations | High | Low | Human review process, feedback loop, continuous training |
| Competition from established players | Medium | High | Differentiation on UX, local focus, partnerships |
| Payment processor issues | Medium | Low | Multiple payment partners, fallback options |
| Data privacy concerns | High | Low | GDPR/CCPA compliance, clear privacy policy, encryption |

---

## 11. Constraints & Assumptions

### Assumptions
- Students have basic internet connectivity (3G+)
- Target users are primarily mobile-first
- Students prefer studying in evening hours (5 PM - 11 PM)
- Parents will contribute to costs if value is clear
- UTME syllabus remains relatively stable

### Constraints
- Development timeline: 12 months MVP
- Budget: *(to be specified)*
- Team size: *(to be specified)*
- Server capacity: Initial 5,000 concurrent users
- Question bank: Starting with 5,000 verified questions

---

## 12. Out of Scope (v1)

- Mobile app (web-responsive initially)
- Offline mode
- Video tutorials / Recorded lectures
- Live class sessions
- Physical centers / Franchise model
- International expansion

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **UTME** | Unified Tertiary Matriculation Examination (Nigerian university entrance exam) |
| **CBT** | Computer-Based Test (digital exam format) |
| **Mock Exam** | Practice exam simulating real exam conditions |
| **AI Tutor** | Artificial intelligence-powered personalized learning assistant |
| **Premium Tier** | Subscription tier with unlimited access to all features |
| **SLA** | Service Level Agreement (uptime commitment) |

---

## 14. Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | *(To be assigned)* | | |
| Engineering Lead | *(To be assigned)* | | |
| Business Stakeholder | *(To be assigned)* | | |

---

**Document Version History:**
- v1.0 - April 4, 2026 - Initial PRD creation

