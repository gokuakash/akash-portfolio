"use client";

// ---------------------------------------------------------------------------
// Counter — animated metric that counts up when scrolled into view.
// Functional motion: numbers only animate once, in the viewport, then rest.
// The final value is always in the a11y tree (sr-only span) so screen
// readers hear the truth regardless of animation state.
// ---------------------------------------------------------------------------

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatMetric, prefersReducedMotion } from "@/lib/utils";

interface CounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function Counter({ value, decimals = 0, suffix = "", prefix = "", duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden>
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </span>
      <span className="sr-only">{formatMetric(value, decimals, suffix)}</span>
    </span>
  );
}
