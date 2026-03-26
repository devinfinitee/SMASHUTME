import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type YieldBand = "high" | "medium" | "foundational";

type Topic = {
  name: string;
  probability: number;
  yieldBand: YieldBand;
  note?: string;
};

type SubjectBlueprint = {
  label: string;
  topics: Topic[];
};

const curriculumBlueprint: Record<string, SubjectBlueprint> = {
  chemistry: {
    label: "Chemistry",
    topics: [
      { name: "Separation Techniques", probability: 92, yieldBand: "foundational", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Organic Chemistry", probability: 88, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Chemical Equilibrium", probability: 75, yieldBand: "medium", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Electrolysis", probability: 82, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "The Periodic Table", probability: 95, yieldBand: "foundational", note: "Appeared in 9 out of the last 10 JAMB exams." },
    ],
  },
  physics: {
    label: "Physics",
    topics: [
      { name: "Mechanics (Motion/Force)", probability: 94, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Current Electricity", probability: 86, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Waves and Optics", probability: 78, yieldBand: "medium", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Modern Physics (Radioactivity)", probability: 72, yieldBand: "medium", note: "Appeared in 9 out of the last 10 JAMB exams." },
    ],
  },
  biology: {
    label: "Biology",
    topics: [
      { name: "Classification of Living Things", probability: 96, yieldBand: "foundational", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Genetics and Variation", probability: 89, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Ecology", probability: 84, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Human Systems (Digestive/Circulatory)", probability: 91, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
    ],
  },
  english: {
    label: "Use of English",
    topics: [
      { name: "Comprehension Passages", probability: 90, yieldBand: "high", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Lexis and Structure", probability: 93, yieldBand: "foundational", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Oral English", probability: 81, yieldBand: "medium", note: "Appeared in 9 out of the last 10 JAMB exams." },
      { name: "Register and Meaning", probability: 74, yieldBand: "medium", note: "Appeared in 9 out of the last 10 JAMB exams." },
    ],
  },
};

function getYieldPillClass(yieldBand: YieldBand): string {
  if (yieldBand === "high") {
    return "bg-brand-blue/10 text-brand-blue border border-brand-blue/20";
  }

  if (yieldBand === "medium") {
    return "bg-slate-100 text-slate-700 border border-slate-200";
  }

  return "bg-brand-gold/15 text-brand-gold border border-brand-gold/30";
}

function getYieldLabel(yieldBand: YieldBand): string {
  if (yieldBand === "high") {
    return "High-Yield";
  }

  if (yieldBand === "medium") {
    return "Medium-Yield";
  }

  return "Foundational";
}

export function CurriculumPreview() {
  return (
    <section className="py-14 md:py-18 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">The Curriculum Blueprint</h2>
          <p className="text-lg text-slate-600">
            Stop reading the textbook from Page 1. Study the topics that actually matter for your 300+ score.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-md">
          <Tabs defaultValue="chemistry" className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">Subject Preview</p>
              <span className="inline-flex items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-sm font-semibold text-brand-gold">
                Probability of Appearance (2026)
              </span>
            </div>

            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1">
              <TabsTrigger value="chemistry" className="rounded-lg px-3 sm:px-4 py-2 whitespace-nowrap">Chemistry</TabsTrigger>
              <TabsTrigger value="physics" className="rounded-lg px-3 sm:px-4 py-2 whitespace-nowrap">Physics</TabsTrigger>
              <TabsTrigger value="biology" className="rounded-lg px-3 sm:px-4 py-2 whitespace-nowrap">Biology</TabsTrigger>
              <TabsTrigger value="english" className="rounded-lg px-3 sm:px-4 py-2 whitespace-nowrap">Use of English</TabsTrigger>
            </TabsList>

            <TooltipProvider delayDuration={120}>
              {Object.entries(curriculumBlueprint).map(([key, subject]) => (
                <TabsContent key={key} value={key} className="mt-4 space-y-3">
                  {subject.topics.map((topic) => (
                    <Tooltip key={topic.name}>
                      <TooltipTrigger asChild>
                        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 cursor-help transition-colors hover:border-brand-gold">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="font-medium">{topic.name}</p>
                            <p className="text-sm font-semibold text-brand-blue">{topic.probability}%</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                            <span className={`inline-flex w-fit rounded-full px-2 py-0.5 font-semibold ${getYieldPillClass(topic.yieldBand)}`}>
                              {getYieldLabel(topic.yieldBand)}
                            </span>

                            <div className="w-full sm:w-44 h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div className="h-full rounded-full bg-brand-blue" style={{ width: `${topic.probability}%` }} />
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent side="top">
                        {topic.note ?? "Appeared in 9 out of the last 10 JAMB exams."}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TabsContent>
              ))}
            </TooltipProvider>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
