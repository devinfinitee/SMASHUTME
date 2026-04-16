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

interface AdminLoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleInputChange = (field: keyof AdminLoginFormData, value: string) => {
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
      const response = await apiFetch("/api/auth/admin/login", {
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

      let userFromApi: { id?: string; userId?: string; name?: string; fullName?: string; email?: string; role?: string } | null = null;
      try {
        userFromApi = await response.json();
      } catch {
        userFromApi = null;
      }

      const role = userFromApi?.role;
      const allowedRoles = ["admin", "super-admin", "support", "analyst"];

      if (!role || !allowedRoles.includes(role)) {
        throw new Error("Admin access is required.");
      }

      const resolvedUserId = userFromApi?.userId || userFromApi?.id;

      setCurrentAuthUser({
        id: resolvedUserId ?? `admin-${Date.now()}`,
        userId: resolvedUserId,
        name: userFromApi?.name ?? userFromApi?.fullName ?? formData.email.split("@")[0],
        email: userFromApi?.email ?? formData.email.toLowerCase(),
        fullName: userFromApi?.fullName ?? userFromApi?.name,
        role,
        onboardingCompleted: true,
      });

      setLocation("/admin/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Admin login failed. Please try again.";
      if (message.toLowerCase().includes("password")) {
        setErrors({ password: "Incorrect password." });
      } else if (message.toLowerCase().includes("email") || message.toLowerCase().includes("account")) {
        setErrors({ email: "No admin account found with this email." });
      } else {
        setErrors({ general: message });
      }
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
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
            <span className="text-sm font-bold tracking-wider text-white uppercase">Command Center Access</span>
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
              "Restricted access for authorized operations staff only."
            </p>
            <footer className="mt-4 text-white/80 font-medium tracking-tight text-base">
              - SmashUTME Admin Security
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

            <h1 className="text-4xl font-extrabold tracking-tight text-brand-blue mb-2">Admin Login</h1>
          </div>

          <header className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">Admin Sign In</h1>
            <p className="text-base md:text-lg text-slate-600">Access SmashUTME command center tools.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5 w-full" noValidate>
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
                Admin Email Address
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
              <span className="text-slate-500">Authorized personnel only</span>
              <button type="button" onClick={() => setLocation("/reset-password")} className="text-brand-blue font-semibold hover:underline">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand-blue text-white font-bold text-base rounded-md shadow-md hover:bg-brand-blue/90 transition-all"
            >
              {isLoading ? "Signing you in..." : "Log In to Admin"}
            </Button>
          </form>

          <footer className="mt-8 pt-5 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Candidate account?
              <button onClick={() => setLocation("/login")} className="text-brand-blue font-bold hover:underline ml-1">
                Use Candidate Login
              </button>
            </p>
          </footer>

          <div className="mt-4 flex justify-center opacity-60">
            <div className="flex items-center gap-2 text-[0.625rem] font-bold tracking-widest text-slate-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Encrypted Administrative Environment
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
