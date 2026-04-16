import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import DashboardNew from "@/pages/dashboard-new";
import SubjectDetail from "@/pages/subject-detail";
import TopicStudy from "@/pages/topic-study";
import Quiz from "@/pages/quiz";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import SignUp from "@/pages/signup";
import Login from "@/pages/login";
import AdminLogin from "@/pages/admin-login";
import ResetPassword from "@/pages/reset-password";
import OnboardingTarget from "@/pages/onboarding-target";
import OnboardingSubjects from "@/pages/onboarding-subjects";
import OnboardingBaseline from "@/pages/onboarding-baseline";
import OnboardingReview from "@/pages/onboarding-review";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import SyllabusPage from "./pages/syllabus";
import AiReviewPage from "@/pages/ai-review.tsx";
import CbtPage from "@/pages/cbt";
import AdminDashboard from "@/pages/admin-dashboard";
import ContentManagement from "./pages/content-management";
import QuizResults from "@/pages/quiz-results";
import QuestionBank from "./pages/question-bank";
import Support from "./pages/support";
import Revenue from "./pages/revenue";
import Candidates from "./pages/candidates";

function ScrollToTopOnRouteChange() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/onboarding/target" component={OnboardingTarget} />
      <Route path="/onboarding/subjects" component={OnboardingSubjects} />
      <Route path="/onboarding/baseline" component={OnboardingBaseline} />
      <Route path="/onboarding/review" component={OnboardingReview} />
      <Route path="/dashboard" component={DashboardNew} />
      <Route path="/syllabus" component={SyllabusPage} />
      <Route path="/cbt" component={CbtPage} />
      <Route path="/ai-review" component={AiReviewPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/content-management" component={ContentManagement} />
      <Route path="/admin/quiz-results" component={QuizResults} />
      <Route path="/admin/question-bank" component={QuestionBank} />
      <Route path="/admin/support" component={Support} />
      <Route path="/admin/revenue" component={Revenue} />
      <Route path="/admin/candidates" component={Candidates} />
      <Route path="/subjects/:slug" component={SubjectDetail} />
      <Route path="/topics/:slug" component={TopicStudy} />
      <Route path="/topics/:slug/quiz" component={Quiz} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTopOnRouteChange />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
