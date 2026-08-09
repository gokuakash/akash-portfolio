"use client";

// ---------------------------------------------------------------------------
// SectionHeading — kicker + kinetic masked title + optional serif italic.
// Each line of the title is wrapped in an overflow-hidden mask and slides
// up as it enters the viewport — the signature 2026 "text reveal" rhythm.
// ---------------------------------------------------------------------------

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  kicker: string;
  title: string;
  accent?: string; // italic serif accent word rendered inline
  className?: string;
}

function MaskedLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionHeading({ kicker, title, accent, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <Reveal y={14} delay={0.05}>
        <p className="type-micro mb-5 flex items-center gap-3 text-muted">
          <span className="inline-block h-px w-10 bg-accent" aria-hidden />
          {kicker}
        </p>
      </Reveal>
      <h2 className="type-mega font-display font-bold tracking-tight">
        {title.split("\n").map((line, i) => (
          <MaskedLine key={line}>{line}</MaskedLine>
        ))}
      </h2>
      {accent && (
        // Pull-quote echo: scaled to ~42% of the headline so it reads as a
        // deliberate secondary voice instead of an accidental third line.
        <p className="mt-4 font-serif text-[0.42em] italic leading-snug text-accent md:mt-6">
          {accent}
        </p>
      )}
    </div>
  );
}
