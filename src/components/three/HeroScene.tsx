"use client";

// ---------------------------------------------------------------------------
// HeroScene — the abstract interactive 3D background (R3F + three).
//  - A 2,000-particle "starfield dust" shader that waves with time, reacts
//    to the mouse, and drifts subtly as the user scrolls (scrollytelling).
//  - A matte, distorted glass orb as the physical anchor with neon rim light.
//  - Performance guards: capped DPR, antialiasing off, and the parent only
//    mounts this whole component when `canRunWebGL()` is true (touch /
//    reduced-motion / weak devices get the CSS `.hero-aura` fallback).
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

/** Vertex shader — particles bob with layered sine waves + scroll drift. */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  attribute float aScale;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Layered wave motion — cheap curl-like displacement.
    pos.x += sin(uTime * 0.35 + pos.y * 1.4) * 0.12;
    pos.y += cos(uTime * 0.30 + pos.x * 1.2) * 0.12;
    pos.z += sin(uTime * 0.25 + position.z * 1.6) * 0.08;

    // Scroll parallax: everything drifts toward camera slightly.
    pos.z += uScroll * 1.4;

    // Mouse influence pushes near particles sideways (feels magnetic).
    pos.x += uMouse.x * 0.35;
    pos.y += uMouse.y * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Size in screen space with perspective attenuation.
    float dist = -mv.z;
    gl_PointSize = aScale * (140.0 / dist);

    // Fade near the camera's edge for a softer "dust" falloff.
    vAlpha = smoothstep(0.0, 2.5, dist) * 0.85;
    vColor = mix(vec3(0.42, 0.39, 1.0), vec3(0.94, 1.0, 0.55), pos.y * 0.5 + 0.5);
  }
`;

/** Fragment shader — soft round points, additive glow. */
const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float disc = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vColor, disc * vAlpha);
  }
`;

function ParticleField() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();

  const { positions, scales } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute within an oblate sphere shell (denser core).
      const r = 1.6 + Math.pow(Math.random(), 0.55) * 3.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.7;
      scales[i] = 0.6 + Math.random() * 1.6;
    }
    return { positions, scales };
  }, []);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    // Smooth pointer follows the mouse inside the canvas coordinates.
    mat.uniforms.uMouse.value.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.05);
    // Scroll drift driven by native scroll (Lenis uses native scrollTop).
    mat.uniforms.uScroll.value = Math.min(1, window.scrollY / (window.innerHeight * 2.4));
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return g;
  }, [positions, scales]);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          vColor: { value: new THREE.Color(0.4, 0.35, 1.0) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** The distorted matte orb — the minimal-brutalist centerpiece. */
function Orb() {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial
          color="#101018"
          roughness={0.15}
          metalness={0.9}
          distort={0.32}
          speed={1.6}
          envMapIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <>
      {/* Neon rim lights (volt + violet) against the matte orb */}
      <ambientLight intensity={0.25} />
      <pointLight position={[-5, 3, 4]} intensity={14} color="#c8ff3d" />
      <pointLight position={[5, -3, -4]} intensity={10} color="#67e8f9" />
      <pointLight position={[2, 4, -3]} intensity={8} color="#8b5cf6" />
      <ParticleField />
      <Orb />
    </>
  );
}