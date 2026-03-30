import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  BookOpen,
  Sigma,
  Zap,
  FlaskConical,
  Dna,
  TrendingUp,
  Landmark,
  BookText,
  Briefcase,
  Globe,
  Leaf,
  History,
  Heart,
  Languages,
  Palette,
  Music,
  Home,
  DraftingCompass,
  Check,
  ArrowRight,
} from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import { ALL_JAMB_SUBJECTS, inferJambSubjectsForCourse } from "@/lib/onboarding-data";

type SubjectItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ICON_BY_SUBJECT: Record<string, SubjectItem["icon"]> = {
  mathematics: Sigma,
  physics: Zap,
  chemistry: FlaskConical,
  biology: Dna,
  economics: TrendingUp,
  government: Landmark,
  "literature in english": BookText,
  commerce: Briefcase,
  accounting: Briefcase,
  geography: Globe,
  "agricultural science": Leaf,
  history: History,
  "christian religious studies": Heart,
  "islamic religious studies": Heart,
  "civic education": Landmark,
  french: Languages,
  arabic: Languages,
  yoruba: Languages,
  igbo: Languages,
  hausa: Languages,
  "fine art": Palette,
  music: Music,
  "home economics": Home,
  "technical drawing": DraftingCompass,
};

const SUBJECTS: SubjectItem[] = ALL_JAMB_SUBJECTS.map((label) => {
  const id = label.toLowerCase();
  return {
    id,
    label,
    icon: ICON_BY_SUBJECT[id] ?? BookOpen,
  };
});

export default function OnboardingSubjects() {
  const [, setLocation] = useLocation();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => {
    const existing = localStorage.getItem("smashutme-onboarding-subjects");
    if (existing) {
      try {
        const payload = JSON.parse(existing) as { selected?: string[] };
        if (Array.isArray(payload.selected) && payload.selected.length) {
          return payload.selected;
        }
      } catch {
        // ignore invalid storage and fall through to fresh inference
      }
    }

    const targetRaw = localStorage.getItem("smashutme-onboarding-target");
    if (targetRaw) {
      try {
        const target = JSON.parse(targetRaw) as { course?: string; suggestedSubjects?: string[] };
        const guessed = target.suggestedSubjects ?? inferJambSubjectsForCourse(target.course ?? "");
        return guessed.map((subject) => subject.toLowerCase()).slice(0, 3);
      } catch {
        // ignore invalid storage and use default fallback
      }
    }

    return ["mathematics", "physics", "chemistry"];
  });

  const selectedCount = selectedSubjects.length;
  const canProceed = selectedCount === 3;

  const errorMessage = useMemo(() => {
    if (selectedCount < 3) return `Select ${3 - selectedCount} more subject${3 - selectedCount > 1 ? "s" : ""}.`;
    if (selectedCount > 3) return "You can only pick 3 subjects.";
    return "";
  }, [selectedCount]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, subjectId];
    });
  };

  const handleNext = () => {
    if (!canProceed) return;

    const payload = {
      compulsory: "Use of English",
      selected: selectedSubjects,
      selectedLabels: selectedSubjects.map(getSubjectLabel),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("smashutme-onboarding-subjects", JSON.stringify(payload));

    setLocation("/onboarding/baseline");
  };

  const getSubjectLabel = (subjectId: string) => SUBJECTS.find((s) => s.id === subjectId)?.label ?? subjectId;

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
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Step 2 of 4</h2>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-slate-500">Setup Progress</span>
              <div className="text-lg font-bold text-brand-blue">50%</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-blue to-brand-blue/80 w-1/2 transition-all duration-500" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Select your UTME Subject Combination.</h1>
          <p className="text-slate-600">Use of English is compulsory. Select 3 additional subjects based on your intended course of study.</p>
        </div>

        <div className="mb-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Compulsory Subject</label>
          <div className="relative bg-slate-100 p-6 rounded-xl flex items-center justify-between overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Use of English</h3>
                <p className="text-xs text-slate-500">Required for all candidates</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-tighter">
              <span>Locked</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-4">Select 3 Subjects</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBJECTS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id);
              const Icon = subject.icon;

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  className={`relative p-5 rounded-xl text-left border-2 transition-all active:scale-95 duration-200 ${
                    isSelected
                      ? "bg-white border-brand-blue shadow-sm"
                      : "bg-slate-100 border-transparent hover:bg-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? "bg-brand-blue/10" : "bg-slate-200"}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? "text-brand-blue" : "text-slate-500"}`} />
                      </div>
                      <h4 className="font-bold text-slate-900">{subject.label}</h4>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center">
                        <Check className="w-4 h-4 text-slate-900" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className={`mt-3 text-sm ${canProceed ? "text-brand-blue font-semibold" : "text-slate-500"}`}>
            {canProceed ? `Ready: ${selectedSubjects.map(getSubjectLabel).join(", ")}` : errorMessage}
          </p>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(43,10,250,0.04)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Selection Status</span>
            <span className="text-slate-900 font-black">{selectedCount} of 3 subjects selected.</span>
          </div>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-6 py-3 rounded-md disabled:opacity-50"
          >
            Next: Baseline Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-40" />
    </div>
  );
}
