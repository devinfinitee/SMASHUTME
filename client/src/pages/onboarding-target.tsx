import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { HelpCircle, Building2, GraduationCap, Lightbulb, ArrowRight, ArrowLeft, SkipForward, BarChart3 } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import {
  COMMON_NIGERIAN_COURSES,
  NIGERIAN_INSTITUTIONS,
  inferJambSubjectsForCourse,
} from "@/lib/onboarding-data";

export default function OnboardingTarget() {
  const [, setLocation] = useLocation();
  const [institution, setInstitution] = useState(() => {
    const raw = localStorage.getItem("smashutme-onboarding-target");
    if (!raw) return "";
    try {
      return JSON.parse(raw)?.institution ?? "";
    } catch {
      return "";
    }
  });
  const [course, setCourse] = useState(() => {
    const raw = localStorage.getItem("smashutme-onboarding-target");
    if (!raw) return "";
    try {
      return JSON.parse(raw)?.course ?? "";
    } catch {
      return "";
    }
  });
  const [error, setError] = useState("");

  const canContinue = useMemo(() => institution.trim() && course.trim(), [institution, course]);

  const handleNext = () => {
    if (!canContinue) {
      setError("Please choose both your target institution and target course.");
      return;
    }

    localStorage.setItem(
      "smashutme-onboarding-target",
      JSON.stringify({
        institution,
        course,
        suggestedSubjects: inferJambSubjectsForCourse(course),
        updatedAt: new Date().toISOString(),
      }),
    );

    setLocation("/onboarding/subjects");
  };

  const handleSkip = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center overflow-visible py-2 sm:py-3" aria-label="Go to home">
            <img
              src={smashutmeLogo}
              alt="SmashUTME"
              className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
            />
          </button>

          <button
            type="button"
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
            aria-label="Get onboarding help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="min-h-screen pt-24 pb-28 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(43,10,250,0.08)] border border-slate-200">
          <div className="relative h-28 bg-slate-100 flex items-center justify-center">
            <div className="bg-white rounded-xl border border-slate-200 px-3 py-1 shadow-sm">
              <div className="relative w-[220px] h-[46px] overflow-hidden flex items-center justify-center">
                <img
                  src={smashutmeLogo}
                  alt="SmashUTME"
                  className="absolute left-1/2 -translate-x-1/2 -top-[80px] h-[220px] w-[220px] max-w-none"
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200">
              <div className="h-full bg-brand-blue w-1/4 transition-all duration-500 ease-in-out" />
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-7">
            <div className="flex justify-between items-end gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue block mb-1">Onboarding Phase</span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">The Target</h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Step 1 of 4</span>
                <div className="flex gap-1 mt-1 justify-end">
                  <div className="w-4 h-1 bg-brand-blue rounded-full" />
                  <div className="w-4 h-1 bg-slate-200 rounded-full" />
                  <div className="w-4 h-1 bg-slate-200 rounded-full" />
                  <div className="w-4 h-1 bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1" htmlFor="institution">
                  Target Institution
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue/70 w-5 h-5" />
                  <input
                    id="institution"
                    list="nigerian-institutions"
                    value={institution}
                    onChange={(e) => {
                      setInstitution(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-lg focus:outline-none focus:ring-0 focus:border-b-2 focus:border-brand-blue text-slate-900 font-medium appearance-none"
                    placeholder="Search for your University/Polytechnic"
                  />
                  <datalist id="nigerian-institutions">
                    {NIGERIAN_INSTITUTIONS.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1" htmlFor="course">
                  Target Course
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue/70 w-5 h-5" />
                  <input
                    id="course"
                    list="common-nigerian-courses"
                    value={course}
                    onChange={(e) => {
                      setCourse(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-lg focus:outline-none focus:ring-0 focus:border-b-2 focus:border-brand-blue text-slate-900 font-medium appearance-none"
                    placeholder="Select your preferred field of study"
                  />
                  <datalist id="common-nigerian-courses">
                    {COMMON_NIGERIAN_COURSES.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-lg border-l-4 border-brand-gold flex gap-3 items-start">
                <Lightbulb className="text-brand-gold w-5 h-5 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choosing your institution and course lets our <span className="text-brand-blue font-bold">diagnostic engine</span> personalize your dashboard, question flow,
                  cut-off mark guidance, and your likely JAMB subject combination.
                </p>
              </div>

              {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-brand-blue text-white py-6 rounded-md font-bold text-sm tracking-wide hover:bg-brand-blue/90"
              >
                Next: Choose Subjects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full mt-4 text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:text-brand-blue transition-colors"
              >
                I'm not sure yet, skip for now
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[11px] text-slate-400 font-medium uppercase tracking-[0.2em]">Precision Practice • Data Driven Success</p>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(43,10,250,0.04)] z-50">
        <button
          type="button"
          onClick={() => setLocation("/signup")}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="flex flex-col items-center justify-center bg-brand-blue/10 text-brand-blue rounded-xl px-4 py-1">
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Progress</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-brand-blue transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Skip</span>
        </button>
      </nav>
    </div>
  );
}