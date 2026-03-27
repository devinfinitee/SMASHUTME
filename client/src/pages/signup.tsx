import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import heroImage from "@/assets/hero.webp";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  terms?: string;
}

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return "Please enter your full name.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Please enter a valid email address.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password must be at least 8 characters.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Password must include a number and uppercase letter.";
    }
    return undefined;
  };

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      terms: agreedToTerms ? undefined : "You must agree to the Terms and Privacy Policy.",
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: "",
          password: formData.password,
          subjects: [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.message?.includes("email")) {
          setErrors({ email: "Email is already registered." });
        }
        throw new Error(error.message || "Sign up failed");
      }

      setLocation("/dashboard");
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = "/api/auth/google";
  };

  const getPasswordStrength = (): { strength: string; color: string } => {
    const { password } = formData;
    if (!password) return { strength: "", color: "" };
    if (password.length < 8) return { strength: "Weak", color: "text-brand-gold" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { strength: "Medium", color: "text-brand-gold" };
    }
    return { strength: "Strong", color: "text-brand-blue" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50">
      <section className="hidden md:flex md:w-1/2 h-full bg-brand-blue relative flex-col items-center justify-start px-8 py-12 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-blue/60 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-gold/40 blur-[120px] rounded-full" />

        <div className="relative z-10 w-full flex flex-col items-center gap-5">
          <img
            src={smashutmeLogo}
            alt="SmashUTME"
            className="h-20 w-auto"
          />

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

      <section className="flex-1 h-full bg-white flex flex-col justify-center px-5 py-6 md:px-12 lg:px-16 overflow-hidden">
        <div className="w-full max-w-xl mx-auto">
          <div className="md:hidden mb-8 text-center">
            <div className="flex justify-center mb-8">
              <img
                src={smashutmeLogo}
                alt="SmashUTME"
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-blue mb-2">SmashUTME</h1>
          </div>

          <header className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">Claim Your Pioneer Spot</h1>
            <p className="text-base md:text-lg text-slate-600">Enter your details to access the high-yield syllabus.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5 w-full" noValidate>
            <div className="relative">
              <Input
                id="fullName"
                placeholder=" "
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="peer h-12 border-0 border-b-2 border-slate-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-blue text-base"
              />
              <Label htmlFor="fullName" className="absolute left-0 top-3 text-slate-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-blue peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Full Name
              </Label>
              {errors.fullName && <p className="text-sm text-brand-gold mt-1">{errors.fullName}</p>}
            </div>

            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="peer h-12 border-0 border-b-2 border-slate-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-blue text-base"
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
              {passwordStrength.strength && (
                <p className={`text-xs mt-1 ${passwordStrength.color}`}>Password strength: {passwordStrength.strength}</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <Label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                I agree to the {" "}
                <a href="#" className="text-brand-blue font-semibold hover:underline">Terms of Service</a>
                {" "}and {" "}
                <a href="#" className="text-brand-blue font-semibold hover:underline">Privacy Protocol</a>.
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-brand-gold">{errors.terms}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand-blue text-white font-bold text-base rounded-md shadow-md hover:bg-brand-blue/90 transition-all"
            >
              {isLoading ? "Creating your account..." : "Create Free Account"}
            </Button>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-[0.6875rem] font-bold text-slate-400 uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
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
              Already have an account?
              <button onClick={() => setLocation("/login")} className="text-brand-blue font-bold hover:underline ml-1">
                Log in
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
