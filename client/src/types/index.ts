// Basic types for the frontend-only version

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  status?: string;
  authProvider?: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  targetInstitution?: string | null;
  targetCourse?: string | null;
  studyTime?: string | null;
  onboardingCompleted?: boolean;
  dashboard?: DashboardSnapshot | null;
  selectedSubjectLabels?: string[];
  selectedSubjects?: DashboardSubjectRef[];
  subjectProgress?: SubjectProgressEntry[];
}

export interface Subject {
  id: number;
  name: string;
  slug: string;
  icon: string;
  topics?: Topic[];
}

export interface Topic {
  _id?: string;
  id?: string | number;
  subjectId?: number;
  name: string;
  slug: string;
  subject?: {
    _id?: string;
    id?: string;
    name?: string;
    slug?: string;
    icon?: string;
  } | string;
  referenceBook?: string;
  jambFocus?: string[];
  overview?: string;
  learningGoals?: string[];
  prerequisites?: string[];
  relatedTopics?: string[];
  revisionPriority?: "low" | "medium" | "high" | "critical";
  sections?: TopicSection[];
  isHighYield: boolean;
  content?: string;
  summary?: string;
  commonTraps?: string[];
  highYieldSummary?: string;
  keyDefinitions?: string[];
  simpleExplanation?: string;
  importantFormulasFacts?: string[];
  aiExplanations?: {
    whyCorrectIsCorrect?: string;
    paragraphs?: string[];
    whyOthersAreWrong?: string;
    simpleBreakdown?: string;
  };
}

export interface TopicSection {
  sectionTitle: string;
  sectionSlug?: string;
  order?: number;
  definition?: string;
  explanation?: string;
  aiExplanation?: {
    whyCorrectIsCorrect?: string;
    whyOthersAreWrong?: string;
    simpleBreakdown?: string;
    paragraphs?: string[];
  };
  examples?: string[];
  jambPoint?: string;
  commonMistakes?: string[];
  quickTip?: string;
  illustrationImageUrl?: string;
  mnemonic?: string;
  relatedSections?: string[];
  tags?: string[];
}

export interface Question {
  id: number;
  topicId: number;
  content: string;
  options: Record<string, string>;
  correctOption: string;
  explanation?: string;
}

export interface DashboardSnapshot {
  projectedScore: number;
  percentile: number;
  streakDays: number;
  totalDrillsCompleted: number;
  totalTimeSpentMinutes: number;
  averageAccuracy: number;
  highYieldTopicsCount: number;
  studyMomentumPercent: number;
  completedQuestions: number;
  weakAreas: string[];
  lastUpdatedAt?: string | Date | null;
}

export interface DashboardSubjectRef {
  id: string;
  name?: string | null;
  slug?: string | null;
  icon?: string | null;
}

export interface SubjectProgressEntry {
  subject: string | DashboardSubjectRef;
  proficiency: number;
  questionsAnswered: number;
  questionsCorrect: number;
  accuracy: number;
  topicsCovered: number;
  status: "weak" | "on-track" | "mastered";
  timeSpentMinutes: number;
  lastStudiedAt?: string | Date | null;
}

export interface DashboardSubjectCard {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  proficiency: number;
  status: "compulsory" | "mastered" | "weak" | "on-track";
  color: string;
  bgColor: string;
  questionsAnswered?: number;
  questionsCorrect?: number;
  topicsCovered?: number;
  accuracy?: number;
  timeSpentMinutes?: number;
  lastStudiedAt?: string | null;
}

export interface DashboardRecentActivity {
  id: string;
  type: "drill" | "mock";
  title: string;
  description: string;
  actionLabel: string;
  iconKey?: "drill" | "mock";
  createdAt?: string | Date;
}

export interface DashboardOverview {
  profile: {
    id: string;
    name?: string | null;
    fullName?: string | null;
    targetInstitution?: string | null;
    targetCourse?: string | null;
    studyTime?: string | null;
    onboardingCompleted?: boolean;
    avatarUrl?: string | null;
  };
  dashboard: DashboardSnapshot;
  subjectCards: DashboardSubjectCard[];
  recentActivities: DashboardRecentActivity[];
}

export interface UserProgress {
  id: number;
  userId: string;
  topicId: number;
  status: "not_started" | "in_progress" | "completed";
  lastStudiedAt: Date;
}