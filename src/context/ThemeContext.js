import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const themes = {
  light: "light",
  dark: "dark",
};

export const themeColors = {
  light: {
    bgPage: "#ffffff",
    bgSubtle: "#fafafa",
    bgMuted: "#f5f5f5",
    textPrimary: "#111111",
    textSecondary: "#333333",
    textMuted: "#555555",
    textLight: "#666666",
    borderLight: "#e5e5e5",
    accent: "#1a1a1a",
    accentHover: "#2d2d2d",
    buttonText: "#ffffff",
  },
  dark: {
    bgPage: "#0c0a06",
    bgSubtle: "#141210",
    bgMuted: "#1c1914",
    textPrimary: "#f5e6c8",
    textSecondary: "#e8d5b5",
    textMuted: "#c9b896",
    textLight: "#a89870",
    borderLight: "#2d2819",
    accent: "#d4af37",
    accentHover: "#e8c547",
    buttonText: "#0c0a06",
  },
};

const defaultTheme = themes.dark;

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("saliheen-theme");
      return saved === themes.dark ? themes.dark : themes.light;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("saliheen-theme", theme);
    } catch (_) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === themes.light ? themes.dark : themes.light));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === themes.dark,
    colors: themeColors[theme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export default ThemeContext;
