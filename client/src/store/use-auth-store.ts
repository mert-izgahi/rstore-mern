import { IAccount } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  account: IAccount | null;
  setAccount: (account: IAccount | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      account: null,
      setAccount: (account) => set({ account }),
    }),
    {
      name: "auth",
    }
  )
);

