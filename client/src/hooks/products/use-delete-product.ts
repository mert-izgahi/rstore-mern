import { IProduct } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { useGetProducts } from "./use-get-products";
interface IDeleteProductState {
  isPending: boolean;
  error: string | null;
  deleteProduct: (id: string) => Promise<IProduct>;
}

export const useDeleteProduct = create<IDeleteProductState>()((set) => ({
  isPending: false,
  error: null,
  data: null,
  deleteProduct: (id) => {
    return new Promise<IProduct>((resolve, reject) => {
      set({ isPending: true, error: null });
      const { getProducts } = useGetProducts.getState();
      api
        .delete(`/api/delete-product/${id}`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isPending: false });
          getProducts("");
          resolve(data);
        })
        .catch((err) => {
          set({ isPending: false, error: err.message });
          reject(err);
        });
    });
  },
}));
