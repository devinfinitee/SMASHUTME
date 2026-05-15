import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Share2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import smashutmeLogo from "@/assets/smashutme-logo.webp";
import { apiFetch } from "@/lib/api-fetch";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Please enter your name.";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Please enter your email.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return undefined;
  };

  const validateSubject = (subject: string): string | undefined => {
    if (!subject.trim()) return "Please choose an inquiry category.";
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) return "Please enter your message.";
    if (message.trim().length < 10) return "Message must be at least 10 characters.";
    return undefined;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message),
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
      const response = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Navigation */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-lg z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center overflow-visible py-2 sm:py-3" aria-label="Go home">
            <img
              src={smashutmeLogo}
              alt="SmashUTME"
              className="w-10 h-10 sm:w-12 sm:h-12 object-left-top object-cover scale-[3.8] sm:scale-[4.8] lg:scale-[6] origin-left"
            />
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLocation("/about")} className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden md:block">
              About
            </button>
            <button onClick={() => setLocation("/contact")} className="text-sm font-semibold text-brand-gold hidden md:block">
              Contact
            </button>
            <Button onClick={() => setLocation("/signup")} className="rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 h-9 px-3 text-xs sm:h-10 sm:px-5 sm:text-sm">
              <span className="sm:hidden">Start Free</span>
              <span className="hidden sm:inline">Start Preparing Free</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-10 md:pt-16 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14 md:space-y-20">
          {/* Hero */}
          <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                <span className="mr-2">●</span>Support Desk
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight text-slate-900">
                We are here
                <span className="block text-brand-blue">to help.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Questions, feedback, collaboration, or mentorship requests. Reach out to the SmashUTME team and we will respond quickly with practical help.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Support team member 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmW3-yxSnb6i3OiSHYaJdyQ15n0QhUg3cdLycoG2qnW5h1YGAziNayRlBRb47K9oxQtVlXzz_jIrXi_7Er-QiGU__etE__G2DyYim341dbw0l9Hz1XSrfQZe1OSE7_E52jkKFH-XfgTmlPSDIX89KvYjJ5aohX1Cx5rKyygy5pCyt3oqDk1A_DRE5lY136TvQ0twNshkYsQuoSPn3tezgtvdaj2lM7PdbDEye53tGO9d3FUxDhO_uOpmzypSSTQUCbHrpEV3PhLCk" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Support team member 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX2xSFquvEAKObJ0xkY5ZelGtRpCy5wm7OkRzfK3z6FNImt552K2ckNNsRIe0lOd0S4slC_AbKhQ_QCg7XCmmTIPQbXrMljBKt6HqBwaO8Fm_3vqghUn_eoutdHmScOGwxgfAeosl9O2-LQmg1m18avX5QL4Khe2QLUURUayHm4yQ86lraO1QsCHd8q69IEJzvdIVW_dZVz5YDgjxEObTxrqlfAiXb1syg8xpp_wOSFm38oyTTRs4BWpSjo3bhw-ZBKtsTSht5aEI" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Support team member 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBepi2F70IStluem5iqXVhaD7kCCleiQ2gE7LMOeXCyUwbJmU24ao2GsYYuQjR-WvQYqse-Ysq8PJ8r0kyulqHN6mH8TJN4CSzK9bFaFe3q3JZrw1ByL8M-giIMDZEUevnvapJXmf6cD4Ii-toK3DI4Nh_Polh-aE4FuKMOxXx1kiwqG3ibGB4g7Bg3CwD58m0SnxIGzoMZABM6tGHOMTMn2ytf748Jod2EPLdO_HZ09JLHd1kDYZ0n1BLSNgNifRjUJl3lM61LP7k" />
                </div>
                <span className="text-sm font-medium tracking-wide text-slate-500">Our support team is online</span>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xl">
                <img className="w-full h-full object-cover opacity-85" alt="Students collaborating in a digital learning environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSocXMLgUfJx68uiix3_rIxokm2IWpHCiMY5QYtQdi2qaDanudYSQDpZHswyCWkTY9NJSahbpNLzP2ClTeBqhNVtAEpaRtPYb1eR6mgpBfSRTqspQr-mGNYPRvTLZZiMgB8Sj7211B2QpDfV-XBglcjYdpaYFYUubq4rU3-02KZrVRZt9y5bqebNw-iP6DdrIu6-mENp3xKDi3WILTxBJiH_DJFBQRqBfDgJaUfkobrbValM-2MBAUP856_a0l9N5IonIuIYWLDVo" />
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-gold rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Fast Response</p>
                  <p className="text-xs text-slate-500">Avg. time: 2 hours</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Connect */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 hover:bg-white hover:shadow-[0_32px_64px_rgba(43,10,250,0.08)] transition-all duration-300">
              <div className="w-14 h-14 bg-brand-blue rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-brand-blue/20">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">Direct support for technical issues and account inquiries.</p>
              <a className="text-brand-blue font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all" href="mailto:support@smashutme.com">
                support@smashutme.com
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>

            <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 hover:bg-white hover:shadow-[0_32px_64px_rgba(250,177,10,0.14)] transition-all duration-300">
              <div className="w-14 h-14 bg-brand-gold rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-brand-gold/30">
                <FaWhatsapp className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">Instant messaging for quick guidance and mentorship.</p>
              <a className="text-brand-gold font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all" href="https://wa.me/2348012345678" target="_blank" rel="noreferrer">
                Chat with an Advisor
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>

            <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 hover:bg-white hover:shadow-[0_32px_64px_rgba(11,28,48,0.08)] transition-all duration-300">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-slate-900/20">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">Follow us for updates, study tips, and product announcements.</p>
              <a className="text-slate-900 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all" href="#">
                @SmashUTME
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          </section>

          {/* Contact Form */}
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_32px_128px_rgba(11,28,48,0.07)] relative overflow-hidden border border-slate-200">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue"></div>
              <div className="mb-10">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Send a Message</h2>
                <p className="text-slate-600">Complete the form below and our support team will get back to you.</p>
              </div>

              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900">Message Sent!</h3>
                  <p className="text-slate-600 mb-6">Thank you for reaching out. We will get back to you within 24 hours.</p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-full border-slate-300">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Dr. Jane Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`bg-slate-50 border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-brand-blue rounded-none px-3 ${errors.name ? "border-destructive" : ""}`}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`bg-slate-50 border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-brand-blue rounded-none px-3 ${errors.email ? "border-destructive" : ""}`}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Inquiry Category</Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="w-full bg-slate-50 border-0 border-b-2 border-transparent focus:outline-none focus:border-brand-blue px-3 py-3 text-slate-900"
                    >
                      <option>General Inquiry</option>
                      <option>Technical Issue</option>
                      <option>Feedback</option>
                      <option>Mentorship</option>
                      <option>Collaboration</option>
                    </select>
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Message</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="How can we help you achieve excellence?"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={`bg-slate-50 border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-brand-blue rounded-none px-3 resize-none ${errors.message ? "border-destructive" : ""}`}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <div className="pt-1">
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-brand-blue text-white px-10 py-3 rounded-md font-bold hover:bg-brand-blue/90 transition-colors">
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Frequently Asked Questions</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
            </div>
            <div className="space-y-4">
              <details className="group rounded-xl border border-slate-200 bg-white overflow-hidden" open>
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-900">Is SmashUTME free to use?</span>
                  <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
                  SmashUTME offers a comprehensive free tier with foundational practice and core study modules. For advanced analytics and full simulated mocks, we offer a premium Precision plan.
                </div>
              </details>

              <details className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-900">How do I get started?</span>
                  <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
                  Click the Get Started button to create your account, choose your subjects, and set your UTME target score. Then begin with your high-yield roadmap.
                </div>
              </details>

              <details className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-900">Will more subjects be added?</span>
                  <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
                  Yes. Our team continuously expands and calibrates modules while staying aligned with the official JAMB syllabus.
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-md mb-8">
            <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 lg:gap-10 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold mb-3">SmashUTME Pioneer Circle</p>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-3">This is an admission movement, not just an app.</h3>
                <p className="text-slate-600 leading-relaxed">
                  SmashUTME exists for students who are serious about Medicine, Law, Engineering, and competitive admission paths. We train strategy, speed, and confidence with high-yield focus.
                </p>
                <p className="mt-4 text-sm text-slate-500">
                  Built and reviewed by an MBBS candidate who has already passed through the same pressure.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900 mb-2">Pioneer Access Status</p>
                <p className="text-3xl font-display font-bold text-brand-blue">64 / 100</p>
                <p className="text-sm text-slate-500 mt-1 mb-4">Spots already claimed for the 2026 cohort.</p>
                <Button onClick={() => setLocation("/signup")} className="w-full rounded-full bg-brand-blue text-white hover:bg-brand-blue/90">
                  Claim My Pioneer Spot
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Start Here</h4>
              <div className="space-y-2 text-slate-500">
                <button onClick={() => setLocation("/signup")} className="block hover:text-brand-blue">Create Free Account</button>
                <button onClick={() => setLocation("/login")} className="block hover:text-brand-blue">Continue Learning</button>
                <button onClick={() => setLocation("/dashboard")} className="block hover:text-brand-blue">Open Dashboard</button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Program</h4>
              <div className="space-y-2 text-slate-500">
                <a href="#" className="block hover:text-brand-blue">High-Yield Method</a>
                <a href="#" className="block hover:text-brand-blue">CBT Speed Framework</a>
                <a href="#" className="block hover:text-brand-blue">Pioneer Benefits</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
              <div className="space-y-2 text-slate-500">
                <button onClick={() => setLocation("/about")} className="block hover:text-brand-blue">About SmashUTME</button>
                <button onClick={() => setLocation("/contact")} className="block hover:text-brand-blue">Contact Team</button>
                <a href="#" className="block hover:text-brand-blue">Founder Story</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Legal</h4>
              <div className="space-y-2 text-slate-500">
                <a href="#" className="block hover:text-brand-blue">Terms of Use</a>
                <a href="#" className="block hover:text-brand-blue">Privacy Policy</a>
                <a href="#" className="block hover:text-brand-blue">Exam Disclaimer</a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500">
            <p>© 2026 SmashUTME. All rights reserved.</p>
            <p>Built in Nigeria for ambitious UTME candidates.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
