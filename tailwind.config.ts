// ---------------------------------------------------------------------------
// Tailwind configuration — the design-token bridge between CSS variables
// (defined in globals.css) and utility classes.
//
// 2026 DESIGN RATIONALE:
// - darkMode: "class" gives us the adaptive "Low-Light UX" (Light/Dark/System).
// - Colors are references to CSS custom properties so the palette can flip
//   between matte-dark and paper-light without touching a single component.
// - Fluid type is handled with clamp() in globals.css; the `text-[clamp()]`
//   classes in JSX are pure Tailwind passthroughs.
// ---------------------------------------------------------------------------
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens → resolve to CSS vars (auto-adapt to theme)
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent-2) / <alpha-value>)",
        glow: "rgb(var(--glow) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        // "Vivid Glow" neon — a soft dual-ring bloom behind CTAs
        glow: "0 0 24px -4px rgb(var(--glow) / 0.55), 0 0 64px -12px rgb(var(--glow) / 0.4)",
        "glow-sm": "0 0 12px -2px rgb(var(--glow) / 0.5)",
      },
      transitionTimingFunction: {
        // Spring-ish easing used across microinteractions
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        "scroll-fill": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 32s) linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "scroll-fill": "scroll-fill 2.2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      zIndex: {
        cursor: "9999",
        modal: "9990",
        preloader: "10001",
        nav: "990",
        overlay: "980",
      },
    },
  },
  plugins: [],
};

export default config;
