"use client";

// ---------------------------------------------------------------------------
// Preloader — the branded "voltage" intro.
// A masked Syne name wipe + Fraunces percentage counter + accent progress
// line, then a two-layer curtain exit (panel + a trailing accent band that
// chases it up, revealing the page). The site is fully static (prerendered,
// self-hosted fonts), so the timeline is pure clock — no network waits, no
// FOUC. Reduced-motion users get a near-instant fade instead of the curtain.
// Renders identically on server and first client render (timer-driven), so
// it is hydration-safe by construction.
// ---------------------------------------------------------------------------

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { useScroll } from "@/components/providers/ScrollProvider";

const NAME = "AKASH.S";

// Site-wide easing signatures (kept as tuples so motion's types are happy).
const OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CURTAIN: [number, number, number, number] = [0.87, 0, 0.13, 1];

const CHAR_IN_MS = 800; // name wipe-in
const COUNT_MS = 1250; // counter 0 → 100
const HOLD_MS = 150; // beat of silence before the curtain
const EXIT_MS = 900; // curtain slide-up

export function Preloader() {
  const { lock, unlock } = useScroll();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  // Post-hydration probe: environment checks never run at render time.
  const [reduced, setReduced] = useState(false);

  // Lock the page while the curtain is up, release when it's lifted.
  // Keyed on `done` — this component stays mounted, so the lock cannot live
  // in a mount-only effect (its cleanup would never run).
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (done) {
      unlock();
      document.body.style.overflow = "";
    } else {
      lock();
      document.body.style.overflow = "hidden";
    }
  }, [done, lock, unlock]);

  // Timeline: counter runs while the name wipes in, then the curtains lift.
  useEffect(() => {
    if (reduced) {
      setCount(100);
      const t = setTimeout(() => setDone(true), 300);
      return () => clearTimeout(t);
    }
    const controls = animate(0, 100, {
      duration: COUNT_MS / 1000,
      ease: OUT_EXPO,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    const t = setTimeout(() => setDone(true), CHAR_IN_MS + COUNT_MS + HOLD_MS);
    return () => {
      controls.stop();
      clearTimeout(t);
    };
  }, [reduced]);

  const fast = reduced ? { duration: 0.01 } : undefined;

  return (
    <AnimatePresence>
      {!done && [
        // Trailing accent band — behind the main panel, lifts a beat later so
        // it reads as a color afterglow chasing the curtain's bottom edge.
        <motion.div
          key="preloader-accent"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-preloader bg-accent/[0.07]"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: fast ?? { duration: 0.7, delay: 0.06, ease: CURTAIN },
          }}
        />,
        // Main panel — holds the name, counter, and progress line.
        <motion.div
          key="preloader"
          aria-hidden
          className="grid-paper fixed inset-0 z-preloader bg-bg"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: fast ?? { duration: EXIT_MS / 1000, ease: CURTAIN } }}
        >
          <div className="relative flex h-full flex-col justify-between px-6 py-7 md:px-12">
            {/* Top row — provenance */}
            <motion.div
              className="flex items-baseline justify-between"
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <span className="type-micro text-ink">Akash.S — Portfolio</span>
              <span className="type-micro text-muted">© 2026</span>
            </motion.div>

            {/* Center — the name wipe */}
            <motion.div
              className="flex flex-col items-center gap-5 text-center"
              exit={{ opacity: 0, y: -32, transition: { duration: 0.3 } }}
            >
              <div
                aria-hidden
                className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] leading-none font-semibold tracking-[-0.045em]"
              >
                {NAME.split("").map((ch, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "112%", rotate: 4 }}
                      animate={{ y: "0%", rotate: 0 }}
                      transition={{
                        duration: CHAR_IN_MS / 1000,
                        ease: OUT_EXPO,
                        delay: reduced ? 0 : 0.06 + i * 0.034,
                      }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                  </span>
                ))}
              </div>
              <motion.p
                className="type-micro text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: reduced ? 0 : 0.55 }}
              >
                {site.tagline}
              </motion.p>
            </motion.div>

            {/* Bottom row — role + live counter */}
            <div>
              <motion.div
                className="mb-4 flex items-end justify-between"
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
              >
                <span className="type-micro hidden text-muted md:block">{site.role}</span>
                <span className="flex items-baseline gap-3">
                  <span className="type-micro text-muted">Loading</span>
                  <span className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-none italic tabular-nums text-accent">
                    {String(count).padStart(3, "0")}
                  </span>
                </span>
              </motion.div>

              {/* Progress line — traces the counter, then rides the curtain up */}
              <motion.div className="h-[3px] w-full bg-line/10">
                <motion.div
                  className="h-full w-full bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: COUNT_MS / 1000, ease: OUT_EXPO, delay: reduced ? 0 : 0.1 }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>,
      ]}
    </AnimatePresence>
  );
}
