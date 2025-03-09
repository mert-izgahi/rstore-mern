import { IProduct } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetProductState {
  isLoading: boolean;
  error: string | null;
  data: IProduct | null;
  getProduct: (id: string) => Promise<IProduct>;
}

export const useGetProduct = create<IGetProductState>()((set) => ({
  isLoading: false,
  error: null,
  data: null,
  getProduct: (id) => {
    return new Promise<IProduct>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-product/${id}`)
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
