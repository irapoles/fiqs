"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/**
 * The mark, as a point cloud.
 *
 * Same motion and material as the hero stone — slow rotation, pointer tilt,
 * gold warming under the cursor — but the points are sampled from the FIQS
 * symbol rather than from a noise-shaped sphere, so the thing turning in space
 * is the mark itself.
 *
 * Points are found by rasterising the symbol's own paths to an offscreen
 * canvas and keeping the covered pixels. That means the geometry can never
 * drift from the logo: change the paths in `logo.tsx` and the cloud follows.
 *
 * The cloud is monochrome — the mark's own gold and sand are dropped, because
 * gold here is reserved for the hover, exactly as on the stone. Shading,
 * point-size spread, the 5% brighter flecks, the depth falloff and the round
 * sprite are all lifted from the stone so the two read as one material.
 *
 * A flat plane has no normals to light, so each point takes a shallow dome
 * normal derived from its position. That gives the same travelling highlight
 * the stone has as it turns, rather than a uniformly lit sticker.
 *
 * All three shapes share one depth. Giving the fold its own z looked right
 * standing still, but perspective then slid the planes against each other as
 * the cloud turned — the gaps between them opened and closed and the mark
 * stopped reading as the mark. The cloud is a single rigid slab, so the
 * silhouette is the logo's at every angle.
 */

const VIEW_W = 1180;
const VIEW_H = 1418;

/* Geometry straight from `logo.tsx` — shapes only. The mark's own fills are
   deliberately not carried over: the cloud is monochrome and gold belongs to
   the hover. No per-shape depth: they move as one body. */
const PATHS = [
  {
    d: "M939.566 120.074C945.001 120.455 944.345 120.728 949.606 122.6C952.647 136.871 941.194 297.522 939.75 321.146L906.586 851.954C863.423 906.836 807.016 970.377 761.171 1024.75L476.613 1362.13C396.821 1313.15 304.347 1249.1 225.143 1196.92L34.8525 1071.9L590.585 94.3572C695.547 106.508 831.746 112.212 939.566 120.074Z",
  },
  {
    d: "M979.896 144.216C1025.68 198.929 1087.9 267.797 1129.23 322.304L1133.84 830.291C1134.64 914.327 1133.41 1010.4 1136.82 1093.44C1070.72 1014.1 1000.07 931.654 935.947 851.267L942.408 750.65L942.177 741.793C949.126 676.636 951.959 599.371 956.032 533.353L979.896 144.216Z",
  },
  {
    d: "M528.999 1351.25L1109.75 1109.75L919.999 885.5L528.999 1351.25Z",
  },
] as const;

/** Rasterise the paths and keep the covered pixels as points. */
function sampleMark(step: number) {
  const scale = 0.42; // Raster resolution — enough detail, cheap to scan.
  const w = Math.round(VIEW_W * scale);
  const h = Math.round(VIEW_H * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const points: { x: number; y: number; z: number }[] = [];
  const aspect = VIEW_W / VIEW_H;

  for (const layer of PATHS) {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.fillStyle = "#fff";
    ctx.fill(new Path2D(layer.d));
    ctx.restore();

    const { data } = ctx.getImageData(0, 0, w, h);

    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        if (data[(py * w + px) * 4 + 3] < 128) continue;
        // Jitter inside the cell so the grid never shows as rows.
        const jx = px + (Math.random() - 0.5) * step;
        const jy = py + (Math.random() - 0.5) * step;
        points.push({
          x: (jx / w - 0.5) * 2 * aspect,
          y: -(jy / h - 0.5) * 2,
          // One shallow thickness for the whole slab, so no shape drifts
          // relative to another as it turns.
          z: (Math.random() - 0.5) * 0.05,
        });
      }
    }
  }
  return points;
}

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
  // Brighter band than the stone: the mark reads as white, not as rock.
  vShade = mix(0.42, 1.0, s);
  vAlpha = clamp((mv.z + 10.5) / 4.5, 0.5, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
varying float vShade;
varying float vAlpha;
varying float vGold;

void main() {
  // Round sprite: radial distance from the point centre, softened at the rim.
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.32, d);
  vec3 col = mix(vec3(vShade), vec3(0.851, 0.698, 0.298), vGold);
  gl_FragColor = vec4(col, a * mix(0.95 * vAlpha, 1.0, vGold));
}
`;

export function ParticleMark({ className }: { className?: string }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // No WebGL — the page reads fine without it.
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
    camera.position.set(0, 0, 5.4);

    /* Step 4 rather than 2: four times fewer points, so the cloud breathes
       instead of reading as a solid fill. */
    const sampled = sampleMark(4);
    const count = sampled.length;

    const pos = new Float32Array(count * 3);
    const nrm = new Float32Array(count * 3);
    const tone = new Float32Array(count);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);

    sampled.forEach((p, i) => {
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;

      // Shallow dome, so the light sweeps across the face as the mark turns.
      const n = new THREE.Vector3(p.x * 0.45, p.y * 0.45, 1).normalize();
      nrm[i * 3] = n.x;
      nrm[i * 3 + 1] = n.y;
      nrm[i * 3 + 2] = n.z;

      // Same distribution as the stone, flecks included.
      let t = 0.7 + 0.55 * Math.random();
      if (Math.random() < 0.05) t *= 1.7;
      tone[i] = t;
      size[i] = 0.016 + Math.random() * 0.022;
      seed[i] = Math.random();
    });

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

    const mark = new THREE.Points(geo, mat);
    scene.add(mark);

    const fit = () => {
      const w = holder.clientWidth;
      const h = Math.max(holder.clientHeight, 1);
      camera.aspect = w / h;
      /* The mark spans two world units tall, so a half-height a little over
         one fills the frame without clipping when it rocks. */
      const halfH = 1.18 * (h / w);
      camera.fov = (Math.atan2(Math.max(halfH, 1.18), 5.4) * 360) / Math.PI;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      mat.uniforms.uScale.value = renderer.domElement.height * 0.5;
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(holder);

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

    window.addEventListener("pointermove", onMove, { passive: true });
    holder.addEventListener("pointerleave", onLeave);

    let startedAt: number | null = null;
    let raf = 0;

    const draw = (t: number) => {
      mat.uniforms.uTime.value = t;
      hoverT += ((hovering ? 1 : 0) - hoverT) * 0.08;
      mat.uniforms.uHover.value = hoverT;
      raycaster.setFromCamera(ndc, camera);
      mat.uniforms.uRayO.value.copy(raycaster.ray.origin);
      mat.uniforms.uRayD.value.copy(raycaster.ray.direction);
      /* Rocks back and forth rather than spinning: the mark has a front, and
         a full rotation would read it back to front half the time. */
      mark.rotation.y = Math.sin(t * 0.24) * 0.42 + mx * 0.1;
      mark.rotation.x = Math.sin(t * 0.17) * 0.07 + my * 0.06;
      renderer.render(scene, camera);
    };

    if (reduce) {
      mark.rotation.y = 0.22;
      renderer.render(scene, camera);
    } else {
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (startedAt === null) startedAt = now;
        draw((now - startedAt) / 1000);
      };
      raf = requestAnimationFrame(tick);
    }

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
