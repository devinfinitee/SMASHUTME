import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, FileCheck, MonitorSmartphone, Stethoscope, Users, Filter, Timer, Brain, Map, Lock, MessageSquare, Rocket } from "lucide-react";
import { useLocation } from "wouter";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import heroImage from "@/assets/hero.webp";
import { CurriculumPreview } from "@/components/curriculum-preview";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center overflow-visible py-2 sm:py-3">
            <img src={smashutmeLogo} alt="SmashUTME" className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLocation("/about")} className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden md:block">
              About
            </button>
            <button onClick={() => setLocation("/contact")} className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden md:block">
              Contact
            </button>
            <Button onClick={() => setLocation("/signup")} className="rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 h-9 px-3 text-xs sm:h-10 sm:px-5 sm:text-sm">
              <span className="sm:hidden">Start Free</span>
              <span className="hidden sm:inline">Start Preparing Free</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-10 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-18 overflow-hidden border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold mb-5">
                  <span className="mr-2">●</span>UTME 2026 Focus Mode
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl leading-[1.05] tracking-tight font-display font-bold text-slate-900 mb-5">
                  JAMB is not just about reading.
                  <span className="block text-brand-blue mt-2">It is about reading the right things.</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-snug mb-6 max-w-xl">
                  Stop wasting time on low-yield topics. SmashUTME gives you a focused system built around <strong className="text-slate-900">High-Yield Topics</strong>, <strong className="text-slate-900">CBT Practice</strong>, and exam-day confidence.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                  <Button
                    onClick={() => setLocation("/signup")}
                    size="lg"
                    className="w-full sm:w-auto justify-center rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 animate-[pulse_2.2s_ease-in-out_infinite]"
                  >
                    Start Preparing Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setLocation("/login")}
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto justify-center rounded-full bg-brand-gold text-slate-900 hover:bg-brand-gold/90"
                  >
                    Try CBT Practice Demo
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                  <p className="font-semibold">Built by a Medical Student at LAUTECH who cracked UTME.</p>
                  <p className="text-slate-500">I built the tool I wish I had.</p>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
                  <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <p className="text-xs text-slate-500 ml-3">SmashUTME Study View</p>
                  </div>
                  <img
                    src={heroImage}
                    alt="Nigerian students preparing for UTME in a focused study environment"
                    className="w-full h-[240px] sm:h-[320px] md:h-[420px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium flex items-center gap-2 shadow-sm">
                <FileCheck className="w-4 h-4 text-brand-blue" />
                2026 JAMB Syllabus Aligned
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium flex items-center gap-2 shadow-sm">
                <MonitorSmartphone className="w-4 h-4 text-brand-blue" />
                100% CBT Simulation Accuracy
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium flex items-center gap-2 shadow-sm">
                <Stethoscope className="w-4 h-4 text-brand-blue" />
                Built by Medical Professionals
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium flex items-center gap-2 shadow-sm">
                <Users className="w-4 h-4 text-brand-blue" />
                Beta Tested by 50+ Candidates
              </div>
            </div>
          </div>
        </section>

        <section id="subjects" className="py-14 md:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                Most students fail because they study hard. You will pass because you study smart.
              </h2>
              <p className="text-slate-600 mt-3 text-lg">
                This is the High-Yield System behind SmashUTME.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <article className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 hover:border-brand-gold transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    The Problem: Topic Overload
                  </span>
                  <Filter className="w-5 h-5 text-brand-blue mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-blue mb-3">The SmashUTME Fix: The 80/20 Topic Filter</h3>
                <p className="text-slate-600 leading-relaxed mb-2">
                  We analyzed 10+ years of JAMB past questions to isolate the 20% of topics that appear in 80% of exams.
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Result: You stop wasting time on filler topics and focus on what actually scores marks.
                </p>
              </article>

              <article className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 hover:border-brand-gold transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    The Problem: Time Runs Out
                  </span>
                  <Timer className="w-5 h-5 text-brand-blue mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-blue mb-3">The SmashUTME Fix: CBT Speed Master</h3>
                <p className="text-slate-600 leading-relaxed mb-2">
                  A real-time pacing engine tracks your Seconds Per Question (SPQ) inside every mock exam.
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Result: Your brain learns to maintain exam pace and finish with around 15 minutes to spare.
                </p>
              </article>

              <article className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 hover:border-brand-gold transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    The Problem: Forgetting Fast
                  </span>
                  <Brain className="w-5 h-5 text-brand-blue mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-blue mb-3">The SmashUTME Fix: The Anti-Cram Engine</h3>
                <p className="text-slate-600 leading-relaxed mb-2">
                  We teach from first principles, explaining the logic behind each answer instead of just showing option A.
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Result: Deep conceptual understanding that stays with you till exam day.
                </p>
              </article>

              <article className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 hover:border-brand-gold transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    The Problem: No Clear Roadmap
                  </span>
                  <Map className="w-5 h-5 text-brand-blue mt-1" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-blue mb-3">The SmashUTME Fix: The Medical Student Blueprint</h3>
                <p className="text-slate-600 leading-relaxed mb-2">
                  The same schedule, high-yield notes, and shortcuts used to secure admission into LAUTECH Medicine.
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Result: A proven roadmap from late preparation to medical-school-level outcomes.
                </p>
              </article>
            </div>

            <p className="text-center text-sm mt-8 text-slate-500">
              Ready to stop reading randomly?{" "}
              <button
                onClick={() => setLocation("/signup")}
                className="font-semibold text-brand-blue underline underline-offset-4 hover:text-brand-blue/80"
              >
                Start Your High-Yield Journey
              </button>
            </p>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                Step Inside Your New Study Command Center.
              </h2>
              <p className="text-slate-600 text-lg mt-3">
                The system you were promised is already mapped out for you: what to study, how to perform under pressure, and when you are truly ready.
              </p>
            </div>

            <div className="space-y-10">
              <article className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-md">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue mb-3">1. The High-Yield Topic Hub</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Stop guessing what to read first.</h3>
                  <p className="text-slate-600 text-lg leading-snug mb-5">
                    Stop guessing. See exactly which topics carry 70% of the marks in Chemistry, Physics, and Biology.
                  </p>
                  <Button onClick={() => setLocation("/signup")} className="w-full sm:w-auto rounded-full bg-brand-blue text-white hover:bg-brand-blue/90">
                    View Your Subject Weights
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <p className="text-xs text-slate-500 ml-2">High-Yield Topic Hub</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
                      <p className="font-medium">Organic Chemistry</p>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-blue/10 text-brand-blue">12% of Exam</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
                      <p className="font-medium">Chemical Equilibrium</p>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-blue/10 text-brand-blue">8% of Exam</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
                      <p className="font-medium">Periodic Trends</p>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-gold/20 text-brand-gold">7% of Exam</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-md">
                <div className="order-2 lg:order-1 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <p className="text-xs text-slate-500 ml-2">CBT Simulation Engine</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question 18 of 60</p>
                      <p className="text-xs font-semibold text-brand-blue">SPQ: 37s</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 mb-3">
                      <p className="font-medium mb-2">Chemistry: Which process favors ammonia yield in the Haber process?</p>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <p className="rounded-lg border border-slate-200 px-3 py-2">A. High temperature, low pressure</p>
                        <p className="rounded-lg border border-brand-blue/30 bg-brand-blue/5 px-3 py-2">B. Moderate temperature, high pressure</p>
                        <p className="rounded-lg border border-slate-200 px-3 py-2">C. Low temperature, low pressure</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 flex items-center justify-between text-sm">
                      <p className="font-medium text-slate-700">Pacing Timer: 44s</p>
                      <span className="text-brand-gold font-semibold">Too Slow</span>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue mb-3">2. The CBT Simulation Engine</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Train with real exam pressure.</h3>
                  <p className="text-slate-600 text-lg leading-snug mb-5">
                    Experience the real JAMB interface. No surprises on exam day.
                  </p>
                  <Button onClick={() => setLocation("/signup")} variant="secondary" className="w-full sm:w-auto rounded-full bg-brand-gold text-slate-900 hover:bg-brand-gold/90">
                    Enter Exam Mode
                  </Button>
                </div>
              </article>

              <article className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-md">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue mb-3">3. The Smart Progress Tracker</p>
                  <h3 className="text-2xl font-display font-bold mb-3">See confidence grow in numbers.</h3>
                  <p className="text-slate-600 text-lg leading-snug mb-5">
                    Don't just read. Track your mastery. Know exactly when you're ready for the 300+ score.
                  </p>
                  <Button onClick={() => setLocation("/dashboard")} className="w-full sm:w-auto rounded-full bg-brand-blue text-white hover:bg-brand-blue/90">
                    Open Your Progress Tracker
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <p className="text-xs text-slate-500 ml-2">Smart Progress Tracker</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Chemistry Mastery</p>
                        <p className="text-brand-blue font-semibold">82%</p>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full w-[82%] bg-brand-blue rounded-full" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Admission Probability</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-display font-bold text-brand-blue">73%</p>
                        <p className="text-sm text-slate-500">Target Score: 300+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold mb-3">Pioneer Beta and Admission</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Join the First 100 Pioneers.</h2>
              <p className="text-slate-600 mt-3 text-lg">
                This is not just early access. It is your admission-focused inner circle with direct founder support.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-sm font-semibold text-slate-900">64/100 Spots Taken</p>
                <p className="text-sm text-slate-500">36 spots remaining</p>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden mb-5">
                <div className="h-full w-[64%] rounded-full bg-brand-blue" />
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-brand-gold" />
                    <p className="font-semibold">Locked-In Price</p>
                  </div>
                  <p className="text-sm text-slate-500">Free access for the full 2026 UTME season.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-brand-gold" />
                    <p className="font-semibold">Founder Access</p>
                  </div>
                  <p className="text-sm text-slate-500">Direct feedback loop with a Medical Student (Infinite).</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket className="w-4 h-4 text-brand-gold" />
                    <p className="font-semibold">Early Features</p>
                  </div>
                  <p className="text-sm text-slate-500">Get High-Yield updates before public rollout.</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4">Traditional Way</p>
                <ul className="space-y-3 text-slate-400">
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3">Reading 10 hours/day randomly</li>
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3">Panic during the CBT timer</li>
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3">Cramming past questions</li>
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold">Aiming for just a pass</li>
                </ul>
              </article>

              <article className="rounded-2xl border-2 border-brand-blue bg-white p-6 shadow-md">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue mb-4">SmashUTME Way</p>
                <ul className="space-y-3 text-slate-900">
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold">✓ 3 hours of High-Yield focus</li>
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold">✓ Mastering SPQ (Seconds Per Question)</li>
                  <li className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold">✓ Logic-based understanding</li>
                  <li className="rounded-lg border border-brand-blue/30 bg-white px-4 py-3 font-bold text-brand-blue">✓ Aiming for Medicine, Law, or Engineering</li>
                </ul>
              </article>
            </div>

            <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 border-l-4 border-l-brand-gold bg-white p-6 md:p-8 shadow-md">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold mb-3">Founder's Personal Guarantee</p>
              <p className="text-lg leading-relaxed text-slate-900">
                "I did not build SmashUTME to be just another website. I built it because I know the fear of seeing a bulky syllabus and not knowing where to start. This is the tool I used to get into LAUTECH Medicine, and I am personally making sure it works for you too. Let us get you that admission letter."
              </p>
              <div className="mt-6">
                <p className="text-3xl text-brand-blue" style={{ fontFamily: "Caveat, Dancing Script, cursive" }}>Victor (Infinite)</p>
                <p className="text-sm text-slate-500">Founder, SmashUTME and MBBS Candidate.</p>
              </div>
            </article>
          </div>
        </section>

        <CurriculumPreview />


        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
              Claim your Pioneer spot before this cohort closes.
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              No credit card. Just pure high-yield prep and direct founder guidance.
            </p>
            <Button onClick={() => setLocation("/signup")} size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-4 sm:py-6 text-base bg-brand-blue text-white hover:bg-brand-blue/90 animate-[pulse_2.2s_ease-in-out_infinite]">
              Claim My Pioneer Spot (Free Access)
            </Button>
            <p className="text-sm text-slate-500 mt-3">No credit card. Just pure high-yield prep.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-md mb-8">
            <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 lg:gap-10 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold mb-3">SmashUTME Pioneer Circle</p>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-3">This is an admission movement, not just an app.</h3>
                <p className="text-slate-600 leading-relaxed">
                  SmashUTME exists for students who are serious about Medicine, Law, Engineering, and competitive admission paths. We train strategy, speed, and confidence with high-yield focus.
                </p>
                <p className="mt-4 text-sm text-slate-500">
                  Built and reviewed by an MBBS candidate who has already passed through the same pressure.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900 mb-2">Pioneer Access Status</p>
                <p className="text-3xl font-display font-bold text-brand-blue">64 / 100</p>
                <p className="text-sm text-slate-500 mt-1 mb-4">Spots already claimed for the 2026 cohort.</p>
                <Button onClick={() => setLocation("/signup")} className="w-full rounded-full bg-brand-blue text-white hover:bg-brand-blue/90">
                  Claim My Pioneer Spot
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Start Here</h4>
              <div className="space-y-2 text-slate-500">
                <button onClick={() => setLocation("/signup")} className="block hover:text-brand-blue">Create Free Account</button>
                <button onClick={() => setLocation("/login")} className="block hover:text-brand-blue">Continue Learning</button>
                <a href="#subjects" className="block hover:text-brand-blue">Explore Subjects</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Program</h4>
              <div className="space-y-2 text-slate-500">
                <a href="#" className="block hover:text-brand-blue">High-Yield Method</a>
                <a href="#" className="block hover:text-brand-blue">CBT Speed Framework</a>
                <a href="#" className="block hover:text-brand-blue">Pioneer Benefits</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
              <div className="space-y-2 text-slate-500">
                <button onClick={() => setLocation("/about")} className="block hover:text-brand-blue">About SmashUTME</button>
                <button onClick={() => setLocation("/contact")} className="block hover:text-brand-blue">Contact Team</button>
                <a href="#" className="block hover:text-brand-blue">Founder Story</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Legal</h4>
              <div className="space-y-2 text-slate-500">
                <a href="#" className="block hover:text-brand-blue">Terms of Use</a>
                <a href="#" className="block hover:text-brand-blue">Privacy Policy</a>
                <a href="#" className="block hover:text-brand-blue">Exam Disclaimer</a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500">
            <p>© 2026 SmashUTME. All rights reserved.</p>
            <p>Built in Nigeria for ambitious UTME candidates.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
