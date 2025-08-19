import { create } from "zustand";
import { persist } from "zustand/middleware";

import { storeManager } from "@/lib/store-manager";

import type { Session } from "better-auth";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: string; // or more specific union type
  isActive: boolean;
};

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;

  setAuth: (data: { user: User; session: Session }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      session: null,
      user: null,

      setAuth: ({ user, session }) => {
        set((state) => ({ ...state, user, session, isAuthenticated: true }));
      },
      logout: () => {
        storeManager.clearAll();
        set((state) => ({
          ...state,
          user: null,
          session: null,
          isAuthenticated: false,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        session: state.session,
        user: state.user,
      }),
    }
  )
);
