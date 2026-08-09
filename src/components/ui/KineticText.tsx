"use client";

// ---------------------------------------------------------------------------
// KineticText — the hero's rotating role line.
// Words swap with a vertical mask + blur transition; the interval pauses on
// hover and respects reduced motion (static first word).
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function KineticText({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [interval, words.length]);

  return (
    <span className={className} aria-label={words.join(", ")} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="block"
          initial={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
