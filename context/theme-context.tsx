"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "fajarmart-theme";

function applyThemeToDocument(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

/**
 * Reads the theme already applied by the anti-flicker inline script in
 * app/layout.tsx (runs before hydration), so this lazy initializer reads the
 * exact same value the browser already painted — no effect needed to "catch up".
 */
function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    applyThemeToDocument(next);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
