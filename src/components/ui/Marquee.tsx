"use client";

// ---------------------------------------------------------------------------
// Marquee — infinite wordmark loop for clients/tech.
// Two identical copies animate via a single CSS keyframe; the second copy is
// aria-hidden. Pauses on hover (respectful, readable). Reduced motion falls
// back to a static, non-scrolling row.
// ---------------------------------------------------------------------------

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: readonly string[];
  className?: string;
  /** seconds for one full loop */
  duration?: number;
}

export function Marquee({ items, className, duration = 32 }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden py-6 select-none [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      aria-label="Client and technology wordmarks"
    >
      <div className="flex w-max items-center gap-16 motion-reduce:animate-none animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-16">
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="font-display text-2xl font-semibold text-muted/60 transition-colors duration-300 hover:text-ink whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
