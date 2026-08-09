"use client";

// ---------------------------------------------------------------------------
// ProjectCard — modular grid tile with WebGL distortion hover.
// The thumbnail uses <ShaderImage> (desktop, fine pointers) or falls back to
// a static <img> (touch / reduced-motion). The whole card is one hotspot for
// the morphing cursor ("View" pill) and opens the Process Deep Dive.
// ---------------------------------------------------------------------------

import { motion } from "motion/react";
import { ShaderImage } from "@/components/three/ShaderImage";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <motion.article
      layout
      layoutId={`card-${project.id}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-line/10 bg-surface"
    >
      <button
        type="button"
        onClick={() => onOpen(project.id)}
        aria-haspopup="dialog"
        aria-label={`Open case study: ${project.title}`}
        data-cursor="view"
        className="block w-full cursor-pointer text-left"
      >
        {/* Thumbnail with WebGL distortion on hover */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <ShaderImage
            src={project.image}
            alt={`${project.title} — interface preview`}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" aria-hidden />
          {/* Hover overlay chip */}
          <span className="absolute right-4 top-4 rounded-full bg-bg/70 px-4 py-1.5 text-xs font-semibold text-ink opacity-0 backdrop-blur-sm transition-all duration-300 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100">
            Open case study ↗
          </span>
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 type-micro text-bg">
            {project.industry}
          </span>
        </div>

        {/* Meta */}
        <div className={cn("flex items-start justify-between gap-4 p-6")}>
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{project.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="type-micro text-muted">{project.year}</p>
            <p className="mt-1 text-xs font-medium text-accent">{project.role}</p>
          </div>
        </div>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-2 px-6 pb-6">
          {project.stack.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-full border border-line/15 px-3 py-1 text-[11px] text-muted">
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="rounded-full border border-line/15 px-3 py-1 text-[11px] text-muted">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </button>
    </motion.article>
  );
}