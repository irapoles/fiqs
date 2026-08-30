"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The sourcing orb.
 *
 * A rotating point cloud on a sphere — the visual anchor of the brand. It is
 * 3D because the subject is: gold leaves a great many origins and converges on
 * a small number of refiners, and the orb shows that convergence as geometry
 * rather than decoration.
 *
 * Points are distributed by the Fibonacci lattice, which gives near-uniform
 * spacing without the pole-clustering a naive lat/long grid produces. A subset
 * sit on "seams" — denser arcs standing in for corridors — and those carry the
 * gold. Everything else is graphite-neutral and recedes.
 *
 * Drawn on a 2D canvas rather than WebGL: no library, ~40KB less shipped, and
 * it degrades to a single static frame under reduced motion.
 */

const COUNT = 1700;
const SEAM_SHARE = 0.15; // Fraction carrying gold — the 8% rule, near enough.

type Point = { x: number; y: number; z: number; seam: boolean; r: number };

function buildSphere(count: number): Point[] {
  const points: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad

  for (let i = 0; i < count; i++) {
    // y from 1 to -1, uniform in height → uniform on the sphere.
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    // Seam membership: a band of longitudes, so the gold reads as arcs
    // running pole to pole rather than as scattered noise.
    const seam = Math.abs(Math.sin(theta * 1.5)) > 1 - SEAM_SHARE;

    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      seam,
      r: seam ? 2.1 : 1.35,
    });
  }
  return points;
}

export function ParticleSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = buildSphere(COUNT);
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const render = (rotation: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;

      // Fixed tilt so the axis reads as an axis, not a spin on the screen plane.
      const tilt = -0.42;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      for (const p of points) {
        // Rotate about Y, then tilt about X.
        const x1 = p.x * cosR - p.z * sinR;
        const z1 = p.x * sinR + p.z * cosR;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;

        // Weak perspective — enough to separate front from back.
        const scale = 1 / (2.6 - z2);
        const sx = cx + x1 * radius * scale * 2.6;
        const sy = cy + y2 * radius * scale * 2.6;

        // Depth cue. Back-facing points stay visible but sink toward the canvas.
        const depth = (z2 + 1) / 2; // 0 (far) → 1 (near)
        const alpha = 0.10 + depth * depth * 0.90;

        ctx.beginPath();
        ctx.arc(sx, sy, p.r * scale * 2.6, 0, Math.PI * 2);

        if (p.seam) {
          // Gold on the near face, warming to sand as it comes over the top.
          ctx.fillStyle = `rgba(${217 + depth * 38}, ${178 + depth * 50}, ${76 + depth * 82}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(168, 174, 184, ${alpha * 0.42})`;
        }
        ctx.fill();
      }
    };

    if (reduce) {
      // One static frame — the geometry still reads, nothing moves.
      render(0.6);
      return () => observer.disconnect();
    }

    let last = performance.now();
    let rotation = 0;

    const loop = (now: number) => {
      const dt = Math.min(now - last, 48); // Clamp after a tab-switch stall.
      last = now;
      rotation += dt * 0.00016; // ~11s per revolution.
      render(rotation);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
