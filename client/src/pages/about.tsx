import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Filter, Brain, Clock, ArrowRight } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center overflow-visible py-2 sm:py-3" aria-label="Go to home">
            <img
              src={smashutmeLogo}
              alt="SmashUTME"
              className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
            />
          </button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/contact")} className="text-slate-900 dark:text-white">
              Contact Us
            </Button>
            <Button onClick={() => setLocation("/signup")} className="bg-brand-blue hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Section 1: Mission Hero */}
        <section className="pt-12 pb-14 md:pt-16 md:pb-16 px-6 md:px-8 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xs uppercase tracking-widest mb-8">
            <span>🎯</span>
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
            A smarter way to <span className="text-brand-blue">prepare</span> for UTME.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            SmashUTME was built from a simple idea — students should not have to read everything to succeed. With the right structure and focus, preparing for UTME can be clearer, lighter, and more effective.
          </p>
        </section>

        {/* Section 2: Founder's Story */}
        <section className="py-24 px-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-2xl transition-all duration-300 group-hover:scale-105"></div>
              <div className="relative bg-white dark:bg-slate-800 border-l-4 border-brand-blue p-6 rounded-2xl shadow-lg overflow-hidden">
                <img 
                  className="w-full h-full object-cover rounded-lg" 
                  alt="Founder" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH8n0YjIcv_Ucuss0Rqd398WKaGHZnKumTajxa7jI0g-5pcnWHSfltL8VLE3LYxfoYBpVLXx2sO8bqTH4nTzTQWCnk-KFo8PPcub66ji2eA7mhl_fAe_20EGfjinDVkiADBq0nqZU41cKXeZS4NBM5JTYJDViULddPxr631Hmsd5UTiYoSjld6UXPMdZ62uCuETralKhTItDCg38uivOlayyk6278yWj0AxNtJu-ExIXBUms7Ta29jZ6zuLKTIiAoodKo3LQ4RNQQ"
                />
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">"I wanted something better."</h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                <p>For years, I watched students struggle under the weight of massive textbooks, trying to memorize everything from cover to cover. It was exhausting, inefficient, and often resulted in burnout before the exam even started.</p>
                <p>I realized that the secret wasn't in working harder, but in focusing on high-yield material—the concepts that actually drive scores. That realization became the foundation of SmashUTME.</p>
                <p>We've stripped away the noise to give you a surgical focus on what truly matters. We are not just a test prep platform; we are your diagnostic toolkit for academic excellence.</p>
              </div>
              <div className="pt-6">
                <p className="italic text-2xl text-brand-blue font-semibold">Victor (Infinite)</p>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">Founder, SmashUTME</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Core Approach */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Our JAMB Strategy</h2>
              <div className="h-1 w-20 bg-brand-blue mx-auto"></div>
              <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                JAMB success is not about reading everything. It is about reading the right topics,
                practicing with real exam pressure, and improving weak points before exam day.
                That is the system we built for Nigerian students.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-brand-blue transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/10">
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <Filter className="w-6 h-6 text-brand-blue group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Target High-Yield JAMB Topics</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We map each subject to the official JAMB syllabus and past question patterns, so you spend more time on topics that repeatedly appear and less time on distractions.</p>
              </div>

              {/* Pillar 2 */}
              <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-brand-blue transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/10">
                <div className="w-12 h-12 rounded-lg bg-brand-gold/10 flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-white transition-all">
                  <Brain className="w-6 h-6 text-brand-gold group-hover:text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Master Concepts the JAMB Way</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Instead of cramming, we break topics into clear explanations, worked examples, and likely question angles so you can answer unfamiliar questions with confidence.</p>
              </div>

              {/* Pillar 3 */}
              <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-brand-blue transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/10">
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <Clock className="w-6 h-6 text-brand-blue group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Train for CBT Speed and Accuracy</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Our timed drills and mock sessions simulate real JAMB CBT pressure, helping you improve speed, reduce careless mistakes, and build stamina for the full exam.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Vision */}
        <section className="py-32 px-8 bg-brand-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight leading-tight">Building the future of academic clarity.</h2>
            <p className="text-blue-100 text-xl leading-relaxed font-light">
              Our vision is to empower every student with the structure and confidence they need to excel. We are building more than a platform—we are fostering a new standard of academic preparation where clarity replaces confusion and mastery is within everyone's reach.
            </p>
            <div className="pt-8">
              <Button onClick={() => setLocation("/signup")} className="bg-white text-brand-blue hover:bg-slate-100 px-10 py-4 font-bold text-lg">
                Join the Movement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
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
                <button onClick={() => setLocation("/user/dashboard")} className="block hover:text-brand-blue">Open Dashboard</button>
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
