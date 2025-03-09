import { api } from "@/lib/axios";
import { IStorage } from "@/lib/types";
import {create} from "zustand";

interface IState {
    isPending: boolean;
    data: IStorage | null;
    error: string | null;
    uploadStorage: (args: FormData) => Promise<IStorage | null>;
    reset: () => void;
}

export const useUploadStorage = create<IState>()((set) => ({
    isPending: false,
    data: null,
    error: null,
    uploadStorage: async (args) => {
        set({ isPending: true, data: null, error: null });
        try {
            const response = await api.post("/api/upload-storage", args);
            const { data } = await response.data;
            set({ data, error: null });
            return data;
        } catch (error: any) {
            const errorMessage =
                error.response.data.message || error.message || "An error occurred";
            set({ data: null, error: errorMessage });
        } finally {
            set({ isPending: false });
        }
    },
    reset: () => set({ isPending: false, data: null, error: null }),
}));
