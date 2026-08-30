"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/**
 * The ore body.
 *
 * A point cloud shaped by fractional Brownian motion into an irregular stone —
 * the thing the whole platform is about, rendered as the mass it actually is
 * rather than as an abstract sphere. Pointing at it warms the points under the
 * cursor to Reef Gold, which is the only place on the page gold appears
 * without naming an action.
 *
 * Ported from the reference sketch with four changes for production:
 *   · `three` is bundled, not pulled from a CDN — no third-party origin at
 *     runtime, and it survives a strict CSP.
 *   · Everything is disposed on unmount; the sketch leaked a renderer, a
 *     geometry, a material and three listeners per mount, which in a
 *     hot-reloading dev server means a new WebGL context every save until the
 *     browser starts evicting them.
 *   · Reduced motion renders one static frame instead of running the loop.
 *   · The canvas tracks its container rather than a fixed 800px, and the
 *     stone sits centred because here it is a background, not a figure.
 */

const COUNT = 24000;

/* ------------------------------------------------------------------ */
/* Value noise + fBm — the sketch's, kept verbatim in behaviour        */
/* ------------------------------------------------------------------ */

function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;

  const h = (i: number, j: number, k: number) => {
    const s = Math.sin(i * 15.73 + j * 112.91 + k * 271.17) * 43758.5453;
    return s - Math.floor(s);
  };
  const L = (a: number, b: number, t: number) => a + (b - a) * t;

  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);

  return L(
    L(
      L(h(xi, yi, zi), h(xi + 1, yi, zi), u),
      L(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u),
      v,
    ),
    L(
      L(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u),
      L(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u),
      v,
    ),
    w,
  );
}

function fbm(x: number, y: number, z: number) {
  let a = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < 4; i++) {
    a += amp * vnoise(x * f + 7.3, y * f + 3.1, z * f + 11.7);
    amp *= 0.5;
    f *= 2;
  }
  return a;
}

/* ------------------------------------------------------------------ */

const VERT = /* glsl */ `
attribute vec3 aNorm;
attribute float aTone;
attribute float aSize;
attribute float aSeed;
uniform float uTime;
uniform float uScale;
uniform float uHover;
uniform vec3 uRayO;
uniform vec3 uRayD;
varying float vShade;
varying float vAlpha;
varying float vGold;

void main() {
  vec3 p = position + aNorm * sin(uTime * 0.9 + aSeed * 6.2831) * 0.02;
  vec3 n = normalize(mat3(modelMatrix) * aNorm);
  float d = max(dot(n, normalize(vec3(-0.7, 0.75, 0.2))), 0.0);
  float f = max(dot(n, normalize(vec3(0.6, -0.25, -0.5))), 0.0);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  float distR = length(cross(wp.xyz - uRayO, uRayD));
  vGold = uHover * (1.0 - smoothstep(0.22, 0.6, distR));
  vec4 mv = viewMatrix * wp;
  gl_PointSize = aSize * uScale / -mv.z * (1.0 + 0.5 * vGold);
  float s = clamp((0.2 + 0.85 * pow(d, 1.4) + 0.22 * f) * aTone, 0.0, 1.0);
  vShade = mix(0.14, 0.74, s);
  vAlpha = clamp((mv.z + 10.5) / 4.5, 0.5, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
varying float vShade;
varying float vAlpha;
varying float vGold;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.32, d);
  // Reef Gold, #D9B24C, in linear-ish 0–1 terms.
  vec3 col = mix(vec3(vShade), vec3(0.851, 0.698, 0.298), vGold);
  gl_FragColor = vec4(col, a * mix(0.95 * vAlpha, 1.0, vGold));
}
`;

export function ParticleStone({ className }: { className?: string }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL — the hero is still perfectly readable without the stone.
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    renderer.domElement.style.cssText =
      "position:absolute;left:0;top:0;display:block;";
    holder.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      holder.clientWidth / Math.max(holder.clientHeight, 1),
      0.1,
      100,
    );
    camera.position.set(0, 0, 6.5);

    /* ---- Build the body ---- */
    const pos = new Float32Array(COUNT * 3);
    const nrm = new Float32Array(COUNT * 3);
    const tone = new Float32Array(COUNT);
    const size = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const dx = s * Math.cos(th);
      const dy = u;
      const dz = s * Math.sin(th);

      const n = fbm(dx * 1.6, dy * 1.6, dz * 1.6);
      const r = 1.55 * (0.72 + 0.55 * n) * (0.985 + Math.random() * 0.035);

      pos[i * 3] = dx * r * 1.22;
      pos[i * 3 + 1] = dy * r * 0.92;
      pos[i * 3 + 2] = dz * r * 1.06;

      nrm[i * 3] = dx;
      nrm[i * 3 + 1] = dy;
      nrm[i * 3 + 2] = dz;

      let t = 0.7 + 0.55 * fbm(dx * 4.2, dy * 4.2, dz * 4.2);
      if (Math.random() < 0.05) t *= 1.7; // Flecks — the visible mineral.
      tone[i] = t;
      size[i] = 0.016 + Math.random() * 0.022;
      seed[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aNorm", new THREE.BufferAttribute(nrm, 3));
    geo.setAttribute("aTone", new THREE.BufferAttribute(tone, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: renderer.domElement.height * 0.5 },
        uHover: { value: 0 },
        uRayO: { value: new THREE.Vector3() },
        uRayD: { value: new THREE.Vector3(0, 0, -1) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
    });

    const stone = new THREE.Points(geo, mat);
    scene.add(stone);

    /* ---- Fit ---- */
    const fit = () => {
      const w = holder.clientWidth;
      const h = Math.max(holder.clientHeight, 1);
      camera.aspect = w / h;
      // Hold the stone's on-screen size as the container changes shape, so a
      // wide desktop and a tall phone both frame it sensibly.
      const halfH = 2.6924 * (h / w);
      camera.fov = (Math.atan2(halfH, 6.5) * 360) / Math.PI;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      mat.uniforms.uScale.value = renderer.domElement.height * 0.5;
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(holder);

    /* ---- Pointer ---- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(0, 0);
    let hovering = false;
    let hoverT = 0;
    let mx = 0;
    let my = 0;

    const onMove = (e: PointerEvent) => {
      const rect = holder.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      hovering = e.pointerType === "mouse";
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onLeave = () => {
      hovering = false;
    };

    // Listening on window keeps the gold responding while the cursor crosses
    // the copy sitting on top of the canvas.
    window.addEventListener("pointermove", onMove, { passive: true });
    holder.addEventListener("pointerleave", onLeave);

    /* ---- Render ----
       Elapsed time comes from the rAF timestamp rather than THREE.Clock,
       which is deprecated in this version, and it means the animation clock
       is the same clock the frames are scheduled on. */
    let startedAt: number | null = null;
    let raf = 0;

    const draw = (t: number) => {
      mat.uniforms.uTime.value = t;
      hoverT += ((hovering ? 1 : 0) - hoverT) * 0.08;
      mat.uniforms.uHover.value = hoverT;
      raycaster.setFromCamera(ndc, camera);
      mat.uniforms.uRayO.value.copy(raycaster.ray.origin);
      mat.uniforms.uRayD.value.copy(raycaster.ray.direction);
      stone.rotation.y = t * 0.18 + mx * 0.001;
      stone.rotation.x = Math.sin(t * 0.12) * 0.12 + my * 0.15;
      stone.rotation.z = Math.sin(t * 0.07) * 0.05;
      renderer.render(scene, camera);
    };

    if (reduce) {
      // One frame at a flattering angle — the mass still reads, nothing turns.
      stone.rotation.y = 0.6;
      stone.rotation.x = 0.1;
      renderer.render(scene, camera);
    } else {
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (startedAt === null) startedAt = now;
        draw((now - startedAt) / 1000);
      };
      raf = requestAnimationFrame(tick);
    }

    /* ---- Teardown ---- */
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      holder.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduce]);

  return <div ref={holderRef} aria-hidden="true" className={className} />;
}
