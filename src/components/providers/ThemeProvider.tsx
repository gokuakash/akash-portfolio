"use client";

// ---------------------------------------------------------------------------
// ThemeProvider — the "Low-Light UX" (Light / Dark / System Auto).
// A tiny dependency-free implementation of the next-themes pattern:
//  - an inline script in <head> (see RootProviders) applies the stored theme
//    BEFORE first paint → zero flash-of-wrong-theme.
//  - `theme` persists to localStorage; "system" tracks prefers-color-scheme.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  cycle: () => void; // light → dark → system → …
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "akash-theme";

/** Safe storage access (SSR guards). */
function readStored(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" || v === "system" ? v : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Constant initial state on BOTH server and client first render → the
  // hydration tree always matches. The stored preference (if any) is picked
  // up right after mount, so there's never a flash or a mismatch.
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  // Read the persisted preference once hydration is done.
  useEffect(() => {
    const stored = readStored();
    if (stored && stored !== theme) setThemeState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolve "system" → concrete value, and keep it in sync live.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setResolved(theme === "system" ? (mq.matches ? "dark" : "light") : theme);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  // Reflect on <html> so every CSS var flips via the `.dark` class.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode — ignore */
    }
  }, [theme, resolved]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const cycle = useCallback(
    () => setThemeState((t) => (t === "light" ? "dark" : t === "dark" ? "system" : "light")),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/** Inline bootstrap script — executes before hydration to prevent FOUC. */
export const themeScript = `
(function () {
  try {
    var t = localStorage.getItem("${STORAGE_KEY}") || "dark";
    var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;
