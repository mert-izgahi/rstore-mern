import { create } from "zustand";
import { api } from "@/lib/axios";
interface IStripeSuccessCallbackState {
  isLoading: boolean;
  error: string | null;
  isPaid: boolean;
  checkPaymentStatus: (sessionId: string) => Promise<boolean>;
}

export const useStripeSuccessCallback = create<IStripeSuccessCallbackState>()((set) => ({
  isLoading: false,
  error: null,
  isPaid: false,
  checkPaymentStatus: (sessionId) => {
    return new Promise<boolean>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/stripe-success-callback?sessionId=${sessionId}`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isLoading: false, isPaid: data });
          resolve(data);
        })
        .catch((err) => {
          set({ isLoading: false, error: err.message });
          reject(err);
        });
    });
  },
}));
