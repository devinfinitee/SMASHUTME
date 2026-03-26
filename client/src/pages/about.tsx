import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Target, Users, Zap, Award, ArrowRight } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.png";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center overflow-visible py-4">
            <img src={smashutmeLogo} alt="SmashUTME" className="w-12 h-12 object-left-top object-cover scale-[6] origin-left" />
          </button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/contact")} className="rounded-full">
              Contact Us
            </Button>
            <Button onClick={() => setLocation("/signup")} className="rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              About SmashUTME
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering Nigerian students to ace their UTME exams through structured, 
              intelligent preparation that actually works.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Every year, thousands of bright Nigerian students struggle with UTME preparation —
                  not because they lack intelligence, but because they lack structure, focus, and 
                  personalized guidance.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  SmashUTME was built to change that. We provide a structured, topic-by-topic 
                  learning path that breaks down the JAMB syllabus into manageable, high-yield 
                  study sessions.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our goal is simple: help every student reach their full potential and gain 
                  admission into their dream institution.
                </p>
              </div>
              <div className="relative">
                <div className="bg-primary rounded-2xl p-8 shadow-2xl shadow-primary/25">
                  <div className="space-y-6 text-primary-foreground">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-foreground/20 rounded-lg p-2">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Focused Learning</h3>
                        <p className="text-primary-foreground/90">Master one topic at a time with our structured approach</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-foreground/20 rounded-lg p-2">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Smart Practice</h3>
                        <p className="text-primary-foreground/90">AI-powered questions that adapt to your level</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-foreground/20 rounded-lg p-2">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Proven Results</h3>
                        <p className="text-primary-foreground/90">Join thousands scoring 250+ in UTME</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">Student-Centered</h3>
                  <p className="text-muted-foreground">
                    Every feature we build starts with one question: "How does this help the student?"
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">Quality First</h3>
                  <p className="text-muted-foreground">
                    We don't cut corners. Every topic, question, and explanation meets our high standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We leverage AI and modern learning science to give you an edge in your preparation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                SmashUTME was born from a simple observation: most UTME prep platforms overwhelm 
                students with thousands of random questions but provide little structure or guidance 
                on what to study and when.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Our founders, having gone through the UTME journey themselves, knew there had to be 
                a better way. They envisioned a platform that would break down the massive JAMB 
                syllabus into bite-sized, manageable topics — making exam preparation less 
                overwhelming and more effective.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, SmashUTME serves thousands of students across Nigeria, helping them transform 
                their UTME preparation from chaotic cramming to structured, confident learning.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
              Ready to Transform Your UTME Preparation?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of students who are preparing smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => setLocation("/signup")} 
                size="lg" 
                variant="secondary"
                className="rounded-full"
              >
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => setLocation("/contact")} 
                size="lg" 
                variant="outline"
                className="rounded-full bg-background text-foreground border-border hover:bg-muted"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 SmashUTME. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground">
                Home
              </button>
              <button onClick={() => setLocation("/about")} className="text-muted-foreground hover:text-foreground">
                About
              </button>
              <button onClick={() => setLocation("/contact")} className="text-muted-foreground hover:text-foreground">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
