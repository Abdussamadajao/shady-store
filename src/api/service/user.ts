import { axiosInstance } from "@/lib/axios";
import type {
  User,
  UserProfile,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
} from "@/types/user";

export const userApi = {
  // Authentication - handled by Better Auth at /api/auth/*
  // These endpoints are managed by the auth system, not direct API calls

  // User Profile Management - matches existing routes
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get("/users/profile");
    return response.data.profile;
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get("/users/profile");
    return response.data.profile;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await axiosInstance.put("/users/profile", data);
    return response.data.profile;
  },

  updatePreferences: async (
    data: UpdatePreferencesRequest
  ): Promise<UserProfile> => {
    const response = await axiosInstance.put("/users/preferences", data);
    return response.data;
  },

  getPreferences: async (): Promise<{ preferences: any; settings: any }> => {
    const response = await axiosInstance.get("/users/preferences");
    return response.data;
  },

  getUserStatus: async (): Promise<any> => {
    const response = await axiosInstance.get("/users/status");
    return response.data.status;
  },

  // Note: Password change, avatar upload, and other features
  // would need to be implemented in the backend routes first
  // For now, we're using the existing implemented routes
};
