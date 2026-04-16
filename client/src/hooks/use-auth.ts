import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types";
import {
  clearCurrentAuthUser,
  getCurrentAuthUser,
  setCurrentAuthUser,
} from "@/lib/local-auth";
import { apiFetch } from "@/lib/api-fetch";

async function fetchUser(): Promise<User | null> {
  try {
    const response = await apiFetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      clearCurrentAuthUser();
      return null;
    }

    const data = await response.json();
    const backendUser = data?.user;

    const resolvedUserId = backendUser?.userId || backendUser?.id;

    if (!resolvedUserId || !backendUser?.email) {
      clearCurrentAuthUser();
      return null;
    }

    const normalizedUser: User = {
      id: resolvedUserId,
      userId: resolvedUserId,
      name: backendUser.name || backendUser.fullName || "SmashUTME User",
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      fullName: backendUser.fullName,
      role: backendUser.role,
      status: backendUser.status,
      authProvider: backendUser.authProvider,
      avatarUrl: backendUser.avatarUrl,
      onboardingCompleted: backendUser.onboardingCompleted,
    };

    setCurrentAuthUser(normalizedUser);
    return normalizedUser;
  } catch {
    clearCurrentAuthUser();
    return null;
  }
}

async function logout(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore API logout errors and still clear local state.
  }

  clearCurrentAuthUser();
}

interface SignUpData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  subjects?: string[];
}

interface LoginData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  email: string;
}

async function signUp(data: SignUpData): Promise<User> {
  const response = await apiFetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error || "Unable to sign up.");
  }

  const userFromApi = await response.json();
  const resolvedUserId = userFromApi.userId || userFromApi.id;

  if (!resolvedUserId || !userFromApi.email) {
    throw new Error("Sign up response is missing user identity data.");
  }

  const user: User = {
    id: resolvedUserId,
    userId: resolvedUserId,
    name: userFromApi.name || userFromApi.fullName || data.fullName,
    email: userFromApi.email || data.email.toLowerCase(),
    firstName: userFromApi.firstName,
    lastName: userFromApi.lastName,
    fullName: userFromApi.fullName,
    role: userFromApi.role,
    status: userFromApi.status,
    authProvider: userFromApi.authProvider,
    avatarUrl: userFromApi.avatarUrl,
    onboardingCompleted: userFromApi.onboardingCompleted,
  };

  setCurrentAuthUser(user);
  return user;
}

async function login(data: LoginData): Promise<User> {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error || "Unable to login.");
  }

  const userFromApi = await response.json();
  const resolvedUserId = userFromApi.userId || userFromApi.id;

  if (!resolvedUserId || !userFromApi.email) {
    throw new Error("Login response is missing user identity data.");
  }

  const user: User = {
    id: resolvedUserId,
    userId: resolvedUserId,
    name: userFromApi.name || userFromApi.fullName || data.email.split("@")[0],
    email: userFromApi.email || data.email.toLowerCase(),
    firstName: userFromApi.firstName,
    lastName: userFromApi.lastName,
    fullName: userFromApi.fullName,
    role: userFromApi.role,
    status: userFromApi.status,
    authProvider: userFromApi.authProvider,
    avatarUrl: userFromApi.avatarUrl,
    onboardingCompleted: userFromApi.onboardingCompleted,
  };

  setCurrentAuthUser(user);
  return user;
}

async function resetPassword(data: ResetPasswordData): Promise<void> {
  void data;
  await new Promise((resolve) => setTimeout(resolve, 600));
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/auth/user"], null);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (user) => {
      queryClient.setQueryData(["/auth/user"], user);
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(["/auth/user"], user);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  });

  return {
    user,
    isLoading,
    refetchUser: refetch,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
  };
}
