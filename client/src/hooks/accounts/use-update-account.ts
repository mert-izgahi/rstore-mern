import { IAccount } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
import { AccountInput } from "@/lib/zod";
import { useGetAccount } from "./use-get-account";
import { useAuthStore } from "@/store/use-auth-store";

interface IUpdateAccountState {
  isPending: boolean;
  isBlockPending: boolean;
  isDeletePending: boolean;
  error: string | null;
  updateAccount: (id: string, args: AccountInput) => Promise<IAccount>;
  toggleBlock: (id: string) => Promise<IAccount>;
  toggleDelete: (id: string) => Promise<IAccount>;
}

export const useUpdateAccount = create<IUpdateAccountState>()((set) => ({
  isPending: false,
  isBlockPending: false,
  isDeletePending: false,
  error: null,
  data: null,
  updateAccount: (id, args) => {
    return new Promise<IAccount>((resolve, reject) => {
      set({ isPending: true, error: null });
      const { getAccount } = useGetAccount.getState();
      const getAuth = useAuthStore.getState();
      const setAuth = useAuthStore.setState;
      api
        .put(`/api/update-account-by-id/${id}`, args)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isPending: false });
          getAccount(id);
          if (getAuth.account?._id === id) setAuth({ account: data });
          resolve(data);
        })
        .catch((err) => {
          set({ isPending: false, error: err.message });
          reject(err);
        });
    });
  },

  toggleBlock: (id) => {
    return new Promise<IAccount>((resolve, reject) => {
      set({ isBlockPending: true, error: null });
      const { getAccount } = useGetAccount.getState();
      const getAuth = useAuthStore.getState();
      const setAuth = useAuthStore.setState;
      api
        .put(`/api/toggle-account-block-by-id/${id}`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isBlockPending: false });
          getAccount(id);
          if (getAuth.account?._id === id) setAuth({ account: data });
          resolve(data);
        })
        .catch((err) => {
          set({ isBlockPending: false, error: err.message });
          reject(err);
        });
    });
  },

  toggleDelete: (id) => {
    return new Promise<IAccount>((resolve, reject) => {
      set({ isDeletePending: true, error: null });
      const { getAccount } = useGetAccount.getState();
      const getAuth = useAuthStore.getState();
      const setAuth = useAuthStore.setState;
      api
        .put(`/api/toggle-account-delete-by-id/${id}`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isDeletePending: false });
          getAccount(id);
          if (getAuth.account?._id === id) setAuth({ account: data });
          resolve(data);
        })
        .catch((err) => {
          set({ isDeletePending: false, error: err.message });
          reject(err);
        });
    });
  },
}));
