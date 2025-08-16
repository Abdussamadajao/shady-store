import { create } from "zustand";
import { persist } from "zustand/middleware";

import { storeManager } from "@/lib/store-manager";

import type { Session } from "better-auth";

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  session: Session | null;

  setAuth: (data: { user: any; session: Session }) => void;
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
