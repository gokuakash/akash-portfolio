"use client";

// ---------------------------------------------------------------------------
// Magnetic — button magnetism (smart microinteraction).
// Wraps any element and translates it toward the cursor within a radius,
// snapping back with a spring when the pointer leaves. Physics only on
// fine pointers; reduced-motion users get a static (still clickable) child.
// ---------------------------------------------------------------------------

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How far the element may travel toward the cursor, in px. */
  strength?: number;
}

export function Magnetic({ children, className, strength = 18 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // Distance falloff so elements near the edge pull less.
    const dist = Math.hypot(relX, relY);
    const pull = Math.max(0, 1 - dist / 140);
    x.set(relX * 0.32 * pull * (strength / 18));
    y.set(relY * 0.32 * pull * (strength / 18));
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx as unknown as number, y: sy as unknown as number }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
