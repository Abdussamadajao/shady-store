import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../service";
import type {
  UpdateProfileRequest,
  UpdatePreferencesRequest,
} from "@/types/user";
import { useAuthStore } from "@/store/auth";

// Query keys for user data
export const userQueryKeys = {
  profile: ["user", "profile"] as const,
  preferences: ["user", "preferences"] as const,
  status: ["user", "status"] as const,
};

export const useUserProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: userQueryKeys.profile,
    queryFn: userApi.getUserProfile,
    enabled: !!user, // Only fetch if user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useUserPreferences = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: userQueryKeys.preferences,
    queryFn: userApi.getPreferences,
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useUserStatus = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: userQueryKeys.status,
    queryFn: userApi.getUserStatus,
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onError: (error) => {
      console.error("Failed to update user profile:", error);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile });
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully");
      // Update the profile cache
      queryClient.setQueryData(userQueryKeys.profile, data);
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: userQueryKeys.status });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: userApi.updatePreferences,
    onError: (error) => {
      console.error("Failed to update user preferences:", error);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.preferences });
    },
    onSuccess: (data) => {
      console.log("Preferences updated successfully");
      // Update the preferences cache
      queryClient.setQueryData(userQueryKeys.preferences, data);
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    updatePreferences: updatePreferencesMutation.mutate,
    updatePreferencesAsync: updatePreferencesMutation.mutateAsync,
    isLoading:
      updateProfileMutation.isPending || updatePreferencesMutation.isPending,
    errors: {
      profile: updateProfileMutation.error,
      preferences: updatePreferencesMutation.error,
    },
  };
};

// Optimistic update hooks for better UX
export const useOptimisticUserUpdates = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const optimisticUpdateProfile = async (updates: UpdateProfileRequest) => {
    if (!user) return;

    // Optimistically update the cache
    queryClient.setQueryData(userQueryKeys.profile, (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });

    try {
      // Perform the actual update
      const result = await userApi.updateProfile(updates);

      // Update cache with server response
      queryClient.setQueryData(userQueryKeys.profile, result);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.status });

      return result;
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile });
      throw error;
    }
  };

  const optimisticUpdatePreferences = async (
    updates: UpdatePreferencesRequest
  ) => {
    if (!user) return;

    // Optimistically update the cache
    queryClient.setQueryData(userQueryKeys.preferences, (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });

    try {
      // Perform the actual update
      const result = await userApi.updatePreferences(updates);

      // Update cache with server response
      queryClient.setQueryData(userQueryKeys.preferences, result);

      return result;
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: userQueryKeys.preferences });
      throw error;
    }
  };

  return {
    optimisticUpdateProfile,
    optimisticUpdatePreferences,
  };
};

// Combined hook for easy access to all user data
export const useUser = () => {
  const profile = useUserProfile();
  const preferences = useUserPreferences();
  const status = useUserStatus();
  const mutations = useUserMutations();
  const optimisticUpdates = useOptimisticUserUpdates();

  return {
    profile: profile.data,
    preferences: preferences.data,
    status: status.data,
    isLoading: profile.isLoading || preferences.isLoading || status.isLoading,
    isError: profile.isError || preferences.isError || status.isError,
    error: profile.error || preferences.error || status.error,
    mutations,
    optimisticUpdates,
    refetch: {
      profile: profile.refetch,
      preferences: preferences.refetch,
      status: status.refetch,
    },
  };
};
