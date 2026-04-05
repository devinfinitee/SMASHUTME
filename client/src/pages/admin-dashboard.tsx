import { useState } from "react";
import {
  TrendingUp,
  Users,
  Database,
  BarChart3,
  Download,
  Filter,
  Share2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/admin-shell";


function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof TrendingUp;
  color: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0_20px_40px_rgba(11,28,48,0.05)]">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</span>
        <span className={`text-xs font-bold flex items-center gap-1 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-600"}`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
          {change}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminShell>
      <div className="p-4 md:p-8 space-y-8 pb-8 lg:pb-28">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Candidates"
            value="1,204"
            change="+12%"
            icon={Users}
            color="#1C00BC"
            trend="up"
          />
          <StatCard
            label="Question Bank"
            value="15,420"
            change="Verified Entries"
            icon={Database}
            color="#2B0AFA"
          />
          <StatCard
            label="Mock Sessions"
            value="8,400"
            change="-2.4%"
            icon={BarChart3}
            color="#565E74"
            trend="down"
          />
          <StatCard
            label="SmashAI Usage"
            value="45.2%"
            change="45,210 / 100k"
            icon={Zap}
            color="#FBB20D"
          />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0_20px_40px_rgba(11,28,48,0.05)] p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Activity Distribution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">System performance over the last 14 business days</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-brand-blue/10 text-brand-blue dark:text-brand-blue rounded-lg">
                  Daily
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                  Weekly
                </button>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="flex-1 w-full min-h-[350px] relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                {/* Grid Lines */}
                {[350, 250, 150, 50].map((y) => (
                  <line key={y} opacity="0.3" stroke="#d1d5db" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1={y} y2={y} />
                ))}

                {/* Gradient */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1C00BC" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1C00BC" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area and Line */}
                <path d="M0 300 Q 150 250 250 280 T 450 180 T 700 220 T 1000 120 V 400 H 0 Z" fill="url(#chartGradient)" />
                <path d="M0 300 Q 150 250 250 280 T 450 180 T 700 220 T 1000 120" fill="none" stroke="#1C00BC" strokeWidth="3" />

                {/* Secondary Line */}
                <path d="M0 380 Q 200 350 400 320 T 650 340 T 1000 280" fill="none" stroke="#FBB20D" strokeDasharray="5 5" strokeWidth="2" />
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 hidden sm:flex gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-[3px] bg-brand-blue rounded-full"></span>
                  <span>Active Candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-[3px] bg-brand-gold rounded-full" style={{ borderTop: "2px dashed currentColor" }}></span>
                  <span>Mocks Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-gradient-to-br from-brand-blue to-blue-700 text-white p-6 rounded-xl shadow-xl overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Generate Report</h4>
                <p className="text-sm text-white/80 mb-6 leading-relaxed">Instantly compile session data into automated PDF insights.</p>
                <button className="w-full bg-white text-brand-blue font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg active:scale-[0.98]">
                  <Download className="w-4 h-4" />
                  Compile Now
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0_20px_40px_rgba(11,28,48,0.05)]">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
                Active AI Engines
              </h4>
              <div className="space-y-4">
                {[
                  { name: "Neural-01", status: "STABLE" },
                  { name: "Neural-02", status: "STABLE" },
                  { name: "Realtime Sync", status: "LATENCY: 12ms" },
                ].map((engine) => (
                  <div key={engine.name} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-brand-blue" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{engine.name}</span>
                    </div>
                    <span className="text-[10px] bg-brand-blue/10 text-brand-blue dark:text-brand-blue px-2 py-0.5 rounded font-bold">
                      {engine.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0_20px_40px_rgba(11,28,48,0.05)] overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Candidate Transactions</h3>
            <button className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline">
              View All Audit Logs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 text-left">Candidate ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 text-left">Subject Path</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 text-left">Action Taken</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 text-left">Efficiency Score</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {[
                  { initials: "JD", name: "John Doe #882", subject: "Mathematics & Physics", action: "Started Mock Session", efficiency: 85, time: "2 mins ago" },
                  { initials: "AS", name: "Amara Smith #104", subject: "Biology & Chemistry", action: "AI Diagnostic Ran", efficiency: 92, time: "15 mins ago" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue text-[10px] font-bold">
                        {row.initials}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{row.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{row.subject}</td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-gold">{row.action}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-16 bg-slate-100 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-brand-blue h-full" style={{ width: `${row.efficiency}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{row.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-slate-600 dark:text-slate-400">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Command Ribbon */}
        <div className="fixed bottom-6 right-8 left-72 z-50 hidden xl:block">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_20px_40px_rgba(11,28,48,0.05)]">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                System Monitoring Active
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-blue transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-blue transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-600 mx-2"></div>
              <button className="bg-slate-900 dark:bg-slate-700 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Dataset
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
