"use client";

// ---------------------------------------------------------------------------
// Reveal — the standard scrollytelling entrance.
// Fades + rises + un-blurs content when it enters the viewport (once).
// Reduced-motion users see plain content instantly.
// ---------------------------------------------------------------------------

import { motion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
  // Post-hydration reduced-motion probe. Branching during render would
  // mismatch the server tree, so the switch only happens after mount.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return <div className={className}>{children}</div>;

  const variants: Variants = {
    hidden: { opacity: 0, y, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
