import { IDataWithPagination, IProduct } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetProductsState {
  isLoading: boolean;
  error: string | null;
  data: IDataWithPagination<IProduct>;
  getProducts: (query: string) => Promise<IDataWithPagination<IProduct>>;
}

export const useGetProducts = create<IGetProductsState>()((set) => ({
  isLoading: false,
  error: null,
  data: {
    records: [],
    pagination: {
      page: 0,
      limit: 0,
      pages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    page: 0,
    limit: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  getProducts: (query) => {
    return new Promise<IDataWithPagination<IProduct>>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-products?${query}`)
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
