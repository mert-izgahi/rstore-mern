import { IOrder } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { useGetOrder } from "./use-get-order";

interface IUpdateOrderStatusState {
  isPending: boolean;
  error: string | null;
  updateOrderStatus: (id: string, status: string) => Promise<IOrder>;
}

export const useUpdateOrderStatus = create<IUpdateOrderStatusState>()(
  (set) => ({
    isPending: false,
    error: null,
    data: null,
    updateOrderStatus: (id, status) => {
      return new Promise<IOrder>((resolve, reject) => {
        set({ isPending: true, error: null });
        const { getOrder } = useGetOrder.getState();
        api
          .put(`/api/update-order-status/${id}`, { status })
          .then(async (res) => {
            const { data } = await res.data;
            set({ isPending: false });
            getOrder(id);
            resolve(data);
          })
          .catch((err) => {
            set({ isPending: false, error: err.message });
            reject(err);
          });
      });
    },
  })
);
