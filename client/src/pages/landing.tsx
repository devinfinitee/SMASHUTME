import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, BrainCircuit, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import smashutmeLogo from "@/assets/smashutme-logo.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center overflow-visible py-4">
            <img src={smashutmeLogo} alt="SmashUTME" className="w-12 h-12 object-left-top object-cover scale-[6] origin-left" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/about")} className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">
              About
            </button>
            <button onClick={() => setLocation("/contact")} className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">
              Contact
            </button>
            <Button onClick={() => setLocation("/signup")} className="rounded-full">
              Start Preparing Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary-foreground mb-8 animate-slide-in" style={{ animationDelay: '0ms' }}>
              <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
              Built for serious UTME candidates.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
              Smash Your UTME <br/>
              <span className="text-primary relative inline-block">
                With Confidence.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-in" style={{ animationDelay: '200ms' }}>
              Structured syllabus. High-yield topics. Smart practice.<br />
              Everything you need to score higher in UTME — in one focused platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
              <Button onClick={() => setLocation("/signup")} size="lg" className="rounded-full">
                Start Preparing Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <a href="#subjects">
                <Button size="lg" variant="secondary" className="rounded-full">
                  View Subjects
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="subjects" className="py-24 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Why Students Choose SmashUTME</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Structured by Official Syllabus</h3>
                <p className="text-muted-foreground">No random reading. Every subject is organized according to the official UTME syllabus so you focus only on what matters.</p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-foreground flex items-center justify-center mb-6">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">High-Yield Topics First</h3>
                <p className="text-muted-foreground">We highlight the most tested areas so you don’t waste time on low-impact topics.</p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Practice Like the Real CBT</h3>
                <p className="text-muted-foreground">Timed questions. Instant feedback. Clear explanations.</p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart AI Assistance</h3>
                <p className="text-muted-foreground">Stuck on a concept? Get simple, exam-focused explanations instantly.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">How SmashUTME Helps You Score Higher</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-all duration-300"><strong className="text-primary">Step 1 — Choose Your Subjects</strong><p className="text-muted-foreground mt-2">Select your UTME subject combination and we personalize your dashboard.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-all duration-300"><strong className="text-primary">Step 2 — Study High-Yield Topics</strong><p className="text-muted-foreground mt-2">Read clean, focused notes designed for UTME success.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-all duration-300"><strong className="text-primary">Step 3 — Practice & Improve</strong><p className="text-muted-foreground mt-2">Take topic-based quizzes and CBT simulations.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-all duration-300"><strong className="text-primary">Step 4 — Track Your Progress</strong><p className="text-muted-foreground mt-2">See your strengths, weaknesses, and improvement over time.</p></div>
            </div>
            <div className="text-center">
              <Button onClick={() => setLocation("/signup")} variant="secondary" className="rounded-full">Create Free Account</Button>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border bg-gradient-to-b from-background to-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">Everything You Need in One Platform</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">📚 <strong>Syllabus-Based Learning</strong><p className="text-muted-foreground mt-2">All topics are organized and easy to navigate.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">🎯 <strong>High-Yield Focus</strong><p className="text-muted-foreground mt-2">We highlight the most important exam areas.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">🧠 <strong>Simple Explanations</strong><p className="text-muted-foreground mt-2">Clear and concise breakdowns for difficult concepts.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">📝 <strong>Topic-Based Quizzes</strong><p className="text-muted-foreground mt-2">Practice after every topic to reinforce learning.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">⏱ <strong>CBT Exam Simulation</strong><p className="text-muted-foreground mt-2">Prepare with timed mock exams like the real UTME.</p></div>
              <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">📈 <strong>Performance Tracking</strong><p className="text-muted-foreground mt-2">Know exactly where you need to improve.</p></div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Preparing for UTME Can Be Overwhelming.</h2>
            <div className="text-left max-w-xl mx-auto space-y-2 text-muted-foreground mb-8">
              <p>• Too many topics.</p>
              <p>• Too many materials.</p>
              <p>• No clear structure.</p>
              <p>• No way to track progress.</p>
            </div>
            <p className="text-lg">SmashUTME simplifies everything so you can focus on what truly matters — passing.</p>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">What You Gain</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">Clear study direction</div>
              <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-secondary/5 to-transparent shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">Better time management</div>
              <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">Higher confidence</div>
              <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-secondary/5 to-transparent shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">Reduced exam anxiety</div>
              <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">Smarter preparation</div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">SmashUTME Is Perfect For:</h2>
            <div className="space-y-3 text-muted-foreground text-lg">
              <p>• SS3 students preparing for UTME</p>
              <p>• Drop-year candidates rewriting UTME</p>
              <p>• Students who want a more structured approach</p>
              <p>• Anyone serious about scoring higher</p>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Focused. Reliable. Built for Results.</h2>
            <p className="mb-6 text-muted-foreground">SmashUTME is designed to:</p>
            <div className="space-y-2 text-muted-foreground">
              <p>• Keep you focused</p>
              <p>• Eliminate distractions</p>
              <p>• Provide exam-relevant content only</p>
              <p>• Support your preparation journey</p>
            </div>
            <p className="mt-6 font-medium">No noise. Just preparation.</p>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Start Preparing Smarter?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join other serious UTME candidates and take control of your exam preparation today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Button onClick={() => setLocation("/signup")} className="rounded-full">Create Free Account</Button>
              <a href="#subjects">
                <Button variant="secondary" className="rounded-full">Explore Subjects</Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">Free to start. No credit card required.</p>
          </div>
        </section>

        <section className="py-16 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">Don’t Just Study Hard. Study Smart.</h2>
            <p className="text-muted-foreground mb-6">Thousands of students read everything. Top students focus on what matters.</p>
            <p className="font-medium mb-8">SmashUTME helps you focus.</p>
            <Button onClick={() => setLocation("/signup")} variant="secondary" className="rounded-full">Start Free Today</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-sm text-muted-foreground">
          <div>
            <h3 className="font-display font-bold text-xl text-foreground mb-3">SmashUTME</h3>
            <p>SmashUTME helps students prepare smarter for UTME through structured learning, high-yield topics, and smart practice tools.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => setLocation("/about")} className="block hover:text-foreground">About Us</button>
              <button onClick={() => setLocation("/contact")} className="block hover:text-foreground">Contact</button>
              <a href="#subjects" className="block hover:text-foreground">Subjects</a>
              <button onClick={() => setLocation("/login")} className="block hover:text-foreground">Login</button>
              <button onClick={() => setLocation("/signup")} className="block hover:text-foreground">Sign Up</button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block hover:text-foreground">Terms of Use</a>
              <a href="#" className="block hover:text-foreground">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
          © 2026 SmashUTME. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
