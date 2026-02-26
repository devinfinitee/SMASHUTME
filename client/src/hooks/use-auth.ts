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

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
