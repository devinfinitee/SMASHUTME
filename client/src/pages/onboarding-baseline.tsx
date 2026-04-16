import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  GaugeCircle,
  Clock3,
  Target,
  Check,
  ArrowRight,
} from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import { saveOnboardingBaseline } from "@/lib/onboarding-api";

type Option = {
  id: string;
  label: string;
  note: string;
};

const CONFIDENCE_OPTIONS: Option[] = [
  { id: "low", label: "Needs serious work", note: "I am still struggling with most topics." },
  { id: "medium", label: "Getting better", note: "I understand some topics but need structure." },
  { id: "high", label: "Confident", note: "I can answer many questions correctly already." },
];

const MOCK_SCORE_OPTIONS: Option[] = [
  { id: "below-180", label: "Below 180", note: "Strong recovery plan needed." },
  { id: "180-220", label: "180 - 220", note: "Good base, needs sharpening." },
  { id: "220-260", label: "220 - 260", note: "Competitive with focused revision." },
  { id: "260-plus", label: "260+", note: "Excellent, maintain consistency." },
];

const STUDY_TIME_OPTIONS: Option[] = [
  { id: "lt-1", label: "Less than 1 hour/day", note: "Micro-plan strategy recommended." },
  { id: "1-2", label: "1 to 2 hours/day", note: "Balanced schedule with steady gains." },
  { id: "2-4", label: "2 to 4 hours/day", note: "High-yield intensive mode." },
  { id: "4-plus", label: "4+ hours/day", note: "Advanced drill and mock cycles." },
];

export default function OnboardingBaseline() {
  const [, setLocation] = useLocation();
  const [confidence, setConfidence] = useState<string>("");
  const [scoreBand, setScoreBand] = useState<string>("");
  const [studyTime, setStudyTime] = useState<string>("");

  const completed = useMemo(() => !!confidence && !!scoreBand && !!studyTime, [confidence, scoreBand, studyTime]);

  const handleNext = () => {
    if (!completed) return;

    const payload = { confidence, scoreBand, studyTime };

    localStorage.setItem(
      "smashutme-onboarding-baseline",
      JSON.stringify({
        ...payload,
        updatedAt: new Date().toISOString(),
      }),
    );

    saveOnboardingBaseline(payload)
      .catch((saveError) => {
        console.error("Failed to save baseline onboarding:", saveError);
      })
      .finally(() => {
        setLocation("/onboarding/review");
      });
  };

  const renderCard = (
    title: string,
    subtitle: string,
    icon: React.ComponentType<{ className?: string }>,
    options: Option[],
    value: string,
    onPick: (id: string) => void,
  ) => {
    const Icon = icon;

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => {
            const isActive = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onPick(option.id)}
                className={`relative text-left rounded-lg border p-4 transition-all active:scale-[0.98] ${
                  isActive
                    ? "border-brand-blue bg-brand-blue/5"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{option.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{option.note}</p>
                  </div>
                  {isActive ? (
                    <span className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-slate-900" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-300 shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center overflow-visible py-2 sm:py-3" aria-label="Go to home">
            <img
              src={smashutmeLogo}
              alt="SmashUTME"
              className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
            />
          </button>
          <button type="button" className="text-slate-500 hover:bg-slate-100 p-2 rounded-xl transition-colors" aria-label="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue block mb-1">Onboarding Phase</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Step 3 of 4</h2>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-slate-500">Setup Progress</span>
              <div className="text-lg font-bold text-brand-blue">75%</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-blue to-brand-blue/80 w-3/4 transition-all duration-500" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Baseline Assessment Snapshot</h1>
          <p className="text-slate-600">
            Help us calibrate your dashboard by sharing your current confidence, recent score range, and daily study availability.
          </p>
        </div>

        <div className="space-y-4">
          {renderCard(
            "How confident are you currently?",
            "Choose your current preparation confidence.",
            GaugeCircle,
            CONFIDENCE_OPTIONS,
            confidence,
            setConfidence,
          )}

          {renderCard(
            "Recent mock score range",
            "Pick the closest band to your current performance.",
            Target,
            MOCK_SCORE_OPTIONS,
            scoreBand,
            setScoreBand,
          )}

          {renderCard(
            "Daily study time",
            "Tell us how much time you can realistically commit.",
            Clock3,
            STUDY_TIME_OPTIONS,
            studyTime,
            setStudyTime,
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(43,10,250,0.04)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Assessment Status</span>
            <span className="text-slate-900 font-black">{completed ? "Ready to continue" : "Complete all sections"}</span>
          </div>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!completed}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-6 py-3 rounded-md disabled:opacity-50"
          >
            Next: Final Review
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-40" />
    </div>
  );
}
