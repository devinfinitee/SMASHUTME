import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center overflow-visible py-2 sm:py-3" aria-label="Go to home">
            <img
              src={smashutmeLogo}
              alt="SmashUTME"
              className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
            />
          </Link>
          <Link href="/signup">
            <Button className="rounded-full bg-brand-blue text-white hover:bg-brand-blue/90">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-brand-gold/15 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12 text-brand-gold" />
        </div>
        <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          The page you are trying to open does not exist, was moved, or the link is broken.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 bg-brand-blue text-white hover:bg-brand-blue/90">
            Go Home
          </Button>
        </Link>
      </main>
    </div>
  );
}
