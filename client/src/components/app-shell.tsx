import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Flame,
  LogOut,
  Menu,
  Search,
  Settings,
  Target,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  searchPlaceholder?: string;
};

function isActiveRoute(currentPath: string, href: string, label: string): boolean {
  if (href === "/dashboard") {
    // Several placeholder nav items currently route to /dashboard.
    // Keep active highlight exclusive to the actual Dashboard item.
    return label === "Dashboard" && (currentPath === "/dashboard" || currentPath === "/admin/dashboard");
  }
  if (href === "/syllabus") {
    return currentPath === "/syllabus" || currentPath.startsWith("/subjects") || currentPath.startsWith("/topics");
  }
  if (href === "/cbt") {
    return currentPath === "/cbt";
  }
  if (href === "/admin/question-bank") {
    return currentPath === "/admin/question-bank";
  }
  return currentPath === href;
}

export function AppShell({ children, searchPlaceholder = "Search..." }: AppShellProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { label: "Subjects", icon: BookOpen, href: "/syllabus" },
    { label: "CBT Practice", icon: BarChart3, href: "/cbt" },
    { label: "AI Review", icon: Brain, href: "/ai-review" },
    ...(location.startsWith("/admin")
      ? [{ label: "Question Bank", icon: BookOpen, href: "/admin/question-bank" }]
      : []),
    { label: "Performance", icon: TrendingUp, href: "/dashboard" },
    { label: "Study Room", icon: Users, href: "/dashboard" },
    { label: "Settings", icon: User, href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-brand-blue text-white p-2 rounded-lg"
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
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-900 flex flex-col py-8 px-4 z-40 transition-transform md:translate-x-0 border-r border-slate-100 dark:border-slate-800 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 px-4">
          <div className="flex items-center mb-2 overflow-hidden">
            <img src={smashutmeLogo} alt="SmashUTME" className="h-28 w-28 object-cover object-center scale-[2] mx-12 -my-10" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Personalised Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <div
                onClick={() => setIsMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActiveRoute(location, item.href, item.label)
                    ? "text-brand-blue dark:text-brand-blue bg-white dark:bg-white/5 border-r-4 border-brand-blue"
                    : "text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-4 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Link href="/cbt">
            <Button className="w-full bg-brand-blue text-white hover:bg-brand-blue/90">Start Mock Exam</Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">ID: 2024/JAMB/081</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center px-4 md:px-8 gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none pl-10 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-brand-blue/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative">
            <Flame className="w-5 h-5 text-brand-gold" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
          </button>

          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="hidden sm:inline-flex p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <Target className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pl-0 md:pl-64 pt-20 md:pt-16 min-h-screen">{children}</main>
    </div>
  );
}
