import { IProduct } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { ProductInput } from "@/lib/zod";
interface ICreateProductState {
  isPending: boolean;
  error: string | null;
  createProduct: (args: ProductInput) => Promise<IProduct>;
}

export const useCreateProduct = create<ICreateProductState>()((set) => ({
  isPending: false,
  error: null,
  data: null,
  createProduct: (args) => {
    return new Promise<IProduct>((resolve, reject) => {
      set({ isPending: true, error: null });
      api
        .post(`/api/create-product`, args)
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
