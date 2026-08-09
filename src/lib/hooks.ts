"use client";

// ---------------------------------------------------------------------------
// Behavior-driven hooks powering the "AI-first adaptable layout":
// the interface quietly reconfigures itself based on how the user behaves.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";

/**
 * Tracks scroll depth as a 0..1 progress of the whole page.
 * Used for: hero fade-out, back-to-top visibility, nav progress rail.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { progress, pastHero };
}

/**
 * The adaptive-layout brain. Subtle, honest changes only:
 *  - after the visitor has spent 20s+ with the page or visited 2+ sections,
 *    we switch to "focused" mode: ambient motion is dialed down (battery +
 *    attention win) and a "quick nav" chip row surfaces in the nav rail.
 * No tracking, no telemetry — everything stays in the browser.
 */
export function useBehaviorAdaptive() {
  const [explored, setExplored] = useState(false);
  const [dwell, setDwell] = useState(false);

  useEffect(() => {
    let visited = new Set<string>();
    let dwellTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            visited.add(entry.target.id);
            if (visited.size >= 2) setExplored(true);
          }
        }
      },
      { threshold: 0.35 },
    );

    document.querySelectorAll("main [id]").forEach((el) => observer.observe(el));
    dwellTimer = setTimeout(() => setDwell(true), 20000);

    return () => {
      observer.disconnect();
      clearTimeout(dwellTimer);
    };
  }, []);

  const focused = explored || dwell;
  return { explored, dwell, focused };
}

/** Simple resize observer hook for container-driven sizes. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

/**
 * Hydration-safe probe: returns false during the SSR render AND the very
 * first client render (so server/client trees always match), then flips to
 * the real environment value after mount. Use this instead of calling
 * `canRunWebGL()` / `prefersReducedMotion()` during render — those branches
 * otherwise produce React hydration mismatches.
 */
export function useHydratedEnv() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
