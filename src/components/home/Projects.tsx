"use client";

// ---------------------------------------------------------------------------
// Projects — the core showcase.
//  - Modular grid (CSS Grid) with advanced filtering. Filters use a shared
//    `layoutId` pill indicator and the grid re-animates via motion `layout`.
//  - Clicking a card opens the full-screen Process Deep Dive.
//  - "Quality over quantity": four deep, real case studies.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectDeepDive } from "./ProjectDeepDive";
import { categories, projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type CategoryId = (typeof categories)[number]["id"];

export function Projects() {
  const [active, setActive] = useState<CategoryId>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="work" aria-labelledby="work-heading" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          kicker="02 · Selected Work"
          title={"Four problems.\nZero filler."}
          accent="every one shipped."
        />

        {/* ---- Filter bar with shared-layout active pill ---- */}
        <div role="tablist" aria-label="Filter projects by category" className="mb-12 flex flex-wrap gap-2">
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(c.id)}
                className={cn(
                  "relative touch-target rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
                  isActive ? "text-bg" : "text-muted hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent shadow-glow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* ---- Modular grid (CSS Grid; nested rows use grid-template-rows: auto).
               Culture note: cards are equal-height containers, so subgrid helps
               keep meta rows aligned across columns — see the li > grid usage. ---- */}
        <motion.ul layout className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <li key={project.id}>
                <ProjectCard
                  project={project}
                  onOpen={(id) => {
                    const project = projects.find((p) => p.id === id) ?? null;
                    setSelected(project);
                  }}
                />
              </li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <p className="mt-10 text-center text-sm text-muted">
          More experiments live on{" "}
          <a href="https://github.com/akashverma" target="_blank" rel="noreferrer" className="font-semibold text-accent underline underline-offset-4">
            GitHub
          </a>
          .
        </p>
      </div>

      {/* ---- Process Deep Dive overlay ---- */}
      <ProjectDeepDive project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}