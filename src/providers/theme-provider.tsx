"use client";

import { useEffect } from "react";
import { useThemeStore, type ThemeType } from "@/stores/theme";

const themes: Record<ThemeType, string> = {
  "quantum-dark": "quantum-dark",
  "aether-light": "aether-light",
  "nebula-violet": "nebula-violet",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("quantum-dark", "aether-light", "nebula-violet");
    root.classList.add(themes[theme]);
  }, [theme]);

  return <>{children}</>;
}
