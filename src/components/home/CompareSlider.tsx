"use client";

// ---------------------------------------------------------------------------
// CompareSlider — drag-and-drop before/after comparison for process
// iterations ("v1 wireframe" vs "shipped"). Keyboard accessible via a
// visually-hidden range input; pointer + touch driven via pointer events.
// The "before" side renders the same poster desaturated/blurred so no extra
// image assets are needed — swap with real screenshots for production.
// ---------------------------------------------------------------------------

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CompareSliderProps {
  image: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
}

export function CompareSlider({ image, beforeLabel = "v1 Wireframe", afterLabel = "Shipped", alt }: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-[16/9] w-full touch-none select-none overflow-hidden rounded-2xl border border-line/15",
        dragging && "cursor-grabbing",
      )}
      onPointerMove={(e) => dragging && updateFromClientX(e.clientX)}
      onPointerDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      role="group"
      aria-label={`Before and after comparison: ${beforeLabel} versus ${afterLabel}`}
    >
      {/* AFTER (base layer) */}
      <img src={image} alt={`${afterLabel} — final design`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />

      {/* BEFORE (clipped layer, treated as the early iteration) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={image}
          alt={`${beforeLabel} — early iteration`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(1) contrast(0.85) blur(1.5px)" }}
          draggable={false}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-10 w-[3px] bg-accent shadow-glow-sm"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        aria-hidden
      >
        <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-bg shadow-glow">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 5 3 10l5 5M12 5l5 5-5 5" />
          </svg>
        </span>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-bg/80 px-3 py-1 type-micro text-ink backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-accent px-3 py-1 type-micro text-bg">
        {afterLabel}
      </span>

      {/* Accessible, invisible range control (keyboard users) */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`Adjust comparison position between ${beforeLabel} and ${afterLabel}`}
        className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize"
        onPointerDown={(e) => {
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
      />
    </div>
  );
}