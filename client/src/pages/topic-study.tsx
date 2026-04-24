import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import { useTopic, useUpdateProgress } from "@/hooks/use-topics";
import { AiHelper } from "@/components/ai-helper";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Sparkles,
} from "lucide-react";

export default function TopicStudy() {
  const [, params] = useRoute("/topics/:slug");
  const { data: topic, isLoading } = useTopic(params?.slug || "");
  const { mutate: updateProgress } = useUpdateProgress();

  useEffect(() => {
    if (topic && params?.slug) {
      updateProgress({ slug: params.slug, status: "in_progress" });
    }
  }, [topic, params?.slug, updateProgress]);

  const subjectName = topic?.subject?.name || "Subject";
  const subjectSlug = topic?.subject?.slug || "";

  if (isLoading) {
    return (
      <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
        <div className="p-6 md:p-10">
          <div className="mx-auto max-w-4xl space-y-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4" />
            <div className="h-40 bg-slate-200 rounded-3xl" />
            <div className="h-72 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!topic) {
    return (
      <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
        <div className="p-6 md:p-10">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_40px_rgba(11,28,48,0.05)]">
            <h1 className="text-2xl font-black text-slate-900">Topic not found</h1>
            <p className="mt-2 text-slate-600">The selected topic could not be loaded.</p>
            <Link href={subjectSlug ? `/subjects/${subjectSlug}` : "/user/dashboard"}>
              <Button className="mt-6 bg-brand-blue text-white hover:bg-brand-blue/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const masteryLevel = topic.isHighYield ? 72 : 58;
  const highYieldSummary = topic.highYieldSummary || topic.summary || `Focus here first. ${topic.name} is commonly tested in UTME.`;
  const keyDefinitions = topic.keyDefinitions && topic.keyDefinitions.length > 0
    ? topic.keyDefinitions
    : ["Key terms for this topic will be listed here."];
  const simpleExplanationText = topic.simpleExplanation || topic.content || "No simple explanation is available for this topic yet.";
  const importantFormulasFacts = topic.importantFormulasFacts && topic.importantFormulasFacts.length > 0
    ? topic.importantFormulasFacts
    : ["No important formulas/facts have been added yet."];
  const sections = Array.isArray(topic.sections)
    ? [...topic.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  const hasSections = sections.length > 0;
  const learningGoals = topic.learningGoals && topic.learningGoals.length > 0 ? topic.learningGoals : [];
  const prerequisites = topic.prerequisites && topic.prerequisites.length > 0 ? topic.prerequisites : [];
  const jambFocus = topic.jambFocus && topic.jambFocus.length > 0 ? topic.jambFocus : [];
  const aiExplanation = {
    whyCorrectIsCorrect:
      topic.aiExplanations?.whyCorrectIsCorrect ||
      "The correct option follows directly from the key concept and tested rule for this topic.",
    whyOthersAreWrong:
      topic.aiExplanations?.whyOthersAreWrong ||
      "Other options usually miss a definition, rule condition, or required step in the reasoning.",
    simpleBreakdown:
      topic.aiExplanations?.simpleBreakdown ||
      "1) Identify the tested concept. 2) Apply the right rule. 3) Eliminate distractors quickly.",
  };

  return (
    <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
      <main className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="reading-canvas mx-auto max-w-4xl pt-2 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-primary-container text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-widest">
                  {subjectName.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/15">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface">
                    Exam Weightage: <span className="text-primary-container font-extrabold">{topic.isHighYield ? "15%" : "8%"}</span>
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">{topic.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Mastery Level</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${masteryLevel}%` }} />
                </div>
                <span className="text-xs font-bold text-primary">{masteryLevel}%</span>
              </div>
            </div>
          </div>

          <article className="bg-surface-container-lowest clinical-shadow rounded-3xl border border-outline-variant/15 overflow-hidden">
            <div className="px-5 sm:px-8 md:px-12 py-8 md:py-16 space-y-8">
              <section className="max-w-none">
                <h2 className="text-2xl font-bold text-on-surface mb-4">High-Yield Summary</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg">{highYieldSummary}</p>
              </section>

              {(topic.overview || topic.referenceBook || learningGoals.length > 0 || prerequisites.length > 0 || jambFocus.length > 0) && (
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  {topic.overview && (
                    <div className="mb-5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-2">Overview</h3>
                      <p className="text-slate-700 leading-relaxed">{topic.overview}</p>
                    </div>
                  )}

                  {topic.referenceBook && (
                    <p className="text-sm text-slate-700 mb-4">
                      <span className="font-bold text-slate-900">Reference Book:</span> {topic.referenceBook}
                    </p>
                  )}

                  {learningGoals.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Learning Goals</h4>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                        {learningGoals.map((goal, index) => (
                          <li key={`${goal}-${index}`}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prerequisites.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Prerequisites</h4>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                        {prerequisites.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {jambFocus.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">JAMB Focus</h4>
                      <div className="flex flex-wrap gap-2">
                        {jambFocus.map((item, index) => (
                          <span key={`${item}-${index}`} className="inline-flex items-center rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold px-3 py-1">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              <section>
                <div className="bg-tertiary-fixed/20 p-6 border-l-4 border-tertiary-fixed-dim rounded-r-lg relative my-2">
                  <div className="absolute -top-3 -left-3 bg-tertiary-fixed-dim text-white w-7 h-7 flex items-center justify-center rounded-full shadow-sm">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <p className="text-on-tertiary-fixed font-semibold italic">
                    {topic.isHighYield
                      ? `High-Yield: ${topic.name} is a priority topic for UTME preparation.`
                      : "Build understanding from the core definitions before moving to advanced drills."}
                  </p>
                </div>
              </section>

              <section>
                <div className="border-l-4 border-primary-container pl-6 py-2 mb-6">
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Key Definitions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyDefinitions.map((definition, index) => (
                    <div key={`${definition}-${index}`} className="p-5 bg-surface-container-low rounded-lg">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Definition {index + 1}</span>
                      <p className="text-sm font-medium text-on-surface">{definition}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-on-surface mb-3">Simple Explanation</h3>
                <div className="text-on-surface-variant leading-relaxed text-base bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <ReactMarkdown>{simpleExplanationText}</ReactMarkdown>
                </div>
              </section>

              {hasSections && (
                <section className="space-y-5">
                  <h2 className="text-2xl font-bold text-on-surface">Section Breakdown</h2>
                  {sections.map((section, index) => {
                    const sectionParagraphs = section.aiExplanation?.paragraphs || [];

                    return (
                      <article key={`${section.sectionTitle}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                        <header>
                          <h3 className="text-xl font-bold text-slate-900">{section.sectionTitle}</h3>
                          {section.definition && <p className="text-sm text-slate-600 mt-1">{section.definition}</p>}
                        </header>

                        {section.explanation && (
                          <div className="text-slate-700 leading-relaxed">
                            <ReactMarkdown>{section.explanation}</ReactMarkdown>
                          </div>
                        )}

                        {section.illustrationImageUrl && (
                          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img
                              src={section.illustrationImageUrl}
                              alt={`${section.sectionTitle} illustration`}
                              className="w-full max-h-80 object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {section.examples && section.examples.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Examples</p>
                            <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                              {section.examples.map((example, exampleIndex) => (
                                <li key={`${example}-${exampleIndex}`}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.jambPoint && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">JAMB Point</p>
                            <p className="text-sm text-amber-900">{section.jambPoint}</p>
                          </div>
                        )}

                        {section.quickTip && (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">Quick Tip</p>
                            <p className="text-sm text-emerald-900">{section.quickTip}</p>
                          </div>
                        )}

                        {sectionParagraphs.length > 0 && (
                          <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">AI Explanation</p>
                            <div className="space-y-2">
                              {sectionParagraphs.map((paragraph, paragraphIndex) => (
                                <p key={`${paragraph}-${paragraphIndex}`} className="text-sm text-slate-700 leading-relaxed">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </section>
              )}

              <section className="bg-on-surface text-surface-container-lowest p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-4 h-4 text-tertiary-fixed-dim" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-surface-variant">Important Formulas / Facts</h3>
                </div>
                <ul className="space-y-3">
                  {importantFormulasFacts.map((fact, index) => (
                    <li key={`${fact}-${index}`} className="text-surface-variant text-sm leading-relaxed list-disc ml-5">
                      {fact}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-4">
                <h2 className="text-2xl font-bold text-on-surface mb-4">AI Explanations</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue mb-2">Why Correct Answer Is Correct</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiExplanation.whyCorrectIsCorrect}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700 mb-2">Why Others Are Wrong</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiExplanation.whyOthersAreWrong}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700 mb-2">Simple Breakdown</p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{aiExplanation.simpleBreakdown}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-surface-container px-5 sm:px-8 md:px-12 py-5 md:py-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <Link href={subjectSlug ? `/subjects/${subjectSlug}` : "/user/dashboard"}>
                <button className="flex items-center justify-center gap-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Topic
                </button>
              </Link>
              <Link href={`/topics/${topic.slug}/quiz`}>
                <button className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded shadow-sm font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95">
                  Next: Take Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </article>
        </div>
      </main>

      <AiHelper topicContext={`Topic: ${topic.name}. Content: ${topic.content}`} />
    </AppShell>
  );
}
