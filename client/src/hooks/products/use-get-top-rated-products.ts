import {  IProduct } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetTopRatedProductsState {
  isLoading: boolean;
  error: string | null;
  data: IProduct[];
  getTopRatedProducts: (query: string) => Promise<IProduct>;
}

export const useGetTopRatedProducts = create<IGetTopRatedProductsState>()((set) => ({
  isLoading: false,
  error: null,
  data: [],
  getTopRatedProducts: (query) => {
    return new Promise<IProduct>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-top-rated-products?${query}`)
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
