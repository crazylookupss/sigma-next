import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "quantum-dark" | "aether-light" | "nebula-violet";

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "quantum-dark",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "sigma-theme" }
  )
);
