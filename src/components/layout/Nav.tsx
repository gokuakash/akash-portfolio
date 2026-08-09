"use client";

// ---------------------------------------------------------------------------
// Nav — the experimental desktop navigation: a hidden sidebar that expands
// on hover (and on keyboard focus). Vertical word-links with index numbers,
// a scroll progress rail, theme toggle, and the adaptive "quick nav" chips
// that surface once the visitor has explored (AI-first adaptive layout).
// Mobile gets the full-screen hamburger menu (<MobileMenu>).
// ---------------------------------------------------------------------------

import { motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Magnetic } from "@/components/ui/Magnetic";
import { nav, site } from "@/data/site";
import { useBehaviorAdaptive, useScrollProgress } from "@/lib/hooks";
import { useScroll as useLenisScroll } from "@/components/providers/ScrollProvider";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollTo, lock, unlock } = useLenisScroll();
  const { progress } = useScrollProgress();
  const { focused } = useBehaviorAdaptive();
  // Progress of the whole page → progress rail in the rail's header.
  const { scrollYProgress } = useScroll();

  // Lock the page scroll while the mobile menu is open.
  useEffect(() => {
    if (open) lock();
    else unlock();
    return () => unlock();
  }, [open, lock, unlock]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  // Collapsed-side fade: hidden links stay opacity-0 but reveal on hover,
  // and on keyboard focus-within (accessibility: never invisible-focusable).
  const fade = focused
    ? ""
    : "opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100 group-focus-within/nav:opacity-100";

  return (
    <>
      {/* ---- Top scroll progress bar (functional motion) ---- */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-overlay h-[3px] origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ---- Desktop: hover-expanding sidebar ---- */}
      <nav
        aria-label="Primary"
        className={cn(
          "fixed left-4 top-1/2 z-nav hidden -translate-y-1/2 select-none lg:block",
          !focused && "group/nav",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-1 overflow-hidden rounded-full border border-line/10 bg-surface/80 backdrop-blur-xl transition-all duration-500 ease-out-expo",
            focused
              ? "w-[220px] px-5 py-5"
              : "w-14 px-2.5 py-5 group-hover/nav:w-[220px] group-hover/nav:px-5 group-focus-within/nav:w-[220px] group-focus-within/nav:px-5",
          )}
        >
          {/* Collapsed grip / expanded brand */}
          <div className="mb-4 flex items-center gap-3 overflow-hidden">
            <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-extrabold text-bg">
              A
            </span>
            <span className={cn("whitespace-nowrap font-display font-bold", fade)}>
              Akash.dev
            </span>
          </div>

          <ul className="space-y-1.5">
            {nav.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={go(item.href)}
                  className={cn(
                    "touch-target gap-3 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-300 hover:bg-accent/10 hover:text-accent",
                    fade,
                  )}
                >
                  {focused === false && (
                    <span className="type-micro">{item.index}</span>
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Adaptive hint — appears after exploration */}
          <div className={cn("mt-4 border-t border-line/10 pt-4", focused ? "block" : "hidden")}>
            <p className="type-micro text-muted">Scroll depth — {Math.round(progress * 100)}%</p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line/10" aria-hidden>
              <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          <div className={cn("mt-4 flex", fade)}>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ---- Mobile: brand + hamburger ---- */}
      <header className="fixed inset-x-0 top-0 z-nav flex items-center justify-between px-5 py-4 lg:hidden">
        <a href="#story" onClick={go("#story")} className="glass flex items-center gap-3 rounded-full px-4 py-2" aria-label={`${site.name} — home`}>
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-sm font-extrabold text-bg">
            A
          </span>
          <span className="font-display font-bold">{site.name}.dev</span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="glass flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full"
          >
            <span aria-hidden className={cn("h-[2px] w-4 bg-ink transition-transform duration-300", open && "translate-y-[4px] rotate-45")} />
            <span aria-hidden className={cn("h-[2px] w-4 bg-ink transition-transform duration-300", open && "-translate-y-[4px] -rotate-45")} />
          </button>
        </div>
      </header>

      {/* ---- Mobile full-screen menu ---- */}
      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-nav flex flex-col justify-between glass p-8 lg:hidden">
          <div>
            <p className="type-micro text-muted">{site.role}</p>
            <ul className="mt-10 space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    className="block"
                  >
                    <span
                      className="font-display text-5xl font-extrabold tracking-tight transition-colors hover:text-accent"
                      style={{ animation: `fade-up 0.6s ${0.1 + i * 0.08}s cubic-bezier(0.16,1,0.3,1) both` }}
                    >
                      <span className="mr-3 align-top type-micro text-accent">{item.index}</span>
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <a href={`mailto:${site.email}`} className="font-mono text-sm text-muted underline underline-offset-4">
              {site.email}
            </a>
            <Magnetic>
              <span aria-hidden className="font-display text-lg font-bold text-accent">A.</span>
            </Magnetic>
          </div>
        </div>
      )}
    </>
  );
}