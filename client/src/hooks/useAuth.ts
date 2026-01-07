import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    staleTime: 0,
    gcTime: 300000, // 5 minutes
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error("Failed to update role");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // Auto-apply intended role after authentication and redirect to onboarding
  useEffect(() => {
    if (!user || isLoading || updateRoleMutation.isPending) {
      return;
    }

    const intendedRole = sessionStorage.getItem('intended_role');
    const shouldOnboard = sessionStorage.getItem('should_onboard') === 'true';
    const currentPath = location;

    // Skip if already on onboarding pages
    if (currentPath.startsWith('/onboarding/')) {
      return;
    }

    // If there's an intended role that doesn't match current role, update it first
    if (intendedRole && intendedRole !== user.role && ['brand', 'creator'].includes(intendedRole)) {
      updateRoleMutation.mutate(intendedRole);
      return; // Wait for mutation to complete before continuing
    }

    // Once role is correct (or no change needed), redirect to onboarding if needed
    if (shouldOnboard || intendedRole) {
      // Clear session storage
      sessionStorage.removeItem('should_onboard');
      sessionStorage.removeItem('intended_role');
      
      // Redirect based on current role
      if (user.role === 'creator') {
        setLocation('/onboarding/creator');
      } else if (user.role === 'brand') {
        setLocation('/onboarding/brand');
      }
    }
  }, [user, isLoading, updateRoleMutation.isPending, location, setLocation]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBrand: user?.role === 'brand',
    isCreator: user?.role === 'creator',
  };
}