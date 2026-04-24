import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api-fetch";
import { Camera, CheckCircle2, Clock3, LogOut, Mail, Save, Target, User as UserIcon } from "lucide-react";

const STUDY_TIME_OPTIONS = [
  { value: "lt-1", label: "Less than 1 hour" },
  { value: "1-2", label: "1 to 2 hours" },
  { value: "2-4", label: "2 to 4 hours" },
  { value: "4-plus", label: "4+ hours" },
];

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { user, logout, refetchUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [targetInstitution, setTargetInstitution] = useState("");
  const [targetCourse, setTargetCourse] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || user.name || "");
    setPhoneNumber(user.phoneNumber || "");
    setTargetInstitution(user.targetInstitution || "");
    setTargetCourse(user.targetCourse || "");
    setStudyTime(user.studyTime || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user]);

  const initials = useMemo(() => {
    const source = (fullName || user?.name || "SU").trim();

    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [fullName, user?.name]);

  const handleAvatarPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setMessage(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 500_000) {
      setError("Profile pictures must be 500KB or smaller.");
      return;
    }

    const dataUrl = await toDataUrl(file);
    setAvatarUrl(dataUrl);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await apiFetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          phoneNumber,
          targetInstitution,
          targetCourse,
          studyTime,
          avatarUrl: avatarUrl || null,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save profile settings.");
      }

      setMessage(payload?.message || "Profile updated successfully.");
      await refetchUser();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <AppShell searchPlaceholder="Search profile settings...">
      <div className="relative max-w-5xl mx-auto py-8 px-4 md:px-8 space-y-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-blue/10 to-transparent blur-3xl" />
        <div className="relative space-y-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-brand-blue">Profile Settings</h1>
            <p className="text-sm text-slate-600 max-w-2xl font-medium">
              Update your personal details, study preference, and profile picture from one place.
            </p>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="rounded-3xl border border-brand-blue/20 bg-white/95 p-6 md:p-8 shadow-[0_20px_40px_rgba(43,10,250,0.08)] backdrop-blur space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="w-28 h-28 border-4 border-brand-blue/20 shadow-lg">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-slate-900 shadow-lg font-bold transition hover:bg-brand-gold/90"
                    aria-label="Upload profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                    onChange={handleAvatarPick}
                  />
                </div>

                <div className="text-center md:text-left space-y-2 flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{fullName || user.name}</h2>
                  <div className="flex items-center justify-center md:justify-start text-slate-600">
                    <Mail className="w-4 h-4 mr-2 text-brand-blue" />
                    {user.email}
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-slate-600">
                    <UserIcon className="w-4 h-4 mr-2 text-brand-blue" />
                    {user.role || "Student"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wide">Full name</label>
                  <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wide">Phone number</label>
                  <Input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="08012345678" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wide">Target institution</label>
                  <Input value={targetInstitution} onChange={(event) => setTargetInstitution(event.target.value)} placeholder="University of Ibadan" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wide">Target course</label>
                  <Input value={targetCourse} onChange={(event) => setTargetCourse(event.target.value)} placeholder="Medicine and Surgery" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-brand-blue uppercase tracking-wide">Daily study time</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STUDY_TIME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStudyTime(option.value)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all font-medium ${
                        studyTime === option.value
                          ? "border-brand-blue bg-brand-blue/10 text-brand-blue shadow-md"
                          : "border-slate-200/50 bg-slate-50 text-slate-700 hover:border-brand-gold/50 hover:bg-brand-gold/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{option.label}</span>
                        {studyTime === option.value ? <CheckCircle2 className="h-4 w-4" /> : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSave} disabled={isSaving} className="bg-brand-blue text-white hover:bg-brand-blue/90 font-bold shadow-md hover:shadow-lg transition-all">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => logout()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 to-transparent p-6 shadow-sm backdrop-blur space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/20 text-brand-blue font-bold">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">Current goal</p>
                    <p className="font-semibold text-slate-900">{targetCourse || "Set your target course"}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-brand-gold/10 border border-brand-gold/20 p-4 text-sm text-slate-600">
                  <p className="font-bold text-brand-blue mb-1">Profile picture tips</p>
                  <p className="text-slate-700">Use a square image under 500KB for the best result. The image is stored as your account avatar.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/5 to-transparent p-6 shadow-sm backdrop-blur space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold/20 text-brand-gold font-bold">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Study preference</p>
                    <p className="font-semibold text-slate-900">
                      {STUDY_TIME_OPTIONS.find((option) => option.value === studyTime)?.label || "Not set"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 font-medium">
                  This preference is used to tune reminders, pacing, and revision suggestions across the app.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
