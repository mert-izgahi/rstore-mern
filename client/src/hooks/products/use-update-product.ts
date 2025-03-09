import { IProduct } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { ProductInput } from "@/lib/zod";
import { useGetProduct } from "./use-get-product";

interface IUpdateProductState {
  isPending: boolean;
  error: string | null;
  updateProduct: (id: string, args: ProductInput) => Promise<IProduct>;
}

export const useUpdateProduct = create<IUpdateProductState>()((set) => ({
  isPending: false,
  error: null,
  data: null,
  updateProduct: (id, args) => {
    return new Promise<IProduct>((resolve, reject) => {
      set({ isPending: true, error: null });
      const { getProduct } = useGetProduct.getState();
      api
        .put(`/api/update-product/${id}`, args)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isPending: false });
          getProduct(id);
          resolve(data);
        })
        .catch((err) => {
          set({ isPending: false, error: err.message });
          reject(err);
        });
    });
  },
}));
