"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { useCountUp } from "@/hooks/use-count-up";
import { EASE, SPRING, STAGGER } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Demonstration data — non-production. No claim is made by any figure. */
/* ------------------------------------------------------------------ */

const METRICS = [
  { label: "Active suppliers", value: 38, suffix: "" },
  { label: "Custody events", value: 1204, suffix: "" },
  { label: "Records reviewed", value: 96, suffix: "%" },
] as const;

const STAGES = [
  "Mine",
  "Supplier",
  "Purchase",
  "Transport",
  "Refining",
  "Sale",
] as const;

const EVENTS = [
  {
    time: "09 Aug 07:14Z",
    event: "Extraction logged at pit face",
    party: "Kamituga Coop 12",
    hash: "0x8f2a…c14d",
    state: "verified",
  },
  {
    time: "09 Aug 15:02Z",
    event: "Weighed and sealed at gate",
    party: "Field agent · A. Nsimba",
    hash: "0x41bd…9e07",
    state: "verified",
  },
  {
    time: "11 Aug 09:38Z",
    event: "Assay certified — Au 4.21 g/t",
    party: "SGS Bukavu",
    hash: "0xc077…b2a1",
    state: "verified",
  },
  {
    time: "13 Aug 11:20Z",
    event: "Export permit filed",
    party: "Ministry of Mines",
    hash: "0x5e19…7f33",
    state: "review",
  },
] as const;

const STATE_STYLE = {
  verified: "text-verified-on-dark border-[rgba(47,158,104,0.4)] bg-[rgba(47,158,104,0.14)]",
  review: "text-review-on-dark border-[rgba(224,163,46,0.4)] bg-[rgba(224,163,46,0.14)]",
} as const;

/* ------------------------------------------------------------------ */

function Metric({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  delay: number;
}) {
  const shown = useCountUp(value, { duration: 1500, delay });

  return (
    <div className="px-6 py-5">
      <div className="type-label-sm mb-3 text-ash">{label}</div>
      {/* Figures are luminous punctuation — Sand, never Paper. */}
      <div className="text-[2rem] font-medium leading-none tracking-[-0.04em] tabular-nums text-sand">
        {shown.toLocaleString("en-GB")}
        {suffix}
      </div>
    </div>
  );
}

export function CustodyPanel() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /* Pointer-driven tilt. Decorative, so it is spring-interpolated rather than
     bound straight to the cursor — a raw binding has no momentum and reads as
     mechanical. Disabled outright under reduced motion. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING.pointer);
  const sy = useSpring(py, SPRING.pointer);
  const rotateY = useTransform(sx, [-0.5, 0.5], [5.5, -5.5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-4, 4]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div style={{ perspective: "1400px" }} className="w-full">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        initial={reduce ? false : { opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: EASE.outQuint, delay: 0.28 }}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="gpu relative overflow-hidden rounded-[var(--radius-card)] bg-surface-2"
      >
        {/* ---- Panel head ---- */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <div className="type-label-sm mb-3 text-ash">
              Chain of custody overview
            </div>
            <div className="text-[1.0625rem] font-medium tracking-[-0.02em] text-paper">
              LOT-2891-KMB
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.75rem] text-ash sm:inline">
              Closed 2026-08-14 06:12Z
            </span>
            <span className="inline-flex rounded-[var(--radius-small)] border border-[rgba(47,158,104,0.4)] bg-[rgba(47,158,104,0.14)] px-2.5 py-1 text-[0.75rem] font-medium text-verified-on-dark">
              Verified
            </span>
          </div>
        </div>

        {/* ---- Metrics ---- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { delayChildren: 0.5, staggerChildren: STAGGER.normal } } }}
          className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] sm:grid-cols-4"
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.outQuint } },
              }}
              className="bg-surface-1"
            >
              <Metric {...m} delay={560 + i * 90} />
            </motion.div>
          ))}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.outQuint } },
            }}
            className="bg-surface-1 px-6 py-5"
          >
            <div className="type-label-sm mb-3 text-ash">Retention</div>
            <div className="flex items-center gap-2 text-[1.0625rem] font-medium leading-none text-paper">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-verified opacity-70" />
              </span>
              Enforced
            </div>
          </motion.div>
        </motion.div>

        {/* ---- Six-stage process ---- */}
        <div className="border-t border-line px-6 py-7">
          <div className="relative">
            {/* The connecting rule draws once, left to right, then stops.
                Below `sm` the stages stack, so the rule turns vertical with
                them — a horizontal rule across wrapped rows would connect
                stages that don't follow one another. */}
            <div className="absolute left-[0.6875rem] top-0 bottom-0 w-px bg-[rgba(255,255,255,0.10)] sm:left-0 sm:right-0 sm:top-[0.6875rem] sm:bottom-auto sm:h-px sm:w-auto" />
            <motion.div
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: EASE.inOutQuart, delay: 0.75 }}
              className="absolute left-[0.6875rem] top-0 bottom-0 w-px origin-top bg-gradient-to-b from-gold via-gold to-[rgba(217,178,76,0.25)] sm:left-0 sm:right-0 sm:top-[0.6875rem] sm:bottom-auto sm:h-px sm:w-auto sm:origin-left sm:bg-gradient-to-r"
            />

            <motion.ol
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { delayChildren: 0.82, staggerChildren: 0.11 } } }}
              className="relative grid grid-cols-1 gap-y-5 sm:grid-cols-6 sm:gap-y-6"
            >
              {STAGES.map((stage) => (
                <motion.li
                  key={stage}
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE.outQuint } },
                  }}
                  className="flex flex-row items-center gap-3 sm:flex-col sm:items-start"
                >
                  <span className="relative flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center">
                    <span className="h-[0.4375rem] w-[0.4375rem] rounded-full bg-gold" />
                    <span className="absolute inset-0 rounded-full border border-[rgba(217,178,76,0.28)]" />
                  </span>
                  <span className="text-[0.8125rem] text-mist">{stage}</span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>

        {/* ---- Event ledger ---- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { delayChildren: 1.15, staggerChildren: 0.07 } } }}
          className="hidden border-t border-line md:block"
        >
          <div className="grid grid-cols-[8.5rem_1fr_11rem_7rem] gap-4 border-b border-line px-6 py-3">
            {["Timestamp", "Event", "Signed by", "Attestation"].map((h) => (
              <div key={h} className="type-label-sm text-ash">
                {h}
              </div>
            ))}
          </div>
          {EVENTS.map((e) => (
            <motion.div
              key={e.hash}
              variants={{
                hidden: { opacity: 0, x: -6 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.36, ease: EASE.outQuint } },
              }}
              className="grid grid-cols-[8.5rem_1fr_11rem_7rem] items-center gap-4 border-b border-line-soft px-6 py-3 last:border-b-0"
            >
              <div className="text-[0.8125rem] text-mist tabular-nums">{e.time}</div>
              <div className="flex items-center gap-2.5 text-[0.875rem] text-paper">
                {e.event}
                <span
                  className={`shrink-0 rounded-[var(--radius-small)] border px-1.5 py-0.5 text-[0.6875rem] font-medium ${STATE_STYLE[e.state]}`}
                >
                  {e.state === "verified" ? "Signed" : "Pending"}
                </span>
              </div>
              <div className="truncate text-[0.8125rem] text-mist">{e.party}</div>
              {/* Mono is reserved for strings a person compares character by character. */}
              <div className="type-mono text-ash">{e.hash}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Spec §5.2 — public figures must be real or plainly marked. */}
        <div className="flex items-center gap-2 border-t border-line px-5 py-2.5 ">
          <span className="h-1 w-1 rounded-full bg-ash" />
          <span className="text-[0.6875rem] tracking-[0.06em] text-ash">
            Demonstration data · not a production record
          </span>
        </div>
      </motion.div>
    </div>
  );
}
