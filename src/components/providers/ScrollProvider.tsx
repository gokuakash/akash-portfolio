"use client";

// ---------------------------------------------------------------------------
// ScrollProvider — Lenis smooth scrolling (the "buttery" 60fps inertia).
//  - Exposes `scrollTo(selector)` for anchor links so navigation is smooth
//    even inside the app (Lenis hijacks native anchor jumps).
//  - Pauses itself while modals / the mobile menu lock the body.
//  - Honors prefers-reduced-motion by skipping Lenis entirely.
// ---------------------------------------------------------------------------

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface ScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number, offset?: number) => void;
  lock: () => void;
  unlock: () => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Reduced-motion users get native scrolling — never fight the OS.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09, // inertia curve — fast enough to feel alive, slow enough to glide
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback((target: string | number, offset = 0) => {
    if (typeof target === "number") {
      if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.2 });
      else window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(target);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
    } else {
      (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const lock = useCallback(() => lenisRef.current?.stop(), []);
  const unlock = useCallback(() => lenisRef.current?.start(), []);

  return (
    <ScrollContext.Provider value={{ lenis, scrollTo, lock, unlock }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used inside <ScrollProvider>");
  return ctx;
}
