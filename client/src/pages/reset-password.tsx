import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const PublicNav = (
    <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <button onClick={() => setLocation("/")} className="flex items-center overflow-visible py-2 sm:py-3" aria-label="Go to home">
          <img
            src={smashutmeLogo}
            alt="SmashUTME"
            className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
          />
        </button>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/login")} className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Log In
          </Button>
          <Button onClick={() => setLocation("/signup")} className="rounded-full bg-brand-blue text-white hover:bg-brand-blue/90">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Please enter your email.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      // For security, we show success message even if email doesn't exist
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
        {PublicNav}
        <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-brand-blue" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Check Your Email</h1>
            <p className="text-slate-600 dark:text-slate-400">
              If your email exists in our system, a password reset link has been sent to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please check your inbox and spam folder. The link will expire in 1 hour.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="w-full rounded-full border-slate-300 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>

            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="w-full text-sm text-brand-blue hover:underline"
            >
              Send another reset link
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {PublicNav}
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Reset Your Password</h1>
          <p className="text-slate-600 dark:text-slate-400">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={`pl-10 border-slate-300 dark:border-slate-700 ${error ? "border-destructive" : ""}`}
                autoComplete="email"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full rounded-full bg-brand-blue text-white hover:bg-brand-blue/90" disabled={isLoading}>
            {isLoading ? "Sending reset link..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => setLocation("/login")}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-blue inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
