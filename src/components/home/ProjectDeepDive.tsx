"use client";

// ---------------------------------------------------------------------------
// ProjectDeepDive — full-screen "Process Deep Dive" overlay.
// 1. The Problem  2. The Process (iterations + compare slider)
// 3. The Solution  4. Quantifiable Results (animated counters + bars)
// Accessibility: aria-modal dialog, focus trap, Esc close, scroll lock
// (Lenis pauses so the page behind can't scroll), labelled regions.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Counter } from "@/components/ui/Counter";
import { CompareSlider } from "./CompareSlider";
import { useScroll as useLenisScroll } from "@/components/providers/ScrollProvider";

interface ProjectDeepDiveProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDeepDive({ project, onClose }: ProjectDeepDiveProps) {
  const { lock, unlock } = useLenisScroll();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [hasOpened, setHasOpened] = useState(false);

  // Scroll lock + focus management while the modal is open.
  useEffect(() => {
    if (!project) return;
    lock();
    setHasOpened(true);
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [project, lock, unlock, onClose]);

  // Re-trigger the KPI counters whenever a new project opens.
  useEffect(() => {
    setHasOpened(false);
    requestAnimationFrame(() => setHasOpened(true));
  }, [project?.id]);

  const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-modal overflow-y-auto bg-bg/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dd-title"
        >
          <motion.div
            ref={dialogRef}
            className="relative mx-auto my-6 w-[min(1080px,94vw)] overflow-hidden rounded-3xl border border-line/15 bg-surface shadow-2xl md:my-12"
            initial={{ y: 60, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={stopPropagation}
          >
            {/* ---- Header ---- */}
            <header className="relative border-b border-line/10 p-6 md:p-10">
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                data-cursor="close"
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line/15 text-ink transition-colors hover:border-accent hover:text-accent"
              >
                ✕
              </button>

              <p className="type-micro text-muted">
                {project.year} · {project.industry} · {project.role}
              </p>
              <h2 id="dd-title" className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
                {project.title}
              </h2>
              <p className="mt-4 max-w-2xl text-muted type-lede">{project.tagline}</p>

              {/* Stack + links */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {project.stack.map((t) => (
                  <span key={t} className="rounded-full border border-line/15 px-3 py-1 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={project.live} target="_blank" rel="noreferrer" data-cursor="link" className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-bg shadow-glow-sm transition hover:brightness-110">
                  Live site ↗
                </a>
                <a href={project.repo} target="_blank" rel="noreferrer" data-cursor="link" className="inline-flex h-11 items-center gap-2 rounded-full border border-line/20 px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.813 1.102.813 2.22 0 1.604-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </header>

            {/* ---- 01 · Problem ---- */}
            <section aria-labelledby="dd-problem" className="p-6 md:p-10">
              <h3 id="dd-problem" className="type-micro mb-4 flex items-center gap-3 text-accent">
                <span className="font-display text-lg">01</span> The Problem
              </h3>
              <p className="max-w-3xl text-lg leading-relaxed text-ink/90">{project.problem}</p>
            </section>

            {/* ---- 02 · Process (iterations) ---- */}
            <section aria-labelledby="dd-process" className="p-6 md:p-10">
              <h3 id="dd-process" className="type-micro mb-6 flex items-center gap-3 text-accent">
                <span className="font-display text-lg">02</span> The Process — Iterations
              </h3>

              {/* Drag-to-compare iteration */}
              <CompareSlider
                image={project.image}
                beforeLabel="v1 Wireframe"
                afterLabel="Shipped"
                alt={`${project.title} before and after`}
              />

              <div className="mt-8 space-y-6">
                {project.process.map((phase) => (
                  <div key={phase.phase} className="rounded-2xl border border-line/10 bg-bg/40 p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-xl font-bold">
                        <span className="text-accent">{phase.phase}</span> · {phase.title}
                      </h4>
                      <span className="type-micro text-muted">{phase.weight}% of effort</span>
                    </div>
                    <p className="mt-3 text-muted">{phase.body}</p>
                    {/* Phase weight rail — mini data visualization */}
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line/10" aria-hidden>
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={hasOpened ? { width: `${phase.weight}%` } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ---- 03 · Solution ---- */}
            <section aria-labelledby="dd-solution" className="p-6 md:p-10">
              <h3 id="dd-solution" className="type-micro mb-4 flex items-center gap-3 text-accent">
                <span className="font-display text-lg">03</span> The Solution
              </h3>
              <ul className="space-y-4">
                {project.solution.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent shadow-glow-sm" />
                    <p className="text-ink/90 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* ---- 04 · Quantifiable Results ---- */}
            <section aria-labelledby="dd-results" className="border-t border-line/10 p-6 md:p-10">
              <h3 id="dd-results" className="type-micro mb-8 flex items-center gap-3 text-accent">
                <span className="font-display text-lg">04</span> Quantifiable Results
              </h3>
              <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {project.results.map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    className="rounded-2xl border border-line/10 bg-bg/40 p-6 text-center"
                    initial={{ opacity: 0, y: 24 }}
                    animate={hasOpened ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <dd className="font-display text-3xl font-extrabold text-accent md:text-4xl">
                      <Counter value={kpi.value} suffix={kpi.suffix} decimals={kpi.decimals ?? 0} />
                    </dd>
                    <dt className="mt-2 text-xs font-medium text-muted leading-snug">{kpi.label}</dt>
                  </motion.div>
                ))}
              </dl>
            </section>

            {/* ---- Footer note ---- */}
            <footer className="border-t border-line/10 p-6 text-center text-sm text-muted md:p-8">
              Want the full teardown — architecture diagrams, trade-offs, and the numbers I didn&apos;t
              hit? <a href={project.repo} target="_blank" rel="noreferrer" className="font-semibold text-accent underline underline-offset-4">Read the repo notes →</a>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}