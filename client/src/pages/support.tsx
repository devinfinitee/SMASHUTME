import { AdminShell } from "@/components/admin-shell";

export default function Support() {
  return (
    <AdminShell searchPlaceholder="Search support tickets or candidates...">
      <div className="relative w-full min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="w-full lg:w-[320px] flex-shrink-0 flex flex-col bg-surface-container-lowest/70 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-outline-variant/20 shadow-[0_14px_30px_rgba(11,28,48,0.08)] max-h-[45vh] lg:max-h-none">
          <div className="p-5 pb-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-headline font-bold text-lg tracking-tight text-on-surface">Support Inbox</h2>
              <span className="bg-primary-container text-primary text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap">12 New</span>
            </div>
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
              <button className="bg-primary text-on-primary text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md shadow-primary/25">All Tickets</button>
              <button className="bg-white/85 text-on-surface-variant border border-outline-variant/30 text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-surface-container transition-colors">Question Errors</button>
              <button className="bg-white/85 text-on-surface-variant border border-outline-variant/30 text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-surface-container transition-colors">Payments</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-2">
            <div className="p-3.5 bg-surface-container-lowest rounded-2xl border-l-4 border-amber-500 shadow-[0_10px_24px_rgba(11,28,48,0.12)] transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-1 gap-2">
                <span className="font-headline font-bold text-sm text-on-surface">Chidimma Okafor</span>
                <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">2m ago</span>
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-tighter">Question Error</span>
                <span className="bg-indigo-100 text-indigo-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-tighter">Physics</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">Hello, I believe the option provided for question ID #4429 regarding Thermodynamics is incorrect. The calculation...</p>
            </div>

            <div className="p-3.5 bg-transparent hover:bg-surface-container-low/60 rounded-2xl transition-all duration-200 cursor-pointer group hover:shadow-sm">
              <div className="flex justify-between items-start mb-1 gap-2">
                <span className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary">Tunde Bakare</span>
                <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">14m ago</span>
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-tighter">Admission Advice</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">I have an aggregate of 285. Do you think I stand a chance for Computer Science at UNILAG? Also what...</p>
            </div>

            <div className="p-3.5 bg-transparent hover:bg-surface-container-low/60 rounded-2xl transition-all duration-200 cursor-pointer group hover:shadow-sm">
              <div className="flex justify-between items-start mb-1 gap-2">
                <span className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary">Fatima Yusuf</span>
                <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">1h ago</span>
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-tighter">Payment Issue</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">I paid for the Premium package but my dashboard still says Basic. I have attached the receipt of...</p>
            </div>

            <div className="p-3.5 bg-transparent hover:bg-surface-container-low/60 rounded-2xl transition-all duration-200 cursor-pointer group hover:shadow-sm">
              <div className="flex justify-between items-start mb-1 gap-2">
                <span className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary">Samuel Okoro</span>
                <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">3h ago</span>
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-tighter">Question Error</span>
                <span className="bg-indigo-100 text-indigo-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-tighter">English</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">The passage in Use of English Comprehension 2 has a typo that makes the second question ambiguous. Please check...</p>
            </div>
          </div>
        </section>

        <section className="min-w-0 flex overflow-hidden min-h-[55vh] lg:min-h-0">
          <div className="flex-1 min-w-0 flex flex-col bg-surface-container-low/20">
            <div className="px-6 lg:px-8 py-5 bg-surface-bright/85 backdrop-blur-sm flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border-b border-outline-variant/20">
              <div className="min-w-0">
                <h1 className="font-headline font-extrabold text-xl lg:text-2xl text-on-surface mb-1 leading-tight">Question Error: ID #4429</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]" data-icon="person">person</span>
                    Chidimma Okafor
                  </span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]" data-icon="calendar_today">calendar_today</span>
                    Oct 24, 2023 at 10:42 AM
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <button className="flex items-center gap-2 px-3.5 py-2 border border-outline-variant/30 bg-white/75 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all whitespace-nowrap">
                  <span className="material-symbols-outlined text-lg" data-icon="archive">archive</span>
                  Archive
                </button>
                <button className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-95 transition-all whitespace-nowrap">
                  <span className="material-symbols-outlined text-lg" data-icon="check">check</span>
                  Mark Resolved
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-8 py-5 lg:py-8">
              <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex gap-4">
                  <img className="w-10 h-10 rounded-full object-cover mt-1 shrink-0" data-alt="Young African woman with a serious yet friendly expression, natural lighting, soft academic library background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBozrVDu908dC1L87Ft0xA8ukUtS50aSWxaLxli3fUxYgBv4MW-5qZHCjePEfJEbecq8D5779i4taJfBFk0RJGXxZgRrkcKTY9ejUuhDUpY1frLQZisdcNXQBJTe1yUbTeXL2krlB4RbiETZYRS9KUpzM-2hVtTcLtsnwi5VO2PVqx3AB4MvtfFJmam4RLrQaRPIe7R6_UTK3FXapgbCam5ndYWAjTXJOmJXdHUkbM_U3Hjh7p6yl43keYrNNU9St1pIjgx6jLwio" />
                  <div className="flex-1 min-w-0">
                    <div className="bg-surface-container-lowest/95 p-5 lg:p-6 rounded-2xl rounded-tl-none shadow-[0_12px_26px_rgba(11,28,48,0.1)] border border-outline-variant/15">
                      <p className="text-on-surface leading-relaxed font-body text-[15px] lg:text-base">
                        Hello SmashUTME Team,
                        <br />
                        <br />
                        I am writing to report an issue with Physics Question ID #4429. The question asks for the efficient work done in a thermodynamic cycle, but according to the values given (P1=200kPa, V1=0.2m³), the resulting answer should be 40kJ, not 25kJ as listed in your answer key.
                        <br />
                        <br />
                        I have double-checked the formulas for isothermal expansion and it seems the constant is being misapplied. Could you please review this so it doesn't affect my mock exam score?
                      </p>
                      <div className="mt-5 pt-5 border-t border-outline-variant/10 flex items-center gap-4">
                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors max-w-full">
                          <span className="material-symbols-outlined text-amber-600 shrink-0" data-icon="description">description</span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-on-surface truncate">calculation_steps.jpg</p>
                            <p className="text-[9px] text-on-surface-variant">420 KB • Image</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 lg:px-8 py-5 bg-surface-bright/85 backdrop-blur-sm border-t border-outline-variant/20">
              <div className="mx-auto w-full max-w-4xl p-4 rounded-2xl border border-outline-variant/20 shadow-[0_16px_34px_rgba(11,28,48,0.12)]" style={{ background: "linear-gradient(180deg, rgba(239,244,255,0.92) 0%, rgba(229,238,255,0.82) 100%)", backdropFilter: "blur(12px)" }}>
                <div className="flex flex-wrap items-center gap-3 mb-3 border-b border-outline-variant/10 pb-3">
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="format_bold">format_bold</span></button>
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="format_italic">format_italic</span></button>
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="link">link</span></button>
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="attach_file">attach_file</span></button>
                  <div className="ml-auto min-w-0">
                    <select className="bg-transparent border-none text-[11px] font-bold text-primary focus:ring-0 cursor-pointer">
                      <option>Select Canned Response</option>
                      <option>Confirm Question Error</option>
                      <option>Request Screenshot</option>
                    </select>
                  </div>
                </div>
                <textarea className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-body resize-none placeholder:text-on-surface-variant/50 min-h-[96px]" placeholder="Type your response to Chidimma..." rows={4}></textarea>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                  <div className="flex items-center -space-x-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold shrink-0">AI</div>
                    <span className="ml-4 text-[10px] text-on-surface-variant font-medium italic truncate">AI is suggesting a correction for ID #4429...</span>
                  </div>
                  <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:brightness-110 hover:scale-[1.01] active:scale-95 flex items-center gap-2 group w-full sm:w-auto justify-center transition-all">
                    Send Reply
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" data-icon="send">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </AdminShell>
  );
}
