import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  TrendingUp,
  BookOpen,
  Users,
  FileText,
  Headphones,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  Search,
  X,
  Bell,
  UploadCloud,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import type { ReactNode } from "react";

type AdminShellProps = {
  children: ReactNode;
  searchPlaceholder?: string;
};

export function AdminShell({ children, searchPlaceholder = "Search..." }: AdminShellProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminNavItems = [
    { label: "Dashboard", icon: TrendingUp, href: "/admin/dashboard" },
    { label: "Topic Upload", icon: UploadCloud, href: "/admin/content-management" },
    { label: "Question Bank", icon: BookOpen, href: "/admin/question-bank" },
    { label: "Candidates", icon: Users, href: "/admin/candidates" },
    { label: "Support Desk", icon: Headphones, href: "/admin/support" },
    { label: "Revenue Engine", icon: DollarSign, href: "/admin/revenue" },
    { label: "Quiz Results", icon: FileText, href: "/admin/quiz-results" },
  ];

  function isActiveRoute(href: string) {
    return location === href;
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-on-surface">
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-primary text-on-primary p-2 rounded-lg"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isMobileOpen ? (
        <button
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          aria-label="Close navigation"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 h-full w-[18rem] max-w-[85vw] md:w-64 bg-[#0b1c30] flex flex-col py-6 px-4 z-40 border-r-0 transition-transform md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 mb-10 px-2">
          <img
            src={smashutmeLogo}
            alt="SmashUTME logo"
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-white font-extrabold tracking-tight text-xl font-headline">SmashUTME</span>
            <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">Command Center</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {adminNavItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <a
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-manrope tracking-wide text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.href)
                    ? "text-white bg-white/10 border-l-4 border-amber-500 rounded-r-none"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-6">
          <Link href="/admin/dashboard">
            <a className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white transition-colors font-manrope tracking-wide text-sm font-medium rounded-xl hover:bg-white/10">
              <Settings className="w-5 h-5" />
              Settings
            </a>
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white transition-colors font-manrope tracking-wide text-sm font-medium rounded-xl hover:bg-white/10 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <Button className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-xl">
            Generate Report
          </Button>

          <div className="flex items-center gap-3 mt-4 px-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-sm">
              {user?.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold truncate text-white">{user?.name || "Admin Unit 01"}</p>
              <p className="text-xs text-white/70 uppercase tracking-wider">Superuser</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 flex justify-between items-center px-3 sm:px-4 md:px-8 gap-3 md:gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Command Center</h2>
          <div className="hidden sm:block h-4 w-[1px] bg-slate-300"></div>
          <p className="text-sm font-medium text-slate-600 hidden sm:block">System Operations</p>
        </div>
        <div className="hidden md:block flex-1 min-w-0 max-w-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 font-body placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 text-slate-500">
          <button className="hover:text-primary transition-colors relative p-2 rounded-lg hover:bg-slate-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pl-0 md:pl-64 pt-20 md:pt-16 min-h-screen">{children}</main>
    </div>
  );
}
