import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import heroImage from "@/assets/hero.webp";
import { setCurrentAuthUser } from "@/lib/local-auth";
import { apiFetch } from "@/lib/api-fetch";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const oauthFailed =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("oauth") === "failed";

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Please enter your email.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password field cannot be empty.";
    return undefined;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || "Unable to login.");
      }

      let userFromApi: { id?: string; name?: string; fullName?: string; email?: string } | null = null;
      try {
        userFromApi = await response.json();
      } catch {
        userFromApi = null;
      }

      const onboardingCompleted = Boolean((userFromApi as { onboardingCompleted?: boolean } | null)?.onboardingCompleted);
      const role = (userFromApi as { role?: string } | null)?.role;

      setCurrentAuthUser({
        id: userFromApi?.id ?? `local-${Date.now()}`,
        name: userFromApi?.name ?? userFromApi?.fullName ?? formData.email.split("@")[0],
        email: userFromApi?.email ?? formData.email.toLowerCase(),
        fullName: userFromApi?.fullName ?? userFromApi?.name,
        onboardingCompleted,
        role,
      });

      setLocation(role === "admin" || role === "super-admin" ? "/admin/dashboard" : onboardingCompleted ? "/user/dashboard" : "/onboarding/target");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
      if (message.toLowerCase().includes("password")) {
        setErrors({ password: "Incorrect password." });
      } else if (message.toLowerCase().includes("email") || message.toLowerCase().includes("account")) {
        setErrors({ email: "No account found with this email." });
      } else {
        setErrors({ general: message });
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50">
      <section className="hidden md:flex md:w-1/2 h-full bg-brand-blue relative flex-col items-center justify-start px-8 pt-8 pb-4 lg:px-12 lg:pt-10 lg:pb-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-blue/60 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-gold/40 blur-[120px] rounded-full" />

        <div className="relative z-10 w-full flex flex-col items-center gap-2">
          <div className="flex items-center justify-center">
            <div className="bg-white/95 rounded-2xl border border-white/80 px-4 py-0.5 shadow-2xl">
              <div className="relative w-[320px] h-[64px] overflow-hidden flex items-center justify-center">
                <img
                  src={smashutmeLogo}
                  alt="SmashUTME"
                  className="absolute left-1/2 -translate-x-1/2 -top-[118px] h-[320px] w-[320px] max-w-none"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full border border-white/20">
            <span className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full border-2 border-brand-blue bg-white/90" />
              <span className="w-7 h-7 rounded-full border-2 border-brand-blue bg-brand-gold/70" />
              <span className="w-7 h-7 rounded-full border-2 border-brand-blue bg-brand-gold" />
            </span>
            <span className="text-sm font-bold tracking-wider text-white uppercase">Trusted by 100+ Pioneers</span>
          </div>

          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-white/10 rounded-3xl rotate-3 scale-95 border border-white/10" />
            <img
              src={heroImage}
              alt="Founder portrait"
              className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10"
            />
          </div>

          <blockquote className="border-l-4 border-brand-gold pl-6 text-center max-w-md">
            <p className="text-xl font-light text-white leading-relaxed italic">
              "Join the students mastering the 80/20 syllabus."
            </p>
            <footer className="mt-4 text-white/80 font-medium tracking-tight text-base">
              - Precision Learning Framework
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="flex-1 h-full bg-white flex flex-col justify-center px-5 py-4 md:px-12 lg:px-16 overflow-hidden">
        <div className="w-full max-w-xl mx-auto">
          <div className="md:hidden mb-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white rounded-2xl border border-slate-200 px-3 py-1 shadow-md">
                <div className="relative w-[270px] h-[56px] overflow-hidden flex items-center justify-center">
                  <img
                    src={smashutmeLogo}
                    alt="SmashUTME"
                    className="absolute left-1/2 -translate-x-1/2 -top-[98px] h-[270px] w-[270px] max-w-none"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-brand-blue mb-2">SmashUTME</h1>
          </div>

          <header className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-base md:text-lg text-slate-600">Continue your high-yield preparation.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5 w-full" noValidate>
            {oauthFailed && (
              <div className="rounded-md border border-brand-gold/40 bg-brand-gold/10 p-3 text-sm text-brand-gold">
                Google login failed. Please try again or use your email and password.
              </div>
            )}

            {errors.general && (
              <div className="rounded-md border border-brand-gold/40 bg-brand-gold/10 p-3 text-sm text-brand-gold">
                {errors.general}
              </div>
            )}

            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="peer h-12 border-0 border-b-2 border-slate-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-blue text-base"
                autoComplete="email"
              />
              <Label htmlFor="email" className="absolute left-0 top-3 text-slate-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-blue peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Email Address
              </Label>
              {errors.email && <p className="text-sm text-brand-gold mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="peer h-12 border-0 border-b-2 border-slate-300 rounded-none px-0 pr-10 focus-visible:ring-0 focus-visible:border-brand-blue text-base"
                autoComplete="current-password"
              />
              <Label htmlFor="password" className="absolute left-0 top-3 text-slate-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-blue peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Secure Password
              </Label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-3 text-slate-400 hover:text-brand-blue transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-sm text-brand-gold mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Secure login enabled</span>
              <button type="button" onClick={() => setLocation("/reset-password")} className="text-brand-blue font-semibold hover:underline">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand-blue text-white font-bold text-base rounded-md shadow-md hover:bg-brand-blue/90 transition-all"
            >
              {isLoading ? "Signing you in..." : "Log In"}
            </Button>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-[0.6875rem] font-bold text-slate-400 uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 border-slate-300 bg-white text-slate-700 text-sm rounded-md shadow-sm hover:bg-slate-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google SSO
            </Button>
          </form>

          <footer className="mt-8 pt-5 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Do not have an account?
              <button onClick={() => setLocation("/signup")} className="text-brand-blue font-bold hover:underline ml-1">
                Create Account
              </button>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Admin user?
              <button onClick={() => setLocation("/admin/login")} className="text-brand-blue font-bold hover:underline ml-1">
                Go to Admin Login
              </button>
            </p>
          </footer>

          <div className="mt-4 flex justify-center opacity-60">
            <div className="flex items-center gap-2 text-[0.625rem] font-bold tracking-widest text-slate-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Encrypted Diagnostic Environment
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
