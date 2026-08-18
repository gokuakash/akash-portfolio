"use client";

// ---------------------------------------------------------------------------
// About — narrative storytelling (not a resume).
//  - Stylized duotone portrait with a subtle parallax hover (and drag-to-tilt
//    on touch — tap-to-reveal, per the mobile strategy).
//  - "Zero UI" facts: revealed on hover / drag of the portrait.
//  - D3 radar chart for hybrid skills + magnetic "Download CV" button.
// ---------------------------------------------------------------------------

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RadarChart } from "@/components/charts/RadarChart";
import { facts, radarSkills, resumeUrl } from "@/data/experience";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [factIndex, setFactIndex] = useState<number | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Parallax tilt driven by pointer position (desktop) ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  // Zero-UI reveal: while the pointer stays on the portrait, facts cycle in.
  const startCycle = () => {
    setFactIndex(0);
    cycleRef.current = setInterval(
      () => setFactIndex((i) => (i === null ? 0 : (i + 1) % facts.length)),
      1600,
    );
  };
  const stopCycle = () => {
    if (cycleRef.current) clearInterval(cycleRef.current);
    cycleRef.current = null;
    setFactIndex(null);
  };
  // Touch: tap-to-reveal (mobile strategy — no hover events exist).
  const onTap = () => {
    if (cycleRef.current) {
      stopCycle();
    } else {
      startCycle();
    }
  };

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    stopCycle();
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          kicker="01 · The Story"
          title={"I sit at the seam of\nengineering & design"}
          accent="where form asks questions of structure."
        />

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/* ---- Portrait with parallax + zero-UI facts ---- */}
          <div className="lg:col-span-5">
            <motion.div
              ref={ref}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              onClick={onTap}
              style={{ perspective: 900 }}
              data-cursor="drag"
              aria-label="Akash.S — stylized duotone portrait. Hover or drag to reveal facts."
              className="relative mx-auto aspect-[4/5] w-full max-w-md touch-pan-y"
            >
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative h-full w-full overflow-hidden rounded-3xl border border-line/10 bg-surface shadow-glow-sm"
              >
                <Image
                  src="/images/portrait.svg"
                  alt="Stylized duotone portrait of Akash.S"
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-cover"
                  priority={false}
                  draggable={false}
                />
                {/* Fact chips — hover (desktop) / tap (touch) reveals one at a time.
                    Outer span holds the orbit position; the inner motion span does the
                    scale-in so transforms never fight each other. */}
                {facts.map((fact, i) => {
                  const a = ((i * 60 - 90) * Math.PI) / 180; // orbit angle (deg→rad)
                  return (
                    <span
                      key={fact}
                      className="absolute"
                      style={{
                        left: `${50 + 38 * Math.cos(a)}%`,
                        top: `${50 + 30 * Math.sin(a)}%`,
                      }}
                      aria-hidden={factIndex !== i}
                    >
                      <motion.span
                        className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-xs font-bold text-bg shadow-glow"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={factIndex === i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {fact}
                      </motion.span>
                    </span>
                  );
                })}
              </motion.div>

              {/* Mobile hint + desktop zero-UI hint */}
              <p className="mt-6 text-center type-micro text-muted md:hidden">
                Tap the portrait to reveal facts
              </p>
              <p className="mt-6 hidden text-center type-micro text-muted md:block">
                Hover the portrait — zero-UI reveals, zero clicks
              </p>
            </motion.div>
          </div>

          {/* ---- Philosophy + radar + CTA ---- */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-serif text-2xl italic leading-relaxed md:text-3xl">
                “Good software is invisible. Great software is <span className="text-accent not-italic font-sans font-semibold">felt</span>.”
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 space-y-5 text-muted type-lede">
                <p>
                  I sit at the seam between engineering and design — where a typography system
                  becomes a brand, where a database schema becomes a business model, and where a
                  physics-based animation becomes a user&apos;s trust.
                </p>
                <p>
                  My practice is a dialogue: form questions structure, structure answers form.
                  I ship the interfaces, the pipelines behind them, and the motion that makes
                  both feel inevitable.
                </p>
              </div>
            </Reveal>

            {/* Services — exact-match keywords for search (and honest scope) */}
            <Reveal delay={0.15}>
              <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Services">
                {[
                  {
                    title: "Web Developer",
                    note: "React · Next.js · Node · fast, accessible, 99+ Lighthouse",
                  },
                  {
                    title: "Web Designer",
                    note: "Interfaces & design systems that convert and feel inevitable",
                  },
                  {
                    title: "Website Creator",
                    note: "Complete websites — from first wireframe to fast, live launch",
                  },
                  {
                    title: "Product Designer",
                    note: "UX, motion, and interaction for products people trust",
                  },
                  {
                    title: "SaaS Developer",
                    note: "Architecture, APIs and billing-grade systems at scale",
                  },
                ].map((s) => (
                  <li
                    key={s.title}
                    className="rounded-2xl border border-line/10 bg-surface p-5 transition-colors duration-300 hover:border-accent/40"
                  >
                    <h3 className="font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted">{s.note}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Hybrid skills — D3 radar */}
            <Reveal delay={0.15} className="mt-12">
              <h3 className="type-micro mb-6 text-muted">Hybrid Skill Radar — UI/UX ↔ Engineering ↔ Leadership</h3>
              <RadarChart />
              <p className="sr-only">
                {radarSkills.map((s) => `${s.label}: ${s.value}`).join(". ")}
              </p>
            </Reveal>

            <Magnetic className="mt-12 inline-block">
              <a
                href={resumeUrl}
                download
                data-cursor="link"
                className="group inline-flex h-12 items-center gap-3 rounded-full border border-line/25 pl-2 pr-6 transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-bg transition-transform duration-300 group-hover:-translate-y-0.5"
                >
                  ⤓
                </span>
                <span className="text-sm font-semibold text-ink">Download CV</span>
                <span aria-hidden className="h-4 w-px bg-line/20" />
                <span className="type-micro text-muted">PDF · 2026</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}