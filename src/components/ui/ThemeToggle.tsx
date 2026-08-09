"use client";

// ---------------------------------------------------------------------------
// ThemeToggle — the Low-Light UX control (Light → Dark → System cycle).
// ---------------------------------------------------------------------------

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, cycle } = useTheme();

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Color theme: ${theme}. Click to switch.`}
      title={`Theme: ${theme} (click to change)`}
      className={
        "group relative inline-flex h-11 w-11 items-center justify-center rounded-full " +
        "border border-line/15 bg-surface/60 transition-colors duration-300 hover:border-accent " +
        "focus-visible:outline-2 focus-visible:outline-accent " +
        (className ?? "")
      }
    >
      <span aria-hidden className="relative block h-5 w-5">
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="absolute inset-0 text-accent transition-all duration-500 ease-out-expo group-hover:rotate-45"
          style={{ opacity: theme === "light" ? 1 : 0, transform: theme === "light" ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-90deg)" }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute inset-0 text-accent transition-all duration-500 ease-out-expo"
          style={{ opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(90deg)" }}
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
        {/* Auto: sun half + moon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="absolute inset-0 text-accent transition-all duration-500 ease-out-expo"
          style={{ opacity: theme === "system" ? 1 : 0, transform: theme === "system" ? "scale(1)" : "scale(0.4)" }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
          <path d="M19 14.5a5.5 5.5 0 0 1-9.5 3.9A6.5 6.5 0 1 0 19 14.5Z" fill="currentColor" stroke="none" opacity="0.55" />
        </svg>
      </span>
    </button>
  );
}
