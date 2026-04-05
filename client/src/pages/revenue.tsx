import { AdminShell } from "@/components/admin-shell";

export default function Revenue() {
  return (
    <AdminShell searchPlaceholder="Search transactions, candidates...">
      <div className="relative overflow-hidden p-6 md:p-8 pb-28 lg:pb-36">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"></div>
          <div className="absolute bottom-8 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-2xl"></div>
        </div>

        <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-10 rounded-2xl border border-white/60 bg-surface-container-lowest/80 p-6 md:p-7 shadow-[0_20px_55px_rgba(11,28,48,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                <span className="material-symbols-outlined text-sm" data-icon="monitoring">monitoring</span>
                Live Financial Overview
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-manrope">Revenue Engine</h1>
              <p className="text-on-surface-variant mt-1 text-base">Track subscriptions, mock exam purchases, and gateway payouts.</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/35 active:scale-95">
              <span className="material-symbols-outlined text-base" data-icon="auto_graph">auto_graph</span>
              Forecast Summary
            </button>
          </div>
        </div>

        {/* Executive Financial Overview (Metric Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Gross Revenue Card */}
          <div className="bg-surface-container-lowest/90 p-6 rounded-2xl relative overflow-hidden group border border-primary/20 shadow-[0_14px_30px_rgba(28,0,188,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(28,0,188,0.18)]">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Gross Revenue (Nov)</span>
              <span className="text-primary flex items-center text-xs font-bold">
                <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                +12.4%
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-on-surface font-manrope">₦4,280,000</div>
            <div className="mt-4 h-12 w-full flex items-end gap-1 opacity-40">
              <div className="w-full bg-primary h-1/2 rounded-t-sm"></div>
              <div className="w-full bg-primary h-2/3 rounded-t-sm"></div>
              <div className="w-full bg-primary h-1/2 rounded-t-sm"></div>
              <div className="w-full bg-primary h-4/5 rounded-t-sm"></div>
              <div className="w-full bg-primary h-full rounded-t-sm"></div>
              <div className="w-full bg-primary h-3/4 rounded-t-sm"></div>
              <div className="w-full bg-primary h-5/6 rounded-t-sm"></div>
            </div>
          </div>

          {/* Premium Pioneers Card */}
          <div className="bg-surface-container-lowest/90 p-6 rounded-2xl border border-on-tertiary-container/30 shadow-[0_14px_30px_rgba(95,65,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(95,65,0,0.14)]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Premium Pioneers</span>
              <span className="material-symbols-outlined text-on-tertiary-container" data-icon="stars" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-on-surface font-manrope">1,842</div>
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                <span>Conversion Target</span>
                <span>92%</span>
              </div>
              <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-on-tertiary-container rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>

          {/* Gateway Payout Card */}
          <div className="bg-surface-container-lowest/90 p-6 rounded-2xl border border-secondary/30 shadow-[0_14px_30px_rgba(255,186,53,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(255,186,53,0.18)]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Next Gateway Payout</span>
              <span className="material-symbols-outlined text-secondary" data-icon="account_balance_wallet" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-on-surface font-manrope">₦842,150</div>
            <button className="mt-6 w-full py-2.5 bg-surface-container-low hover:bg-surface-container-high text-primary font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-md">
              View Payout Schedule
              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Revenue By Product & Insight Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stacked Bar Chart Area */}
          <div className="lg:col-span-3 bg-surface-container-lowest/90 p-6 md:p-8 rounded-2xl border border-outline-variant/25 shadow-[0_16px_34px_rgba(11,28,48,0.08)] relative overflow-hidden">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl"></div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-on-surface font-manrope">Revenue By Product</h3>
                <p className="text-xs text-on-surface-variant">Performance split over the last 30 days</p>
              </div>
              <div className="hidden sm:flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-on-tertiary-container"></div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Mock Exams</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">AI Tokens</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Chart Mockup */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="w-12 text-[10px] font-bold text-on-surface-variant">WEEK 1</span>
                  <div className="flex-1 h-8 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary-container" style={{ width: "45%" }}></div>
                    <div className="h-full bg-on-tertiary-container" style={{ width: "35%" }}></div>
                    <div className="h-full bg-secondary-container" style={{ width: "20%" }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-12 text-[10px] font-bold text-on-surface-variant">WEEK 2</span>
                  <div className="flex-1 h-8 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary-container" style={{ width: "30%" }}></div>
                    <div className="h-full bg-on-tertiary-container" style={{ width: "55%" }}></div>
                    <div className="h-full bg-secondary-container" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-12 text-[10px] font-bold text-on-surface-variant">WEEK 3</span>
                  <div className="flex-1 h-8 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary-container" style={{ width: "40%" }}></div>
                    <div className="h-full bg-on-tertiary-container" style={{ width: "40%" }}></div>
                    <div className="h-full bg-secondary-container" style={{ width: "20%" }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-12 text-[10px] font-bold text-on-surface-variant">WEEK 4</span>
                  <div className="flex-1 h-8 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary-container" style={{ width: "20%" }}></div>
                    <div className="h-full bg-on-tertiary-container" style={{ width: "70%" }}></div>
                    <div className="h-full bg-secondary-container" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="bg-gradient-to-br from-primary via-primary to-[#2105c8] text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-[0_18px_42px_rgba(28,0,188,0.35)] border border-white/15">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined text-8xl" data-icon="psychology">psychology</span>
            </div>
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-on-tertiary-container" data-icon="bolt" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
              </div>
              <p className="text-sm font-medium leading-relaxed italic">
                "One-off Mock Exams are driving the most revenue this week. Consider offering a discounted bundle to increase retention."
              </p>
            </div>
            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
              Draft Campaign
              <span className="material-symbols-outlined text-sm" data-icon="edit_square">edit_square</span>
            </button>
          </div>
        </div>

        {/* Plan & Pricing Manager */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-on-surface font-manrope mb-6">Plan &amp; Pricing Manager</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Blueprint Card */}
            <div className="bg-surface-container-lowest/90 p-8 rounded-2xl border border-outline-variant/30 shadow-[0_14px_30px_rgba(11,28,48,0.08)] flex flex-col">
              <div className="mb-8">
                <div className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-1">Entry Level</div>
                <h4 className="text-2xl font-black text-on-surface font-manrope">Basic Blueprint</h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-on-surface">FREE</span>
                  <span className="text-on-surface-variant text-sm">/ forever</span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-sm font-semibold">Access to 2 Mocks</span>
                  </div>
                  <div className="w-10 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-sm font-semibold">5 AI Prompts/Day</span>
                  </div>
                  <div className="w-10 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
              <button className="mt-auto w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all">
                Save Config
              </button>
            </div>

            {/* Premium Command Pass Card */}
            <div className="bg-surface-container-lowest/90 p-8 rounded-2xl border-4 border-on-tertiary-container ring-8 ring-on-tertiary-container/5 relative shadow-[0_18px_38px_rgba(95,65,0,0.16)]">
              <div className="absolute -top-4 right-8 bg-on-tertiary-container text-tertiary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <div className="mb-8">
                <div className="text-on-tertiary-fixed-variant font-bold text-xs uppercase tracking-widest mb-1">Growth Tier</div>
                <h4 className="text-2xl font-black text-on-surface font-manrope">The Command Pass</h4>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-black text-on-surface font-manrope">₦</span>
                  <input className="w-32 bg-transparent border-none p-0 text-3xl font-black text-primary focus:ring-0" type="number" defaultValue="15000" />
                  <span className="text-on-surface-variant text-sm">/ year</span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-on-tertiary-container/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-tertiary-container" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="text-sm font-semibold">Unlimited AI Tutor</span>
                  </div>
                  <div className="w-10 h-6 bg-on-tertiary-container rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-on-tertiary-container/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-tertiary-container" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="text-sm font-semibold">Full Syllabus Access</span>
                  </div>
                  <div className="w-10 h-6 bg-on-tertiary-container rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
              <button className="mt-auto w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Update Pricing
              </button>
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger */}
        <div className="bg-surface-container-lowest/90 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-[0_16px_32px_rgba(11,28,48,0.08)]">
          <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface font-manrope">Live Transaction Ledger</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs" data-icon="filter_list">filter_list</span>
                <select className="bg-surface-container-low border-none rounded-lg py-2 pl-8 pr-10 text-xs font-bold text-on-surface focus:ring-0">
                  <option>All Status</option>
                  <option>Success</option>
                  <option>Failed</option>
                </select>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Date/Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Plan/Item</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Method</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">Nov 24, 2023</div>
                    <div className="text-[10px] text-on-surface-variant">14:22 PM</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">CO</div>
                      <div className="text-sm font-semibold text-on-surface">Chidi Okoro</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-black uppercase rounded-full">Command Pass</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">₦15,000</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">Paystack / Card</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-all" title="View Receipt">
                        <span className="material-symbols-outlined text-lg" data-icon="receipt">receipt</span>
                      </button>
                      <button className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-all" title="Refund">
                        <span className="material-symbols-outlined text-lg" data-icon="undo">undo</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">Nov 24, 2023</div>
                    <div className="text-[10px] text-on-surface-variant">13:10 PM</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-[10px]">AA</div>
                      <div className="text-sm font-semibold text-on-surface">Aminu Adamu</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary-container/30 text-secondary text-[10px] font-black uppercase rounded-full">Full Mock (Biology)</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">₦2,500</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">Flutterwave / USSD</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-error-container text-error text-[10px] font-bold uppercase rounded-full">
                      <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                      Failed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-50">
                      <button className="p-2 disabled cursor-not-allowed">
                        <span className="material-symbols-outlined text-lg" data-icon="receipt">receipt</span>
                      </button>
                      <button className="p-2 disabled cursor-not-allowed">
                        <span className="material-symbols-outlined text-lg" data-icon="undo">undo</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">Nov 23, 2023</div>
                    <div className="text-[10px] text-on-surface-variant">10:45 AM</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-on-tertiary-container/20 flex items-center justify-center text-on-tertiary-container font-bold text-[10px]">EB</div>
                      <div className="text-sm font-semibold text-on-surface">Esther Bello</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary-fixed text-primary text-[10px] font-black uppercase rounded-full">AI Token Bundle</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">₦1,200</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">Paystack / Bank Transfer</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-all" title="View Receipt">
                        <span className="material-symbols-outlined text-lg" data-icon="receipt">receipt</span>
                      </button>
                      <button className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-all" title="Refund">
                        <span className="material-symbols-outlined text-lg" data-icon="undo">undo</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface-container-low/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs font-medium text-on-surface-variant">Showing 1 to 3 of 1,240 entries</div>
            <div className="flex gap-1 self-start sm:self-auto">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant/30 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-surface-container-low transition-all">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-surface-container-low transition-all">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant/30 text-on-surface">
                <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Command Ribbon (Glassmorphic Tray) */}
      <div className="fixed bottom-5 right-6 z-50 hidden lg:flex w-auto max-w-[90vw] items-center gap-6 rounded-full border border-white/60 bg-surface-container-lowest/85 px-8 py-4 shadow-[0_20px_40px_rgba(11,28,48,0.15)] backdrop-blur-xl">
        <div className="flex items-center gap-3 pr-6 border-r border-outline-variant/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-tighter text-on-surface">Live Feed Active</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl" data-icon="tune">tune</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl" data-icon="history">history</span>
          </button>
          <button className="ml-4 px-6 py-2 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            System Audit
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
