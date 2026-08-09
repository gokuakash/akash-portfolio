"use client";

// ---------------------------------------------------------------------------
// Button — polymorphic, accessible, magnetic CTA.
// Variants: primary (vivid glow), outline, ghost. Renders as <a> or <button>.
// data-cursor="link" opts the custom cursor into its "morph" state.
// ---------------------------------------------------------------------------

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
}

type ButtonProps = BaseProps &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight " +
  "transition-[transform,box-shadow,background-color,color] duration-300 ease-out-expo " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  // Vivid Glow: accent fill with the dual-ring neon bloom.
  primary:
    "bg-accent text-bg shadow-glow hover:shadow-glow-sm hover:brightness-110 active:scale-[0.98]",
  outline:
    "border border-line/25 text-ink hover:border-accent hover:text-accent hover:shadow-glow-sm",
  ghost: "text-ink hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", size = "md", magnetic = true, className, children, ...rest }, ref) {
    const cls = cn(base, variants[variant], sizes[size], className);
    const inner =
      "href" in rest && rest.href ? (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          data-cursor="link"
          className={cls}
          whileTap={{ scale: 0.97 }}
          {...(rest as unknown as HTMLMotionProps<"a">)}
        >
          {children}
        </motion.a>
      ) : (
        <motion.button
          ref={ref as React.Ref<HTMLButtonElement>}
          data-cursor="link"
          className={cls}
          whileTap={{ scale: 0.97 }}
          {...(rest as unknown as HTMLMotionProps<"button">)}
        >
          {children}
        </motion.button>
      );

    return magnetic ? <Magnetic strength={14}>{inner}</Magnetic> : inner;
  },
);
