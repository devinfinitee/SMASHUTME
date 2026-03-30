import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types";
import {
  clearCurrentAuthUser,
  getCurrentAuthUser,
  loginLocalUser,
  registerLocalUser,
  setCurrentAuthUser,
} from "@/lib/local-auth";

async function fetchUser(): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getCurrentAuthUser();
}

async function logout(): Promise<void> {
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = registerLocalUser({
    fullName: data.fullName,
    email: data.email,
    password: data.password,
  });
  setCurrentAuthUser(user);
  return user;
}

async function login(data: LoginData): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = loginLocalUser({ email: data.email, password: data.password });
  setCurrentAuthUser(user);
  return user;
}

async function resetPassword(data: ResetPasswordData): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
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
