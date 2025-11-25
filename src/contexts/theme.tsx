"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  isDark: boolean | null;
  toggleTheme: () => void;
  setThemeMode: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let finalIsDark = false;

    if (theme === "system") {
      finalIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      finalIsDark = theme === "dark";
    }

    root.classList.add(finalIsDark ? "dark" : "light");
    setIsDark(finalIsDark);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newIsDark = e.matches;
      setIsDark(newIsDark);
      window.document.documentElement.classList.toggle("dark", newIsDark);
      window.document.documentElement.classList.toggle("light", !newIsDark);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme: Theme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: mounted ? isDark : null,
      toggleTheme,
      setThemeMode,
    }),
    [theme, isDark, mounted]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
