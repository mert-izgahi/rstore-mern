import { IOrder } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { OrderInput } from "@/lib/zod";
interface ICreateOrderState {
  isPending: boolean;
  error: string | null;
  createOrder: (args: OrderInput) => Promise<IOrder>;
}

export const useCreateOrder = create<ICreateOrderState>()((set) => ({
  isPending: false,
  error: null,
  data: null,
  createOrder: (args) => {
    return new Promise<IOrder>((resolve, reject) => {
      set({ isPending: true, error: null });
      api
        .post(`/api/create-order`, args)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isPending: false });
          resolve(data);
        })
        .catch((err) => {
          set({ isPending: false, error: err.message });
          reject(err);
        });
    });
  },
}));
