import { IDataWithPagination, IOrder } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetOrdersState {
  isLoading: boolean;
  error: string | null;
  data: IDataWithPagination<IOrder>;
  getOrders: (query: string) => Promise<IDataWithPagination<IOrder>>;
}

export const useGetOrders = create<IGetOrdersState>()((set) => ({
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
  getOrders: (query) => {
    return new Promise<IDataWithPagination<IOrder>>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-orders?${query}`)
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
