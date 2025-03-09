import { IAccount } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetAccountState {
  isLoading: boolean;
  error: string | null;
  data: IAccount | null;
  getAccount: (id: string) => Promise<IAccount>;
}

export const useGetAccount = create<IGetAccountState>()((set) => ({
  isLoading: false,
  error: null,
  data: null,
  getAccount: (id) => {
    return new Promise<IAccount>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-account/${id}`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isLoading: false, data });
          resolve(data);
        })
        .catch((err) => {
          set({ isLoading: false, error: err.message });
          reject(err);
        });
    });
  },
}));
