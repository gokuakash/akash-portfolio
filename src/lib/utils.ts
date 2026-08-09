// ---------------------------------------------------------------------------
// Shared utilities & environment probes.
// ---------------------------------------------------------------------------

/** Join class names, filtering falsy values (tiny clsx substitute). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Respect the OS-level reduced-motion preference. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Precise pointer (mouse/trackpad) — gates cursor & WebGL heavy features. */
export function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

/** Cheap heuristic: low-core devices get the lightweight experience. */
export function isLowPowerDevice() {
  if (typeof window === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  return cores <= 4;
}

/**
 * Should heavy WebGL run? No on touch, reduced-motion, or weak hardware.
 * This is the single guard every 3D component consults — the "drop the
 * WebGL if it threatens 60fps" strategy from the brief.
 */
export function canRunWebGL() {
  return hasFinePointer() && !prefersReducedMotion() && !isLowPowerDevice();
}

/** Safe clamped lerp helper. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Format a metric for the animated counters. */
export function formatMetric(value: number, decimals = 0, suffix = "") {
  return `${value.toFixed(decimals)}${suffix}`;
}
