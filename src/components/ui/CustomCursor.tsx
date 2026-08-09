"use client";

// ---------------------------------------------------------------------------
// CustomCursor — the playful morphing cursor (2026 smart microinteraction).
//  - Two layers: a crisp dot + a lagging ring that springs toward the dot.
//  - Morphs (scales / swaps label) over interactive hotspots.
//  - Hotspots opt in via `data-cursor="link"` | `"view"` | `"drag"` | `"close"`.
//  - Desktop pointers only (fine pointers); reduced-motion users get a
//    simple dot without the physics. Touch devices get none (native cursor).
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn, hasFinePointer, prefersReducedMotion } from "@/lib/utils";

type CursorMode = "default" | "link" | "view" | "drag" | "close";

const LABELS: Record<CursorMode, string> = {
  default: "",
  link: "",
  view: "View",
  drag: "Drag",
  close: "Close",
};

export function CustomCursor() {
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Spring physics create the "lagging ring" — functional motion that makes
  // the pointer feel weighty and deliberate.
  const ringX = useSpring(x, { stiffness: 400, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 400, damping: 30, mass: 0.6 });

  useEffect(() => {
    const fine = hasFinePointer();
    const reduced = prefersReducedMotion();
    if (!fine) return; // touch → native cursor
    setEnabled(true);
    if (!reduced) {
      // Enable the CSS rule that hides the native cursor on fine pointers.
      document.body.classList.add("has-cursor");
    }

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    // Hotspot detection: walk up from the event target looking for data-cursor.
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, [role=button], input, textarea, select, summary",
      );
      const next: CursorMode =
        (el?.getAttribute("data-cursor") as CursorMode | null) ??
        (el?.closest("a, button") ? "link" : "default");
      setMode(next);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const big = mode === "view" || mode === "drag" || mode === "close";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-cursor" data-cursor-root>
      {/* Lead dot */}
      <motion.div
        className="fixed rounded-full bg-accent"
        style={{
          x: x as unknown as number,
          y: y as unknown as number,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ width: big ? 0 : 6, height: big ? 0 : 6 }}
        transition={{ duration: 0.15 }}
      />
      {/* Trailing ring — morphs into a labelled pill over hotspots */}
      <motion.div
        className="fixed rounded-full border border-accent/70 bg-accent/10 flex items-center justify-center text-accent font-medium backdrop-blur-sm"
        style={{ x: ringX as unknown as number, y: ringY as unknown as number }}
        animate={{
          width: big ? 72 : 30,
          height: big ? 72 : 30,
          scale: mode === "link" ? 1.6 : 1,
          translateX: "-50%",
          translateY: "-50%",
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        {big && (
          <span className={cn("text-[10px] uppercase tracking-widest", mode === "close" && "text-sm")}>
            {LABELS[mode]}
          </span>
        )}
      </motion.div>
    </div>
  );
}
