"use client";

// ---------------------------------------------------------------------------
// RadarChart — interactive D3.js radar for hybrid skills.
// Grid rings + polygon are generated with d3-scale / d3-shape; peers with
// Framer Motion for the entrance, and exposes hover highlighting as the
// "Zero UI" reveal for the skills matrix. Colors resolve from the live CSS
// theme so the chart adapts with the Light/Dark modes.
// ---------------------------------------------------------------------------

import { scaleLinear } from "d3-scale";
import { curveLinear, lineRadial } from "d3-shape";
import { motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { radarSkills } from "@/data/experience";

const SIZE = 460;
const R = 128;
const CX = SIZE / 2;
const CY = SIZE / 2;

export function RadarChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [progress, setProgress] = useState(0.35); // polygon draws outward
  const [hover, setHover] = useState<number | null>(null);
  const [accent, setAccent] = useState("#c8ff3d");
  const [text, setText] = useState("#9aa1ac");
  const [grid, setGrid] = useState("#e8e8e9");

  const skills = useMemo(() => [...radarSkills] as Array<{ label: string; value: number }>, []);

  // Resolve theme colors from CSS variables so the chart flips with mode.
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const get = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() ? `rgb(${css.getPropertyValue(name).trim()})` : fallback;
    setAccent(get("--accent", "#c8ff3d"));
    setText(get("--muted", "#a1a1a6"));
    setGrid(get("--line", "#e8e8e9"));
  }, []);

  // Ease the polygon from the center outward once scrolled into view.
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1100;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setProgress(0.35 + ease(t) * 0.65);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  // d3: radial angle per skill + linear radius scale.
  const angle = (i: number) => (i * 2 * Math.PI) / skills.length - Math.PI / 2;
  const scale = scaleLinear().domain([0, 100]).range([0, R]);

  // d3 radial line generator (curveLinear → crisp polygon edges).
  const radial = lineRadial<number>()
    .radius((d) => scale(d))
    .angle((_, i) => angle(i))
    .curve(curveLinear);

  // Grid rings at 25/50/75/100.
  const rings = [25, 50, 75, 100].map((level) => radial(skills.map(() => level)) ?? "");
  // The animated skill polygon (progress scales every vertex from center).
  const polygon = radial(skills.map((s) => s.value * progress)) ?? "";

  const dir = (i: number) => Math.cos(angle(i));

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Skill radar: ${skills.map((s) => `${s.label}, ${s.value} out of 100`).join("; ")}`}
      className="w-full max-w-[520px]"
    >
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Grid rings (d3-generated circles) */}
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={grid} strokeOpacity="0.16" strokeWidth="1" />
      ))}

      {/* Spokes */}
      {skills.map((_, i) => (
        <line
          key={i}
          x1={CX}
          y1={CY}
          x2={CX + R * Math.cos(angle(i))}
          y2={CY + R * Math.sin(angle(i))}
          stroke={grid}
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      ))}

      {/* Skill polygon — the animated hero of the chart */}
      <motion.path
        d={polygon}
        fill="url(#radarFill)"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />

      {/* Vertices — hover for the value readout */}
      {skills.map((s, i) => {
        const x = CX + scale(s.value * progress) * Math.cos(angle(i));
        const y = CY + scale(s.value * progress) * Math.sin(angle(i));
        const active = hover === i;
        return (
          <g key={s.label}>
            <circle cx={x} cy={y} r={active ? 9 : 4.5} fill={active ? accent : "rgb(var(--bg))"} stroke={accent} strokeWidth="2" />
            <circle
              cx={x}
              cy={y}
              r={30}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
            {active && (
              <text x={x} y={y - 18} textAnchor="middle" fontSize="17" fontWeight="800" fill={accent} className="pointer-events-none">
                {s.value}
              </text>
            )}
          </g>
        );
      })}

      {/* Labels */}
      {skills.map((s, i) => {
        const r = R + 30;
        const x = CX + r * Math.cos(angle(i));
        const y = CY + r * Math.sin(angle(i));
        const a = dir(i);
        const anchor = a > 0.3 ? "start" : a < -0.3 ? "end" : "middle";
        const active = hover === i;
        return (
          <text
            key={s.label}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="13"
            fontWeight={active ? 800 : 500}
            fill={active ? accent : text}
            style={{ letterSpacing: "0.06em", textTransform: "uppercase", transition: "fill 0.2s" }}
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}