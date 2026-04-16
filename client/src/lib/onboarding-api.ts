import { apiFetch } from "@/lib/api-fetch";

type TargetPayload = {
  institution: string;
  course: string;
  suggestedSubjects: [string, string, string];
};

type SubjectsPayload = {
  compulsory: string;
  selected: string[];
  selectedLabels: string[];
};

type BaselinePayload = {
  confidence: string;
  scoreBand: string;
  studyTime: string;
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await apiFetch(url, {
    method: url.endsWith("complete") ? "POST" : "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error || "Unable to save onboarding data.");
  }

  return response.json() as Promise<T>;
}

export async function saveOnboardingTarget(payload: TargetPayload) {
  return postJson<{ message: string }>("/api/auth/onboarding/target", payload);
}

export async function saveOnboardingSubjects(payload: SubjectsPayload) {
  return postJson<{ message: string }>("/api/auth/onboarding/subjects", payload);
}

export async function saveOnboardingBaseline(payload: BaselinePayload) {
  return postJson<{ message: string }>("/api/auth/onboarding/baseline", payload);
}

export async function completeOnboarding() {
  return postJson<{ message: string }>("/api/auth/onboarding/complete", {});
}
