import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";

// Pages
import Dashboard from "@/pages/dashboard";
import SubjectDetail from "@/pages/subject-detail";
import TopicStudy from "@/pages/topic-study";
import Quiz from "@/pages/quiz";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import SignUp from "@/pages/signup";
import Login from "@/pages/login";
import ResetPassword from "@/pages/reset-password";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path ="/dashboard" component={Dashboard}/>
        <Route path="/subjects/:slug" component={SubjectDetail} />
        <Route path="/topics/:slug" component={TopicStudy} />
        <Route path="/topics/:slug/quiz" component={Quiz} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
