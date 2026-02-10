import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, BrainCircuit, Trophy } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">SmashUTME</span>
          </div>
          <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-slide-in" style={{ animationDelay: '0ms' }}>
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The Smartest Way to Ace JAMB
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
              Master the UTME with <br/>
              <span className="text-primary relative inline-block">
                Precision Learning
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-in" style={{ animationDelay: '200ms' }}>
              Stop guessing. Start mastering. Our AI-powered platform adapts to your learning style, focusing on high-yield topics guaranteed to appear in your exams.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
              <Button onClick={handleLogin} size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                Start Learning for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Syllabus-Based Curriculum</h3>
                <p className="text-muted-foreground">Every topic is strictly aligned with the current JAMB syllabus to ensure you're studying exactly what matters.</p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Study Assistant</h3>
                <p className="text-muted-foreground">Stuck on a concept? Our Gemini-powered AI explains difficult topics in simple terms instantly.</p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">High-Yield Focus</h3>
                <p className="text-muted-foreground">We identify and prioritize topics that appear most frequently in past exams to maximize your score.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SmashUTME. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
