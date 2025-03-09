import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ColorModeState {
    colorMode: "light" | "dark";
    toggleColorMode: () => void;
}

export const useColorMode = create<ColorModeState>()(
    persist(
        (set) => ({
            colorMode: "light",
            toggleColorMode: () =>
                set((state) => ({
                    colorMode: state.colorMode === "light" ? "dark" : "light",
                })),
        }),
        {
            name: "color-mode",
        }
    )
);

export const useColorModeValue = () => useColorMode((state) => state.colorMode);
