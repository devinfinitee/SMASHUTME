import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, FileCheck, MonitorSmartphone, Stethoscope, Users, Filter, Timer, Brain, Map } from "lucide-react";
import { useLocation } from "wouter";
import smashutmeLogo from "@/assets/smashutme-logo.png";
import heroImage from "@/assets/hero.png";

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
        <section className="relative pt-14 pb-14 md:pt-20 md:pb-18 overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_18%_0%,hsl(var(--secondary)/0.25),transparent_44%),radial-gradient(circle_at_86%_0%,hsl(var(--primary)/0.2),transparent_36%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-5">
                  <span className="mr-2">●</span>UTME 2026 Focus Mode
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight font-display font-bold text-foreground mb-5">
                  JAMB is not just about reading.
                  <span className="block text-primary mt-2">It is about reading the right things.</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-snug mb-6 max-w-xl">
                  Stop wasting time on low-yield topics. SmashUTME gives you a focused system built around <strong className="text-foreground">High-Yield Topics</strong>, <strong className="text-foreground">CBT Practice</strong>, and exam-day confidence.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                  <Button
                    onClick={() => setLocation("/signup")}
                    size="lg"
                    className="rounded-full animate-[pulse_2.2s_ease-in-out_infinite]"
                  >
                    Start Preparing Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setLocation("/login")}
                    size="lg"
                    variant="secondary"
                    className="rounded-full"
                  >
                    Try CBT Practice Demo
                  </Button>
                </div>

                <div className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary-foreground">
                  <p className="font-semibold">Built by a Medical Student at LAUTECH who cracked UTME.</p>
                  <p className="text-secondary-foreground/90">I built the tool I wish I had.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-5 -right-3 w-28 h-28 rounded-full bg-secondary/25 blur-2xl" />
                <div className="absolute -bottom-5 -left-3 w-28 h-28 rounded-full bg-primary/25 blur-2xl" />
                <div className="relative rounded-3xl border border-border/70 bg-card shadow-2xl overflow-hidden">
                  <div className="h-10 border-b border-border/70 bg-muted/60 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <p className="text-xs text-muted-foreground ml-3">SmashUTME Study View</p>
                  </div>
                  <img
                    src={heroImage}
                    alt="Nigerian students preparing for UTME in a focused study environment"
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-background px-3 py-2 font-medium flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                2026 JAMB Syllabus Aligned
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2 font-medium flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4 text-primary" />
                100% CBT Simulation Accuracy
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2 font-medium flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                Built by Medical Professionals
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Beta Tested by 50+ Candidates
              </div>
            </div>
          </div>
        </section>

        <section id="subjects" className="py-20 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                Most students fail because they study hard. You will pass because you study smart.
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                This is the High-Yield System behind SmashUTME.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <article className="group p-6 rounded-2xl bg-background border border-border shadow-md hover:-translate-y-2 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    The Problem: Topic Overload
                  </span>
                  <Filter className="w-5 h-5 text-primary mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">The SmashUTME Fix: The 80/20 Topic Filter</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We analyzed 10+ years of JAMB past questions to isolate the 20% of topics that appear in 80% of exams.
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Result: You stop wasting time on filler topics and focus on what actually scores marks.
                </p>
              </article>

              <article className="group p-6 rounded-2xl bg-background border border-border shadow-md hover:-translate-y-2 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    The Problem: Time Runs Out
                  </span>
                  <Timer className="w-5 h-5 text-primary mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">The SmashUTME Fix: CBT Speed Master</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  A real-time pacing engine tracks your Seconds Per Question (SPQ) inside every mock exam.
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Result: Your brain learns to maintain exam pace and finish with around 15 minutes to spare.
                </p>
              </article>

              <article className="group p-6 rounded-2xl bg-background border border-border shadow-md hover:-translate-y-2 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    The Problem: Forgetting Fast
                  </span>
                  <Brain className="w-5 h-5 text-primary mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">The SmashUTME Fix: The Anti-Cram Engine</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We teach from first principles, explaining the logic behind each answer instead of just showing option A.
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Result: Deep conceptual understanding that stays with you till exam day.
                </p>
              </article>

              <article className="group p-6 rounded-2xl bg-background border border-border shadow-md hover:-translate-y-2 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    The Problem: No Clear Roadmap
                  </span>
                  <Map className="w-5 h-5 text-primary mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">The SmashUTME Fix: The Medical Student Blueprint</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  The same schedule, high-yield notes, and shortcuts used to secure admission into LAUTECH Medicine.
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Result: A proven roadmap from late preparation to medical-school-level outcomes.
                </p>
              </article>
            </div>

            <p className="text-center text-sm mt-8 text-muted-foreground">
              Ready to stop reading randomly?{" "}
              <button
                onClick={() => setLocation("/signup")}
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Start Your High-Yield Journey
              </button>
            </p>
          </div>
        </section>

        <section className="py-20 border-b border-border bg-gradient-to-b from-background via-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                Step Inside Your New Study Command Center.
              </h2>
              <p className="text-muted-foreground text-lg mt-3">
                The system you were promised is already mapped out for you: what to study, how to perform under pressure, and when you are truly ready.
              </p>
            </div>

            <div className="space-y-10">
              <article className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-3xl border border-border bg-card/80 p-6 md:p-8 shadow-lg">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">1. The High-Yield Topic Hub</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Stop guessing what to read first.</h3>
                  <p className="text-muted-foreground text-lg leading-snug mb-5">
                    Stop guessing. See exactly which topics carry 70% of the marks in Chemistry, Physics, and Biology.
                  </p>
                  <Button onClick={() => setLocation("/signup")} className="rounded-full">
                    View Your Subject Weights
                  </Button>
                </div>

                <div className="rounded-2xl border border-border bg-background shadow-md overflow-hidden">
                  <div className="h-10 border-b border-border/70 bg-muted/60 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <p className="text-xs text-muted-foreground ml-2">High-Yield Topic Hub</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
                      <p className="font-medium">Organic Chemistry</p>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">12% of Exam</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
                      <p className="font-medium">Chemical Equilibrium</p>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">8% of Exam</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
                      <p className="font-medium">Periodic Trends</p>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground">7% of Exam</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-3xl border border-border bg-card/80 p-6 md:p-8 shadow-lg">
                <div className="order-2 lg:order-1 rounded-2xl border border-border bg-background shadow-md overflow-hidden">
                  <div className="h-10 border-b border-border/70 bg-muted/60 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <p className="text-xs text-muted-foreground ml-2">CBT Simulation Engine</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question 18 of 60</p>
                      <p className="text-xs font-semibold text-primary">SPQ: 37s</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 mb-3">
                      <p className="font-medium mb-2">Chemistry: Which process favors ammonia yield in the Haber process?</p>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <p className="rounded-lg border border-border px-3 py-2">A. High temperature, low pressure</p>
                        <p className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">B. Moderate temperature, high pressure</p>
                        <p className="rounded-lg border border-border px-3 py-2">C. Low temperature, low pressure</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 flex items-center justify-between text-sm">
                      <p className="font-medium text-amber-800">Pacing Timer: 44s</p>
                      <span className="text-red-600 font-semibold">Too Slow</span>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">2. The CBT Simulation Engine</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Train with real exam pressure.</h3>
                  <p className="text-muted-foreground text-lg leading-snug mb-5">
                    Experience the real JAMB interface. No surprises on exam day.
                  </p>
                  <Button onClick={() => setLocation("/signup")} variant="secondary" className="rounded-full">
                    Enter Exam Mode
                  </Button>
                </div>
              </article>

              <article className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-3xl border border-border bg-card/80 p-6 md:p-8 shadow-lg">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">3. The Smart Progress Tracker</p>
                  <h3 className="text-2xl font-display font-bold mb-3">See confidence grow in numbers.</h3>
                  <p className="text-muted-foreground text-lg leading-snug mb-5">
                    Don't just read. Track your mastery. Know exactly when you're ready for the 300+ score.
                  </p>
                  <Button onClick={() => setLocation("/dashboard")} className="rounded-full">
                    Open Your Progress Tracker
                  </Button>
                </div>

                <div className="rounded-2xl border border-border bg-background shadow-md overflow-hidden">
                  <div className="h-10 border-b border-border/70 bg-muted/60 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <p className="text-xs text-muted-foreground ml-2">Smart Progress Tracker</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Chemistry Mastery</p>
                        <p className="text-primary font-semibold">82%</p>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[82%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Admission Probability</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-display font-bold text-primary">73%</p>
                        <p className="text-sm text-muted-foreground">Target Score: 300+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-border bg-[#0f172a] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300 mb-3">Authority and Outcomes</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold">The SmashUTME Advantage</h2>
              <p className="text-slate-300 mt-3 text-lg">
                See the difference between random prep and a structured medical-grade system.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300 mb-4">Traditional Prep</p>
                <ul className="space-y-3 text-slate-100">
                  <li className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3">Random Reading</li>
                  <li className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3">Time Management Struggles</li>
                  <li className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3">Cramming Past Questions</li>
                  <li className="rounded-lg border border-rose-400/50 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200">220-240 Average</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-4">SmashUTME Prep</p>
                <ul className="space-y-3 text-emerald-50">
                  <li className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-4 py-3">High-Yield Focus</li>
                  <li className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-4 py-3">Seconds-Per-Question (SPQ) Mastery</li>
                  <li className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-4 py-3">Conceptual Understanding</li>
                  <li className="rounded-lg border border-yellow-300/60 bg-yellow-400/20 px-4 py-3 text-yellow-200 font-bold">290-340+ Target</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="py-18 border-b border-border bg-gradient-to-b from-background to-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Curriculum Deep Dive</h2>
              <p className="text-lg text-muted-foreground">We don't just give you questions. We give you the Blueprint.</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Subject Preview</p>
                  <h3 className="text-2xl font-display font-bold">Chemistry</h3>
                </div>
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  Probability of Appearance
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Separation Techniques</p>
                    <p className="text-sm font-semibold text-primary">92%</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200">High-Yield</span>
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Chemical Equilibrium</p>
                    <p className="text-sm font-semibold text-primary">65%</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200">Medium-Yield</span>
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[65%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Organic Chemistry</p>
                    <p className="text-sm font-semibold text-primary">88%</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200">High-Yield</span>
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[88%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
              The UTME is competitive. Don't leave your admission to chance.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the students using the Medical Student's Blueprint to secure their spot.
            </p>
            <Button onClick={() => setLocation("/signup")} size="lg" className="rounded-full animate-[pulse_2.2s_ease-in-out_infinite]">
              Get Instant Access to High-Yield Topics (Free Beta)
            </Button>
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
