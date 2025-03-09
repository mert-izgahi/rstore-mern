import { IAccount } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/use-auth-store";
interface IGetMyAccountState {
  isLoading: boolean;
  error: string | null;
  data: IAccount | null;
  getMyAccount: () => Promise<IAccount>;
}

export const useGetMyAccount = create<IGetMyAccountState>()((set) => ({
  isLoading: false,
  error: null,
  data: null,
  getMyAccount: () => {
    return new Promise<IAccount>((resolve, reject) => {
      set({ isLoading: true, error: null });
      const setAuth = useAuthStore.setState;
      api
        .get(`/api/get-my-account`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isLoading: false, data });
          setAuth({ account: data });
          resolve(data);
        })
        .catch((err) => {
          set({ isLoading: false, error: err.message });
          reject(err);
        });
    });
  },
}));
