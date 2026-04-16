import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { HelpCircle, ArrowLeft, BarChart3, SkipForward, CheckCircle2 } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import { completeOnboarding } from "@/lib/onboarding-api";

type StatusItem = {
  id: "save" | "filter" | "isolate";
  label: string;
  state: "done" | "active" | "pending";
};

export default function OnboardingReview() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(84);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const delta = prev < 92 ? 2 : 1;
        return Math.min(100, prev + delta);
      });
    }, 400);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100) return;

    const completeTimer = window.setTimeout(() => {
      localStorage.setItem("smashutme-onboarding-complete", "true");
      completeOnboarding()
        .catch((saveError) => {
          console.error("Failed to complete onboarding:", saveError);
        })
        .finally(() => {
          setLocation("/dashboard");
        });
    }, 900);

    return () => window.clearTimeout(completeTimer);
  }, [progress, setLocation]);

  const statuses: StatusItem[] = useMemo(() => {
    if (progress < 90) {
      return [
        { id: "save", label: "Saving target...", state: "done" },
        { id: "filter", label: "Filtering JAMB questions...", state: "active" },
        { id: "isolate", label: "Isolating high-yield topics...", state: "pending" },
      ];
    }

    if (progress < 100) {
      return [
        { id: "save", label: "Saving target...", state: "done" },
        { id: "filter", label: "Filtering JAMB questions...", state: "done" },
        { id: "isolate", label: "Isolating high-yield topics...", state: "active" },
      ];
    }

    return [
      { id: "save", label: "Saving target...", state: "done" },
      { id: "filter", label: "Filtering JAMB questions...", state: "done" },
      { id: "isolate", label: "Isolating high-yield topics...", state: "done" },
    ];
  }, [progress]);

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900 overflow-hidden relative">
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-[0_6px_20px_rgba(43,10,250,0.06)]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto h-14 sm:h-16">
          <div className="flex items-center overflow-visible py-2 sm:py-3">
            <img
              src={smashutmeLogo}
              alt="SmashUTME"
              className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
            />
          </div>
          <button type="button" className="text-brand-blue hover:bg-slate-100 p-2 rounded-xl transition-colors" aria-label="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-24">
        <div className="w-full max-w-lg space-y-10 md:space-y-12">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 bg-slate-200 text-brand-blue text-[10px] font-bold uppercase tracking-[0.15em] rounded-full">
              Step 4 of 4
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 leading-none">
              System Calibration
            </h1>
            <p className="text-slate-500 text-sm font-medium opacity-90">
              Synchronizing your academic profile with JAMB patterns
            </p>
          </div>

          <div className="relative flex items-center justify-center py-4">
            <div className="absolute w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl" />

            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
                <circle cx="80" cy="80" r="76" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-200" />
                <circle
                  cx="80"
                  cy="80"
                  r="76"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="477"
                  strokeDashoffset="350"
                  className="text-brand-gold/60 origin-center"
                  style={{ animation: "spin 1.6s linear infinite" }}
                />
                <circle
                  cx="80"
                  cy="80"
                  r="76"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="477"
                  strokeDashoffset="120"
                  className="text-brand-blue origin-center"
                  style={{ animation: "spin 2s linear infinite" }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-brand-blue/10 flex items-center justify-center">
                  <img
                    src={smashutmeLogo}
                    alt="SmashUTME Core"
                    className="w-12 h-12 object-left-top object-cover scale-[2.8] origin-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-6 md:p-8 space-y-6 shadow-sm border border-slate-200">
            <div className="space-y-4">
              {statuses.map((item) => {
                if (item.state === "done") {
                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-brand-blue ring-4 ring-brand-blue/10" />
                      <span className="text-slate-900 font-semibold text-sm">{item.label}</span>
                      <CheckCircle2 className="w-4 h-4 text-brand-blue ml-auto" />
                    </div>
                  );
                }

                if (item.state === "active") {
                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse ring-4 ring-brand-blue/10" />
                      <span className="text-slate-900 font-semibold text-sm">{item.label}</span>
                      <span className="text-[10px] font-bold text-brand-blue px-2 py-0.5 bg-brand-blue/10 rounded uppercase tracking-wider ml-auto">
                        Active
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={item.id} className="flex items-center gap-4 opacity-40">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-slate-500 font-medium text-sm">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Calibration Progress
                </span>
                <span className="text-xl font-black text-brand-blue tabular-nums">{progress}%</span>
              </div>

              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-blue to-brand-blue/80 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto italic">
              "The clinical engine is tailoring your mock exams based on the latest syllabus requirements."
            </p>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white/95 backdrop-blur-md z-50 border-t border-slate-200 shadow-[0_-4px_20px_rgba(43,10,250,0.04)]">
        <button
          type="button"
          onClick={() => setLocation("/onboarding/baseline")}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="flex flex-col items-center justify-center bg-brand-blue/10 text-brand-blue rounded-xl px-4 py-1">
          <BarChart3 className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Progress</span>
        </div>

        <button
          type="button"
          disabled
          className="flex flex-col items-center justify-center text-slate-400 opacity-50 cursor-not-allowed"
        >
          <SkipForward className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Skip</span>
        </button>
      </nav>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-brand-gold/15 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
