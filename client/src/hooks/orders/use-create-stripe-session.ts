import { create } from "zustand";
import { api } from "@/lib/axios";
interface ICreateStripeSessionState {
  isPending: boolean;
  error: string | null;
  createStripeSession: (id: string) => Promise<string>;
}

export const useCreateStripeSession = create<ICreateStripeSessionState>()((set) => ({
  isPending: false,
  error: null,
  data: null,
  createStripeSession: (id) => {
    return new Promise<string>((resolve, reject) => {
      set({ isPending: true, error: null });
      api
        .post(`/api/create-stripe-session/${id}`)
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
