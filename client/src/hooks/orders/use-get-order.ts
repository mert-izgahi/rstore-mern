import { IOrder } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetOrderState {
  isLoading: boolean;
  error: string | null;
  data: IOrder | null;
  getOrder: (id: string) => Promise<IOrder>;
}

export const useGetOrder = create<IGetOrderState>()((set) => ({
  isLoading: false,
  error: null,
  data: null,
  getOrder: (id) => {
    return new Promise<IOrder>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-order/${id}`)
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
