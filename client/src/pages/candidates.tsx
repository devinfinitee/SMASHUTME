import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Filter,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Zap,
  X,
  ExternalLink,
  Flag,
  Printer,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

interface Candidate {
  id: string;
  initials: string;
  name: string;
  email: string;
  university: string;
  avgScore: number;
  joinDate: string;
  status: "Active" | "Pending" | "At Risk";
  statusColor: string;
  portraitBg: string;
}

interface SubjectScore {
  name: string;
  score: number;
  maxScore: number;
  barColor: string;
}

interface DiagnosticItem {
  label: string;
  percentage: number;
  type: "strength" | "weakness";
}

const Candidates: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedCandidateId, setSelectedCandidateId] = useState("1");
  const [showDossier, setShowDossier] = useState(false);

  const candidates: Candidate[] = [
    {
      id: "1",
      initials: "CO",
      name: "Chukwudi Okoro",
      email: "c.okoro@example.com",
      university: "University of Ibadan",
      avgScore: 312,
      joinDate: "Oct 12, 2023",
      status: "Active",
      statusColor: "emerald",
      portraitBg: "indigo",
    },
    {
      id: "2",
      initials: "AA",
      name: "Amina Abubakar",
      email: "amina.abu@domain.com",
      university: "UNILAG",
      avgScore: 265,
      joinDate: "Nov 02, 2023",
      status: "Pending",
      statusColor: "amber",
      portraitBg: "amber",
    },
    {
      id: "3",
      initials: "FB",
      name: "Fadekemi Bakare",
      email: "f.bakare@edu.ng",
      university: "Obafemi Awolowo",
      avgScore: 198,
      joinDate: "Oct 29, 2023",
      status: "At Risk",
      statusColor: "error",
      portraitBg: "slate",
    },
  ];

  const subjectScores: SubjectScore[] = [
    { name: "English Language", score: 78, maxScore: 100, barColor: "emerald" },
    { name: "Mathematics", score: 84, maxScore: 100, barColor: "on-tertiary-container" },
    { name: "Physics", score: 72, maxScore: 100, barColor: "indigo" },
    { name: "Chemistry", score: 78, maxScore: 100, barColor: "indigo" },
  ];

  const diagnosticAnalysis: DiagnosticItem[] = [
    { label: "Organic Chemistry", percentage: 92, type: "strength" },
    { label: "Calculus & Geometry", percentage: 88, type: "strength" },
    { label: "Quantum Mechanics", percentage: 34, type: "weakness" },
    { label: "Comprehension Passages", percentage: 42, type: "weakness" },
  ];

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const getScorePercentage = (score: number) => (score / 400) * 100;

  const getPortraitClass = (bg: Candidate["portraitBg"]) => {
    if (bg === "indigo") return "bg-indigo-100 text-primary";
    if (bg === "amber") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  const getScoreBarClass = (score: number) => {
    if (score >= 300) return "bg-on-tertiary-container";
    if (score >= 250) return "bg-indigo-400";
    return "bg-error";
  };

  const getSubjectBarColor = (barColor: SubjectScore["barColor"]) => {
    if (barColor === "emerald") return "#10b981";
    if (barColor === "on-tertiary-container") return "#fbb20d";
    return "#6366f1";
  };

  return (
    <AdminShell searchPlaceholder="Search candidates...">
      <main className="px-4 md:px-8 py-6 md:py-8 pb-8 xl:pb-28">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
                Candidate Management
              </h2>
              <p className="text-on-surface-variant font-body mt-1">Real-time oversight of 1,284 active university applicants.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Avg. Aggregate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-extrabold text-on-surface">284.5</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 12%
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-on-tertiary-container shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">High Performers</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-extrabold text-on-surface">142</span>
                <span className="text-xs font-bold text-on-surface-variant">/ 300+ pts</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-indigo-400 shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Test Completion</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-extrabold text-on-surface">94.2%</span>
                <span className="text-xs font-bold text-indigo-600">Active</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-error shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">At Risk</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-extrabold text-on-surface">18</span>
                <span className="text-xs font-bold text-error">Critical</span>
              </div>
            </div>
          </div>

          {/* Main Data Table */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-6 py-4 font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Candidate Name
                    </th>
                    <th className="px-6 py-4 font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Email
                    </th>
                    <th className="px-6 py-4 font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Target University
                    </th>
                    <th className="px-6 py-4 font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Avg Score
                    </th>
                    <th className="px-6 py-4 font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Join Date
                    </th>
                    <th className="px-6 py-4 font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      onClick={() => {
                        setSelectedCandidateId(candidate.id);
                        setShowDossier(true);
                      }}
                      className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                        candidate.id === "2" ? "bg-surface-container-low/30" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getPortraitClass(candidate.portraitBg)}`}
                          >
                            {candidate.initials}
                          </div>
                          <span className="text-sm font-bold text-on-surface">{candidate.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">{candidate.email}</td>
                      <td className="px-6 py-5">
                        <span className="px-2 py-1 bg-surface-variant text-[11px] font-bold rounded text-indigo-700">
                          {candidate.university}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-on-surface">{candidate.avgScore}</span>
                          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getScoreBarClass(candidate.avgScore)}`}
                              style={{ width: `${getScorePercentage(candidate.avgScore)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">{candidate.joinDate}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            candidate.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : candidate.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-error-container text-error"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              candidate.status === "Active"
                                ? "bg-emerald-500"
                                : candidate.status === "Pending"
                                  ? "bg-amber-500"
                                  : "bg-error"
                            }`}
                          />
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-surface-container flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-surface-container-low/20">
              <p className="text-xs text-on-surface-variant">Showing 1-10 of 1,284 candidates</p>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 bg-white hover:bg-surface-container-low transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 bg-primary text-white font-bold text-xs">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 bg-white hover:bg-surface-container-low transition-colors font-bold text-xs">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 bg-white hover:bg-surface-container-low transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showDossier ? (
          <button
            onClick={() => setShowDossier(false)}
            className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
            aria-label="Close candidate dossier"
          />
        ) : null}

        {/* Candidate Dossier (Slide-over Panel) */}
        <aside
          className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-[0_0_50px_rgba(11,28,48,0.15)] z-[60] border-l border-outline-variant/20 flex flex-col transition-transform duration-300 ${
            showDossier ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-5 sm:p-8 border-b border-surface-container-low flex justify-between items-start gap-4">
            <div className="flex gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold shadow-sm ${getPortraitClass(selectedCandidate.portraitBg)}`}
              >
                {selectedCandidate.initials}
              </div>
              <div>
                <h3 className="font-headline text-2xl font-extrabold text-on-surface">{selectedCandidate.name}</h3>
                <p className="text-primary font-bold text-sm">Engineering Applicant</p>
                <div className="flex items-center gap-2 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-xs text-on-surface-variant">Enugu State Center</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowDossier(false)} className="text-on-surface-variant hover:text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-10">
            {/* Subject Combination Section */}
            <section>
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Core Combination</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjectScores.map((subject, idx) => (
                  <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">{subject.name}</p>
                    <p className="text-xl font-headline font-extrabold text-on-surface mt-1">
                      {subject.score}/{subject.maxScore}
                    </p>
                    <div className="mt-2 w-full h-1 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full" style={{ width: `${(subject.score / subject.maxScore) * 100}%`, backgroundColor: getSubjectBarColor(subject.barColor) }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Diagnostic Analysis */}
            <section>
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Diagnostic Analysis</h4>
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-on-surface">Dominant Proficiencies</span>
                  </div>
                  <div className="space-y-2">
                    {diagnosticAnalysis
                      .filter((item) => item.type === "strength")
                      .map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100">
                          <span className="text-xs font-bold text-emerald-800">{item.label}</span>
                          <span className="text-xs font-extrabold text-emerald-700">{item.percentage}%</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-error" />
                    <span className="text-sm font-bold text-on-surface">Intervention Required</span>
                  </div>
                  <div className="space-y-2">
                    {diagnosticAnalysis
                      .filter((item) => item.type === "weakness")
                      .map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-error-container/20 px-4 py-3 rounded-lg border border-error/10">
                          <span className="text-xs font-bold text-on-error-container">{item.label}</span>
                          <span className="text-xs font-extrabold text-error">{item.percentage}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Recommendation CTA */}
            <section className="bg-surface-container-low p-6 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">AI Insight</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Chukwudi shows elite quantitative skills but struggles with timed reading comprehension. Suggesting the{" "}
                <b>"Precision Literacy"</b> module before the mock exam.
              </p>
              <button className="mt-4 w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                Send Personalized Study Plan
              </button>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="p-5 sm:p-8 border-t border-surface-container-low flex gap-3">
            <button className="flex-1 py-3 border border-outline-variant/30 rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all">
              Flag Profile
            </button>
            <button className="flex-1 py-3 bg-on-surface text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
              View Full Analytics
            </button>
          </div>
        </aside>

        {/* Command Ribbon */}
        <div className="fixed bottom-6 left-[calc(16rem+2rem)] right-8 bg-white/70 backdrop-blur-xl border border-white/50 h-16 rounded-2xl shadow-2xl hidden xl:flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-on-surface-variant">
              <span className="text-primary">1284</span> Total Candidates Indexed
            </span>
            <div className="h-4 w-[1px] bg-slate-300" />
            <div className="flex -space-x-2">
              <img
                className="w-6 h-6 rounded-full border-2 border-white"
                alt="candidate"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXpLZ528_yGt7Fo22T-B4RKGbN5Oz9dp4qF7oXN5Spn3Rj9vl0WkAwSyGfd7uGnd1rjMHm_V-2fmGz62DIIF1NASrQX_cGunvDlOoKQY8fZ2XVIYh_WSoWpgtbjvBCbuXNXrGTqYivNfPxnpQxKs-ItsWKtKgV29V3My24sCQCQnApxKof7k2SNhrTvHWrXu1N8eiq2TZYVg4Nq3RRLz2LREhGjCJrY07Jilm_-CVey6xmX2jGxjfomncUANvAoyQZF8yoPwed5-M"
              />
              <img
                className="w-6 h-6 rounded-full border-2 border-white"
                alt="candidate"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAziCO4ShidPo4kHdiBeb-WXC5VAHsfyHRqwygdCftrf-TVYfbUnVvH20mrVbL9BGIUvTxJ0zi4r4qp8Pxo8QQOnpKx5nX80F388YtcJrEgf6pEuCf6OCSPsEP6oTIgd7Svjc2pJbKFT9ubh0TYUnrPwX45LTvITEhAi-g8RePA4GwD_lVI7eExSLj8S5gKHXlQchDnOXaI6tQwau5CHTiGDlLe6FTBGI-cBby13t49YCInJTM9k76K8NaB5agd51n-pudwv6tWEfY"
              />
              <img
                className="w-6 h-6 rounded-full border-2 border-white"
                alt="candidate"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEljbUaTfx4EVHegn_UubarxcL6Umlyh0IkIAEw0c69k8Eq3IPspQHbeWrfjhl47MNAwUyCjASTZ6AjhtnDOd8oznbIh-rmrPE8x21M5rhP0FF8AID_UJm8yLfDC2y2ZO0brTB8Hr__ObG_nZlF3bTBHMHMJG_6xueE4TPqw5JuBtVCrT2MX790fkBI3Ru5V0JxReR4K96ZSw_x8rWN83CkgOqULzpHMhTC1bTtzU6yiFL608xMJ1W4G6pYkuqueaINw3J4uL_In0"
              />
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold">
                +1.2k
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
              <Printer className="w-4 h-4" />
              Print Manifest
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Mail className="w-4 h-4" />
              Bulk Email Candidates
            </button>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}

export default Candidates;
