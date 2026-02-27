import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types";

// Mock user for demo purposes  
const mockUser: User = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
};

async function fetchUser(): Promise<User | null> {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUser;
}

async function logout(): Promise<void> {
  // For demo purposes, just reload the page
  window.location.reload();
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
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock implementation - return a new user
  return {
    id: `user-${Date.now()}`,
    name: data.fullName,
    email: data.email,
  };
}

async function login(data: LoginData): Promise<User> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock implementation - return mock user
  return mockUser;
}

async function resetPassword(data: ResetPasswordData): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // No return value - just simulate sending email
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
