# SmashUTME 🚀

**Intelligent exam preparation platform for Nigerian university applicants**

SmashUTME is a comprehensive web application designed to help students prepare for the Unified Tertiary Matriculation Examination (UTME) through interactive mock exams, AI-powered tutoring, and performance analytics. Built with modern web technologies, it provides both learners and administrators with powerful tools for exam success.

## 🎯 Key Features

### For Learners
- **Dashboard**: Centralized hub for accessing all study resources
- **Syllabus Management**: Complete UTME syllabus broken down by subjects
- **Mock Exams**: Full and partial CBT practice tests with real exam conditions
- **AI Tutor**: Smart AI-powered explanations and personalized study recommendations
- **Performance Analytics**: Detailed insights into strengths and weak areas
- **Subject Deep Dive**: In-depth topic study with related quiz sets
- **Profile Management**: Track progress and manage learning preferences

### For Administrators
- **Admin Dashboard**: Command center for all administrative operations
- **Candidate Management**: Real-time candidate profiles, performance tracking, and enrollment oversight
- **Question Bank**: Create, organize, and manage exam questions with AI explanations
- **Content Management**: Upload and manage syllabus content
- **Support Desk**: Handle candidate support tickets and inquiries
- **Quiz Results Analytics**: Track candidate performance and identify trends
- **Revenue Engine**: Monitor subscriptions, payments, and gateway transactions
- **System Auditing**: Live transaction ledger and system monitoring

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18+, TypeScript, Wouter (router) |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Data Fetching** | TanStack React Query (React Query) |
| **UI Components** | Lucide React (icons), Material Symbols |
| **Build Tool** | Vite |
| **Package Manager** | npm / pnpm |

## 📋 Project Structure

```
smashutme/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── ai-helper.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── app-shell.tsx     # Shared layout wrapper
│   │   │   └── subject-card.tsx
│   │   ├── pages/
│   │   │   ├── dashboard.tsx
│   │   │   ├── landing.tsx
│   │   │   ├── quiz.tsx
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── question-bank.tsx
│   │   │   ├── candidates.tsx
│   │   │   ├── support.tsx
│   │   │   ├── revenue.tsx
│   │   │   └── content-management.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-subjects.ts
│   │   │   ├── use-topics.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── auth-utils.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx              # Main router
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── routes.md                      # Route registry
├── README.md                      # This file
├── PRD.md                         # Product requirements
├── ARCHITECTURE.md                # System architecture
└── tailwind.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm 8+ or pnpm 7+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smashutme

# Install dependencies
cd client
npm install

# Or with pnpm
pnpm install
```

### Development

```bash
# Start development server
npm run dev

# Server runs at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Route Registry

All application routes are documented in [routes.md](routes.md). When adding new routes, update this file following the established pattern.

**Quick route overview:**

| Category | Routes |
|----------|--------|
| **Public** | /, /about, /contact, /signup, /login, /reset-password, /onboarding/* |
| **User Dashboard** | /dashboard, /syllabus, /cbt, /ai-review, /profile, /subjects/:slug, /topics/:slug |
| **Admin** | /admin/dashboard, /admin/candidates, /admin/question-bank, /admin/content-management, /admin/quiz-results, /admin/support, /admin/revenue |

See [routes.md](routes.md) for complete details.

## 🏗️ Architecture Overview

This is a client-side React SPA with TypeScript. For detailed architecture information, system design, and data flow diagrams, see [ARCHITECTURE.md](ARCHITECTURE.md).

**Key architectural patterns:**
- **Component-Based UI**: Reusable shadcn/ui components with Tailwind styling
- **Custom Hooks**: Abstractions for auth, data fetching, and state management
- **AppShell Wrapper**: Shared layout component used across user and admin pages
- **Route-Based Navigation**: Conditional sidebar entries based on current route
- **Admin Hub Model**: Centralized dashboard for accessing all admin functions

## 🎮 Core Components

### AppShell (`src/components/app-shell.tsx`)
Shared layout wrapper for consistent navigation across user and admin pages. Conditionally displays navigation items based on route context.

### Pages
- **User Pages**: Dashboard, Syllabus, Quiz, AI Review, Profile, Subject Detail, Topic Study
- **Admin Pages**: Command Dashboard, Candidate Management, Question Bank, Support Desk, Revenue Engine, Content Management

### UI Components
All UI components are imported from `components/ui/` (shadcn/ui library). Customization available through Tailwind CSS and component props.

## 🔐 Authentication

Authentication flow is handled through `hooks/use-auth.ts`. Current implementation includes mock authentication for development. Production implementation should integrate with a backend auth service.

## 📊 Data Management

- **React Query**: Used for server state management, caching, and synchronization
- **Custom Hooks**: `use-subjects`, `use-topics`, `use-auth` for domain-specific logic
- **Context/State**: Client-side state managed within React components

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Design System**: Custom color palette defined in `tailwind.config.ts`
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Configured but not yet implemented

## 🧪 Development Workflow

1. **Create new pages** in `src/pages/`
2. **Register routes** in `src/App.tsx`
3. **Update route registry** in `routes.md`
4. **Use AppShell** wrapper for pages requiring navigation
5. **Leverage existing components** from `src/components/`
6. **Add custom hooks** in `src/hooks/` for reusable logic

## 📝 Code Standards

- **TypeScript**: Strict type checking enabled
- **Component Naming**: PascalCase for components, camelCase for utilities
- **File Organization**: Group related components, hooks, and utilities
- **Imports**: Use path aliases where configured (e.g., `@/components`)

## 🚨 Common Issues & Solutions

### Module not found errors
- Ensure path aliases in `tsconfig.json` match imports
- Check file names and extensions

### Styling not applying
- Verify Tailwind classes are included in `tailwind.config.ts`
- Check component has proper class inheritance

### Component not rendering
- Verify component is exported as default
- Check route in `App.tsx` matches page path

## 📦 Dependencies

### Key Packages
- `react@18+` - UI library
- `wouter` - Lightweight router
- `@tanstack/react-query` - Server state management
- `lucide-react` - Icon library
- `tailwindcss` - Utility CSS
- `typescript` - Type safety

See `client/package.json` for complete dependency list and versions.

## 🔄 CI/CD & Deployment

*(To be configured)*
- Build: `npm run build`
- Test: `npm run test` *(to be implemented)*
- Deployment: *(platforming TBD)*

## 📞 Support & Contact

For issues, feature requests, or contributions:
1. Create an issue in the repository
2. Follow the project's contribution guidelines
3. Submit pull requests for review

## 📄 License

*(Add license information)*

## 🙏 Acknowledgments

- Built with React, Tailwind CSS, and shadcn/ui
- Inspired by modern ed-tech platforms
- Designed for Nigerian UTME applicants

---

**Last Updated**: April 4, 2026  
**Version**: 1.0.0
