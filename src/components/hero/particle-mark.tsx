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
 * gold here is reserved for the hover, exactly as on the stone.
 *
 * ---------------------------------------------------------------------------
 * Volume
 * ---------------------------------------------------------------------------
 * The mark is extruded rather than flat: points sit on a front face, a back
 * face, and a rim walked around the silhouette. That is what makes it read as
 * an object instead of a sticker — the rim catches the light as the body
 * turns, the two faces shade against each other, and the far side fades back.
 *
 * Every shape shares one extrusion, one depth range. Giving each its own z
 * looked right standing still, but perspective then slid the planes against
 * each other as the cloud turned — the gaps opened and closed and the mark
 * stopped reading as the mark. One slab, so the silhouette is the logo's at
 * every angle.
 *
 * ---------------------------------------------------------------------------
 * Hover
 * ---------------------------------------------------------------------------
 * Under the cursor the points bloom apart along their own normals plus a fixed
 * random direction, and take on a small continuous jitter. The displacement is
 * driven by distance from the pointer ray measured on the *resting* position,
 * never the displaced one — otherwise points would push themselves out of
 * their own influence radius and chatter at the edge of it.
 */

const VIEW_W = 1180;
const VIEW_H = 1418;

/* Geometry straight from `logo.tsx` — shapes only. The mark's own fills are
   deliberately not carried over: the cloud is monochrome and gold belongs to
   the hover. All three share one extrusion, so they move as one body. */
const PATHS = [
  "M939.566 120.074C945.001 120.455 944.345 120.728 949.606 122.6C952.647 136.871 941.194 297.522 939.75 321.146L906.586 851.954C863.423 906.836 807.016 970.377 761.171 1024.75L476.613 1362.13C396.821 1313.15 304.347 1249.1 225.143 1196.92L34.8525 1071.9L590.585 94.3572C695.547 106.508 831.746 112.212 939.566 120.074Z",
  "M979.896 144.216C1025.68 198.929 1087.9 267.797 1129.23 322.304L1133.84 830.291C1134.64 914.327 1133.41 1010.4 1136.82 1093.44C1070.72 1014.1 1000.07 931.654 935.947 851.267L942.408 750.65L942.177 741.793C949.126 676.636 951.959 599.371 956.032 533.353L979.896 144.216Z",
  "M528.999 1351.25L1109.75 1109.75L919.999 885.5L528.999 1351.25Z",
] as const;

/** Half the slab's thickness, in world units. The mark is 2 units tall. */
const HALF_D = 0.17;

type Pt = { x: number; y: number; z: number; nx: number; ny: number; nz: number };

/**
 * Rasterise the paths into one coverage mask, then sample it as a solid:
 * interior pixels land on one of the two faces, boundary pixels on the rim.
 */
function sampleMark(step: number, rimStep: number) {
  const scale = 0.42; // Raster resolution — enough detail, cheap to scan.
  const w = Math.round(VIEW_W * scale);
  const h = Math.round(VIEW_H * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  /* One mask for all three shapes. Drawing them together is what lets the rim
     be found correctly: the gaps between shapes stay uncovered, so they read
     as real edges rather than as interior. */
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff";
  for (const d of PATHS) ctx.fill(new Path2D(d));
  ctx.restore();

  const { data } = ctx.getImageData(0, 0, w, h);
  const solid = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = data[i * 4 + 3] > 127 ? 1 : 0;

  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= w || y >= h ? 0 : solid[y * w + x];

  const points: Pt[] = [];
  const aspect = VIEW_W / VIEW_H;
  const toWorld = (px: number, py: number) => ({
    x: (px / w - 0.5) * 2 * aspect,
    y: -(py / h - 0.5) * 2,
  });

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      if (!at(px, py)) continue;

      const edge =
        !at(px - 1, py) || !at(px + 1, py) || !at(px, py - 1) || !at(px, py + 1);

      if (edge) {
        // The rim is walked finer than the faces: it is the silhouette, and a
        // sparse edge would let the shape fray.
        if ((px + py) % rimStep !== 0) continue;
        const { x, y } = toWorld(
          px + (Math.random() - 0.5),
          py + (Math.random() - 0.5),
        );
        /* Outward direction, from the covered pixels around it. Summing the
           offsets to *uncovered* neighbours points away from the body, which
           is what the rim's normal has to be for the light to graze it. */
        let gx = 0;
        let gy = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (at(px + dx, py + dy)) continue;
            const len = Math.hypot(dx, dy) || 1;
            gx += dx / len;
            gy += dy / len;
          }
        }
        const g = Math.hypot(gx, gy) || 1;
        points.push({
          x,
          y,
          // Spread through the full thickness, so the rim is a wall.
          z: (Math.random() - 0.5) * 2 * HALF_D,
          nx: gx / g,
          ny: -gy / g, // Canvas y runs down, world y runs up.
          nz: 0.22, // A touch of face, so the rim never goes fully black.
        });
        continue;
      }

      if (px % step !== 0 || py % step !== 0) continue;

      // Jitter inside the cell so the grid never shows as rows.
      const { x, y } = toWorld(
        px + (Math.random() - 0.5) * step,
        py + (Math.random() - 0.5) * step,
      );
      /* One face per pixel, chosen at random, rather than both: two full
         sheets would double the density and close up the air. Weighted to the
         front, which is the face actually being read. */
      const front = Math.random() < 0.62 ? 1 : -1;
      const n = new THREE.Vector3(x * 0.3, y * 0.3, front).normalize();
      points.push({
        x,
        y,
        z: front * HALF_D * (0.82 + Math.random() * 0.18),
        nx: n.x,
        ny: n.y,
        nz: n.z,
      });
    }
  }
  return points;
}

const VERT = /* glsl */ `
attribute vec3 aNorm;
attribute vec3 aScatter;
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
  // Proximity is measured on the resting position. Measuring it on the pushed
  // position would let a point displace itself out of its own influence.
  vec4 rest = modelMatrix * vec4(position, 1.0);
  float distR = length(cross(rest.xyz - uRayO, uRayD));
  float prox = 1.0 - smoothstep(0.16, 0.62, distR);
  vGold = uHover * prox;

  vec3 p = position
    + aNorm * sin(uTime * 0.9 + aSeed * 6.2831) * 0.02
    // Bloom: out along the surface normal, plus a fixed random direction so
    // the cloud opens rather than merely inflating.
    + (aNorm * 0.6 + aScatter) * vGold * 0.30
    // And a small live drift, so what the cursor uncovers keeps moving.
    + aScatter * sin(uTime * 2.6 + aSeed * 6.2831) * vGold * 0.06;

  vec3 n = normalize(mat3(modelMatrix) * aNorm);
  vec3 key = normalize(vec3(-0.7, 0.75, 0.2));
  float d = max(dot(n, key), 0.0);
  // Two-sided. The back face has to be dimmer than the front, not unlit:
  // a solid third of the cloud faces away at any moment, and leaving it at
  // ambient turned the body into a dark mass with a bright outline.
  float back = max(dot(-n, key), 0.0) * 0.45;
  float f = max(dot(n, normalize(vec3(0.6, -0.25, -0.5))), 0.0);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec4 mv = viewMatrix * wp;
  gl_PointSize = aSize * uScale / -mv.z * (1.0 + 0.5 * vGold);
  float s = clamp((0.2 + 0.85 * pow(d, 1.4) + back + 0.22 * f) * aTone, 0.0, 1.0);
  // Brighter band than the stone: the mark reads as white, not as rock.
  vShade = mix(0.42, 1.0, s);
  // Front-to-back fade across the slab — the far face has to recede for the
  // body to have thickness rather than just an outline. Floored well above
  // zero: this is depth, not a vignette.
  vAlpha = clamp((mv.z + 6.15) / 0.95, 0.55, 1.0);
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

    /* Faces at step 4 so the cloud breathes instead of reading as a fill;
       the rim finer, because it carries the silhouette. */
    const sampled = sampleMark(4, 3);
    const count = sampled.length;

    const pos = new Float32Array(count * 3);
    const nrm = new Float32Array(count * 3);
    const scat = new Float32Array(count * 3);
    const tone = new Float32Array(count);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);

    const dir = new THREE.Vector3();
    sampled.forEach((p, i) => {
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;

      nrm[i * 3] = p.nx;
      nrm[i * 3 + 1] = p.ny;
      nrm[i * 3 + 2] = p.nz;

      // Fixed scatter direction per point, so the bloom is stable rather than
      // reshuffling every frame.
      dir
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      scat[i * 3] = dir.x;
      scat[i * 3 + 1] = dir.y;
      scat[i * 3 + 2] = dir.z;

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
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scat, 3));
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
      /* The mark spans two world units tall, so a half-height just over one
         frames it tightly. Kept close to 1 deliberately: the mark should fill
         its box, not float in the middle of it. */
      const halfH = 1.04 * (h / w);
      camera.fov = (Math.atan2(Math.max(halfH, 1.04), 5.4) * 360) / Math.PI;
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
         a full rotation would read it back to front half the time. The swing
         is wide enough to show the rim, which is where the thickness lives. */
      mark.rotation.y = Math.sin(t * 0.24) * 0.5 + mx * 0.12;
      mark.rotation.x = Math.sin(t * 0.17) * 0.09 + my * 0.07;
      renderer.render(scene, camera);
    };

    if (reduce) {
      mark.rotation.y = 0.3;
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
