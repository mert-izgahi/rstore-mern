import { IAccount } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/use-auth-store";

interface IState {
  isPending: boolean;
  data: IAccount | null;
  error: string | null;
  authAsGuest: () => Promise<void>;
  reset: () => void;
}

export const useAuthAsGuest = create<IState>()((set) => ({
  isPending: false,
  data: null,
  error: null,
  authAsGuest: async () => {
    set({ isPending: true, data: null, error: null });
    const setAuth = useAuthStore.setState;
    try {
      const response = await api.post("/api/auth-as-guest");
      const { data } = await response.data;
      console.log(data);
      
      setAuth({
        isAuthenticated: true,
        account: data,
      });
      set({ data, error: null });
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.message || "An error occurred";
      setAuth({
        isAuthenticated: false,
        account: null,
      });
      set({ data: null, error: errorMessage });
    } finally {
      set({ isPending: false });
    }
  },
  reset: () => set({ isPending: false, data: null, error: null }),
}));
