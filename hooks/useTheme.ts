"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Solo en el cliente
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem("lapole-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
      document.documentElement.dataset.theme = stored === "dark" ? "" : "light";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setThemeState("light");
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("lapole-theme", t);
    document.documentElement.dataset.theme = t === "dark" ? "" : "light";
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("lapole-theme", next);
      document.documentElement.dataset.theme = next === "dark" ? "" : "light";
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme, mounted };
}
