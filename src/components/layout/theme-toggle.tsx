"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useThemeStore, type ThemeType } from "@/stores/theme";
import { motion } from "framer-motion";

const themeOptions: { theme: ThemeType; icon: React.ReactNode; label: string }[] = [
  { theme: "quantum-dark", icon: <Moon size={16} />, label: "Dark" },
  { theme: "aether-light", icon: <Sun size={16} />, label: "Light" },
  { theme: "nebula-violet", icon: <Sparkles size={16} />, label: "Violet" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-1 bg-accent/50 rounded-lg p-1">
      {themeOptions.map((opt) => (
        <motion.button
          key={opt.theme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(opt.theme)}
          className={`p-2 rounded-md transition-colors duration-200 ${
            theme === opt.theme
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={opt.label}
        >
          {opt.icon}
        </motion.button>
      ))}
    </div>
  );
}
