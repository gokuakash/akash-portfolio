"use client";

// ---------------------------------------------------------------------------
// Testimonials — drag-to-scroll carousel.
// Physics-driven drag with snap-back centering (Framer Motion drag + springs),
// plus arrow buttons and dots. Content is fully in the a11y tree.
// ---------------------------------------------------------------------------

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/insights";

const CARD_W = 340; // desktop design width — the measure hook overrides at runtime
const GAP = 24;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  // Real rendered card width — cards are min(88vw, 340px), so snap offsets
  // must follow the live layout, not the desktop constant.
  const [cardW, setCardW] = useState(CARD_W);
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 160, damping: 24 });

  const step = cardW + GAP;
  const maxX = Math.max(0, testimonials.length * step - GAP - cardW);

  // Measure the first card (ResizeObserver handles rotation / resizing).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const first = track.querySelector<HTMLElement>("figure");
      if (first) setCardW(first.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // If the layout changes under a snapped card (resize, rotation), re-snap.
  useEffect(() => {
    x.set(-index * (cardW + GAP));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardW]);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(testimonials.length - 1, i));
    setIndex(clamped);
    x.set(-clamped * (cardW + GAP));
  };

  return (
    <section aria-labelledby="testimonials-heading" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="05 · Kind Words"
            title={"Colleagues say\nit better than I can"}
            className="mb-0"
          />
          <div className="flex gap-2 pb-2">
            <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-line/15 transition-colors hover:border-accent hover:text-accent">
              ←
            </button>
            <button type="button" onClick={() => goTo(index + 1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-line/15 transition-colors hover:border-accent hover:text-accent">
              →
            </button>
          </div>
        </div>
      </div>

      {/* ---- Drag track ---- */}
      <Reveal className="mt-12">
        <div
          ref={trackRef}
          className="overflow-hidden"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          <motion.div
            className="flex w-max gap-6 px-5 md:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
            style={{ x: xSpring as unknown as number }}
            drag="x"
            dragConstraints={{ left: -maxX, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              const delta = info.offset.x < -60 ? 1 : info.offset.x > 60 ? -1 : 0;
              const velocity = info.velocity.x < -300 ? 1 : info.velocity.x > 300 ? -1 : 0;
              goTo(index + (velocity || delta));
            }}
          >
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                aria-hidden={i !== index}
                className="relative w-[min(88vw,340px)] shrink-0 rounded-3xl border border-line/10 bg-surface p-8"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="currentColor" aria-hidden>
                  <path d="M9.6 4C5.9 6.6 4 10 4 14.2c0 3.4 2 5.8 4.9 5.8 2.5 0 4.3-1.8 4.3-4.2 0-2.3-1.6-4-3.8-4-.4 0-1 .1-1 .1.3-2.1 2.2-4.3 4.1-5.4L9.6 4Zm10 0c-3.6 2.6-5.6 6-5.6 10.2 0 3.4 2 5.8 4.9 5.8 2.5 0 4.3-1.8 4.3-4.2 0-2.3-1.6-4-3.8-4-.4 0-1 .1-1 .1.3-2.1 2.2-4.3 4.1-5.4L19.6 4Z" />
                </svg>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-line/10 pt-4">
                  <p className="font-display font-bold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {t.role}, {t.company}
                  </p>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Testimonial pages">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-accent" : "w-2.5 bg-line/25 hover:bg-line/50"}`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}