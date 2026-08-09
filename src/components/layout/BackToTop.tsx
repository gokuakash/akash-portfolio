"use client";

// ---------------------------------------------------------------------------
// BackToTop — appears only after the user scrolls past the Hero section.
// Magnetic, labelled, keyboard-friendly. Sits above the footer CTA zone.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "motion/react";
import { Magnetic } from "@/components/ui/Magnetic";
import { useScrollProgress } from "@/lib/hooks";
import { useScroll as useLenisScroll } from "@/components/providers/ScrollProvider";

export function BackToTop() {
  const { pastHero } = useScrollProgress();
  const { scrollTo } = useLenisScroll();

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-6 right-6 z-nav"
        >
          <Magnetic strength={24}>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              aria-label="Back to top"
              data-cursor="link"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-line/15 bg-surface/80 text-ink shadow-glow-sm backdrop-blur-xl transition-all duration-300 hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}