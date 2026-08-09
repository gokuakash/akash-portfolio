"use client";

// ---------------------------------------------------------------------------
// ShaderImage — WebGL distortion hover for project thumbnails.
// A procedural fragment shader displaces the UVs with layered hash noise
// ("lens ripple") driven by a damped hover uniform. Features:
//  - Pauses rendering off-screen (IntersectionObserver) → zero idle GPU cost.
//  - Touch / reduced-motion / low-power devices fall back to a plain <img>.
//  - Pointer leave eases the distortion back to zero (functional motion).
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { canRunWebGL } from "@/lib/utils";
import { useHydratedEnv } from "@/lib/hooks";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uHover;   // 0 → 1 (damped by JS)
  uniform vec2 uMouse;    // cursor position relative to the card
  uniform vec2 uRes;      // resolution
  varying vec2 vUv;

  // Cheap layered hash noise — no texture needed.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;
    float dist = length(centered);

    // Radial displacement wave, strongest near the cursor.
    float cursorDist = length((uMouse - uv) * uRes / min(uRes.x, uRes.y));
    float ripple = smoothstep(0.35, 0.0, cursorDist);

    // Layered turbulence.
    vec2 warp = vec2(noise(uv * 14.0 + 3.0), noise(uv * 14.0 + 7.0)) * 0.08;
    warp += vec2(noise(uv * 34.0), noise(uv * 34.0 + 4.0)) * 0.03;

    uv += (warp * ripple + warp * 0.35 * dist * 3.0) * uHover;

    vec4 tex = texture2D(uTex, uv);
    gl_FragColor = tex;
  }
`;

interface ShaderImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ShaderImage({ src, alt, className }: ShaderImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Hydration-safe gate: both server and first client render output the
  // plain <img>; the WebGL distortion only mounts after hydration.
  const hydrated = useHydratedEnv();
  const supported = hydrated && canRunWebGL();

  useEffect(() => {
    if (!supported || !wrapRef.current) return;
    const wrap = wrapRef.current;

    // --- Booting the tiny renderer for this one image ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const texture = new THREE.TextureLoader().load(src, () => {
      texture.needsUpdate = true;
      renderer.render(scene, camera);
    });

    const uniforms = {
      uTex: { value: texture },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let hoverTarget = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      uniforms.uRes.value.set(rect.width, rect.height);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      uniforms.uMouse.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      hoverTarget = 1;
    };
    const onPointerLeave = () => {
      hoverTarget = 0;
    };

    const loop = () => {
      // Damped hover — the "easing back to calm" microinteraction.
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.08;
      if (visible) renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      renderer.domElement.style.opacity = entry.isIntersecting ? "1" : "0";
    });

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    io.observe(wrap);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      texture.dispose();
      material.dispose();
      renderer.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, [supported]);

  if (!supported) {
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
  }

  return (
    <div ref={wrapRef} className={className} role="img" aria-label={alt}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" aria-hidden />
    </div>
  );
}