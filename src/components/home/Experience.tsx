"use client";

// ---------------------------------------------------------------------------
// Experience — a non-linear, interactive timeline.
//  - Horizontal, snap-scrolling rail of career milestones (drag on touch,
//    wheel + arrows on desktop) — the "experimental but intuitive" nav.
//  - Achievement-first copy: outcomes, not responsibilities.
// ---------------------------------------------------------------------------

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { timeline } from "@/data/experience";
import { metrics } from "@/data/site";

export function Experience() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="journey" aria-labelledby="journey-heading" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="03 · The Journey"
            title={"A career with\nrhythm, not résumé"}
            accent="measured in outcomes."
            className="mb-0"
          />
          {/* Rail controls */}
          <div className="flex gap-2 pb-2">
            <button type="button" onClick={() => scrollRail(-1)} aria-label="Scroll timeline left" className="flex h-11 w-11 items-center justify-center rounded-full border border-line/15 transition-colors hover:border-accent hover:text-accent">
              ←
            </button>
            <button type="button" onClick={() => scrollRail(1)} aria-label="Scroll timeline right" className="flex h-11 w-11 items-center justify-center rounded-full border border-line/15 transition-colors hover:border-accent hover:text-accent">
              →
            </button>
          </div>
        </div>
      </div>

      {/* ---- Snap-scrolling rail ---- */}
      <div
        ref={railRef}
        role="list"
        aria-label="Career and education milestones"
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
      >
        {timeline.map((role, i) => (
          <article
            key={role.id}
            role="listitem"
            className="group relative w-[min(88vw,420px)] shrink-0 snap-start rounded-3xl border border-line/10 bg-surface p-8 transition-colors duration-300 hover:border-accent/40"
          >
            {/* Node + connector */}
            <span aria-hidden className="absolute -top-3 left-8 h-6 w-6 rounded-full border-2 border-accent bg-bg shadow-glow-sm" />
            {i < timeline.length - 1 && (
              <span aria-hidden className="absolute top-0 left-[2.65rem] h-px w-[calc(100%-3rem)] bg-line/15" />
            )}

            <p className="type-micro text-accent">{role.period}</p>
            <h3 className="mt-3 font-display text-2xl font-bold">{role.company}</h3>
            <p className="mt-1 font-medium text-muted">{role.title}</p>

            <span className={`mt-4 inline-block rounded-full px-3 py-1 type-micro ${role.kind === "education" ? "bg-accent/10 text-accent" : "bg-bg/60 text-muted"}`}>
              {role.kind === "education" ? "Education" : "Work"}
            </span>

            <ul className="mt-6 space-y-3">
              {role.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-line/10 pt-5">
              {role.tags.map((t) => (
                <span key={t} className="rounded-full bg-bg/60 px-3 py-1 text-[11px] font-medium text-muted">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}

        {/* End card — the punchline */}
        <article className="grid w-[min(88vw,420px)] shrink-0 snap-start place-items-center rounded-3xl border border-dashed border-line/20 p-8 text-center">
          <div>
            <p className="font-serif text-2xl italic text-muted">…and the next chapter?</p>
            <a href="#contact" className="mt-4 inline-block font-display text-xl font-bold text-accent underline underline-offset-8">
              Let&apos;s write it together →
            </a>
          </div>
        </article>
      </div>

      {/* ---- Metrics band ---- */}
      <div className="mx-auto mt-20 max-w-7xl px-5 md:px-10">
        <Reveal>
          <dl className="grid grid-cols-2 gap-8 rounded-3xl border border-line/10 bg-surface p-8 md:grid-cols-4 md:p-12">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <dd className="font-display text-4xl font-extrabold text-accent md:text-5xl">
                  <Counter value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
                </dd>
                <dt className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">{m.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}