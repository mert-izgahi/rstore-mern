import {create} from "zustand";

interface IState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useDeleteModal = create<IState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export const useEditModal = create<IState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export const useCreateModal = create<IState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));