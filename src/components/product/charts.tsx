"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  INK,
  STAGES,
  STAGE_RAMP,
  ACCENT,
  STATUS,
  SURFACE,
  circumference,
  smoothPath,
} from "@/lib/chart";
import { EASE } from "@/lib/motion";
import { MONTHLY, REVIEWS, STAGE_MIX, type COVERAGE } from "@/components/product/dashboard-data";

/* ================================================================== */
/* Tooltip                                                             */
/* ================================================================== */

function Tooltip({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-[var(--radius-small)] border border-line-strong bg-surface-0 px-2.5 py-2 text-left shadow-none"
      style={{ left: x, top: y - 8 }}
    >
      {children}
    </div>
  );
}

const tipLabel = "text-[0.625rem] uppercase tracking-[0.14em] text-mist";
const tipValue = "text-[0.8125rem] font-medium text-paper tabular-nums";

/* ================================================================== */
/* Custody events by stage — ordinal donut                             */
/* ================================================================== */

export function StageDonut() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const total = STAGE_MIX.reduce((sum, s) => sum + s.value, 0);
  const size = 224;
  const cx = size / 2;
  const cy = size / 2;
  const r = 89;
  const circ = circumference(r);

  // Running offsets so each arc starts where the last ended. A 2px surface gap
  // separates neighbouring fills — without it the ramp reads as one blur.
  // Built by fold rather than by mutating a counter inside map, so the render
  // stays free of after-render reassignment.
  const arcs = STAGE_MIX.reduce<
    { stage: string; value: number; i: number; from: number; fraction: number }[]
  >((rows, s, i) => {
    const fraction = s.value / total;
    const from = rows.length ? rows[rows.length - 1].from + rows[rows.length - 1].fraction : 0;
    return [...rows, { stage: s.stage, value: s.value, i, from, fraction }];
  }, []);

  return (
    <div className="flex h-full flex-col justify-center gap-7 sm:flex-row sm:items-center sm:justify-start">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <g>
            {arcs.map((a) => {
              const isDim = hover !== null && hover !== a.i;
              return (
                <motion.circle
                  key={a.stage}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={STAGE_RAMP[a.i]}
                  strokeWidth={hover === a.i ? 21 : 17}
                  strokeLinecap="butt"
                  // 2px of surface between segments, expressed in arc length.
                  strokeDasharray={`${Math.max(a.fraction * circ - 2, 0)} ${circ}`}
                  strokeDashoffset={-a.from * circ}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: isDim ? 0.28 : 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  animate={{ opacity: isDim ? 0.28 : 1 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE.outQuint,
                    delay: reduce ? 0 : 0.1 + a.i * 0.07,
                  }}
                  onPointerEnter={() => setHover(a.i)}
                  onPointerLeave={() => setHover(null)}
                  style={{ cursor: "default" }}
                />
              );
            })}
          </g>
          <text
            x={cx}
            y={cy - 3}
            textAnchor="middle"
            className="fill-paper text-[2rem] font-medium tabular-nums"
            style={{ letterSpacing: "-0.04em" }}
          >
            {total.toLocaleString("en-GB")}
          </text>
          <text
            x={cx}
            y={cy + 19}
            textAnchor="middle"
            className="text-[0.625rem] uppercase"
            style={{ fill: INK.secondary, letterSpacing: "0.14em" }}
          >
            Events
          </text>
        </svg>

        {hover !== null && (
          <Tooltip x={cx} y={cy - r}>
            <div className={tipLabel}>{arcs[hover].stage}</div>
            <div className={tipValue}>
              {arcs[hover].value.toLocaleString("en-GB")} ·{" "}
              {Math.round(arcs[hover].fraction * 100)}%
            </div>
          </Tooltip>
        )}
      </div>

      {/* Legend — always present for two or more series, so identity is never
          carried by colour alone. */}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-1 sm:gap-y-2">
        {arcs.map((a) => (
          <li
            key={a.stage}
            className="flex items-center gap-2.5"
            onPointerEnter={() => setHover(a.i)}
            onPointerLeave={() => setHover(null)}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ background: STAGE_RAMP[a.i] }}
            />
            <span className="text-[0.8125rem] text-mist">{a.stage}</span>
            <span className="ml-auto text-[0.8125rem] tabular-nums text-paper">
              {a.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */
/* Coverage ring — a ratio, never an invented score                    */
/* ================================================================== */

export function CoverageRing({
  item,
  delay = 0,
}: {
  item: (typeof COVERAGE)[number];
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const size = 132;
  const r = 52;
  const circ = circumference(r);
  const fraction = item.done / item.total;
  const colour = item.tone === "verified" ? STATUS.verified : STATUS.review;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={9}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={colour}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={circ}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={reduce ? { strokeDashoffset: circ * (1 - fraction) } : { strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ * (1 - fraction) }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: EASE.outQuint, delay }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[1.25rem] font-medium leading-none tabular-nums text-paper">
            {item.done}
            <span className="text-mist">/{item.total}</span>
          </span>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[0.9375rem] font-medium text-paper">
          {item.label}
        </div>
        <p className="text-[0.8125rem] leading-relaxed text-mist">{item.caption}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Signed-off gauge — a semicircle, matching the product's own form    */
/* ================================================================== */

export function SignOffGauge({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  const reduce = useReducedMotion();
  const W = 240;
  const r = 92;
  const cx = W / 2;
  /* The box hugs the arc: half the stroke of headroom above the apex and the
     same below the baseline, nothing more. A taller box would centre the
     legend against empty space instead of against the drawn mark. */
  const stroke = 13;
  const cy = r + stroke / 2;
  const H = cy + stroke / 2;
  const fraction = done / total;

  // Half-turn arc, so the drawable length is πr rather than 2πr.
  const semi = Math.PI * r;

  return (
    <div className="relative" style={{ width: W }}>
      <svg width={W} height={H} className="overflow-visible">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          /* Accent, not the review amber. 94% of lots signed is progress, not
             a warning, and a status colour used for a completion arc teaches
             the reader that amber means nothing in particular. */
          stroke={ACCENT}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={semi}
          initial={reduce ? { strokeDashoffset: semi * (1 - fraction) } : { strokeDashoffset: semi }}
          whileInView={{ strokeDashoffset: semi * (1 - fraction) }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.15, ease: EASE.outQuint, delay: 0.25 }}
        />
      </svg>

      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <span className="text-[2rem] font-medium leading-none tracking-[-0.04em] tabular-nums text-paper">
          {Math.round(fraction * 100)}%
        </span>
        <span className="mt-1.5 text-[0.75rem] text-mist">{label}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Monthly custody events — stacked bars, ordinal ramp                 */
/* ================================================================== */

export function MonthlyBars() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const totals = MONTHLY.map((m) => m.stages.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals);
  const H = 168;
  const ticks = [0, Math.round(max / 2), max];

  return (
    <div className="relative">
      <div className="flex gap-4">
        {/* Axis — recessive, and the only numbers on the plot. */}
        <div
          className="flex shrink-0 flex-col justify-between text-[0.625rem] tabular-nums text-mist"
          style={{ height: H }}
        >
          {[...ticks].reverse().map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Gridlines sit behind the marks and never compete with them. */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="h-px w-full" style={{ background: INK.grid }} />
            ))}
          </div>

          <div className="relative flex items-end justify-between gap-[3%]" style={{ height: H }}>
            {MONTHLY.map((m, mi) => {
              const total = totals[mi];
              const dim = hover !== null && hover !== mi;
              return (
                <div
                  key={m.month}
                  className="group relative flex h-full flex-1 flex-col justify-end"
                  onPointerEnter={() => setHover(mi)}
                  onPointerLeave={() => setHover(null)}
                >
                  <motion.div
                    className="flex w-full flex-col-reverse overflow-hidden rounded-t-[4px]"
                    style={{ transformOrigin: "bottom" }}
                    initial={reduce ? false : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.62,
                      ease: EASE.outQuint,
                      delay: reduce ? 0 : mi * 0.045,
                    }}
                    animate={{ opacity: dim ? 0.42 : 1 }}
                  >
                    {m.stages.map((v, si) => (
                      <div
                        key={STAGES[si]}
                        style={{
                          height: (v / max) * H,
                          background: STAGE_RAMP[si],
                          // 2px of surface between stacked fills.
                          borderBottom: si > 0 ? `2px solid ${SURFACE}` : undefined,
                        }}
                      />
                    ))}
                  </motion.div>

                  {hover === mi && (
                    <Tooltip x={0} y={-6}>
                      <div className={tipLabel}>{m.month} · total</div>
                      <div className={`${tipValue} mb-1.5`}>{total}</div>
                      <div className="flex flex-col gap-1">
                        {m.stages.map((v, si) => (
                          <div key={STAGES[si]} className="flex items-center gap-2">
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-[1px]"
                              style={{ background: STAGE_RAMP[si] }}
                            />
                            <span className="text-[0.6875rem] text-mist">{STAGES[si]}</span>
                            <span className="ml-auto text-[0.6875rem] tabular-nums text-paper">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex justify-between gap-[3%]">
            {MONTHLY.map((m) => (
              <span
                key={m.month}
                className="flex-1 text-center text-[0.625rem] text-mist"
              >
                {m.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Reviews closed — single series, so no legend; the title names it    */
/* ================================================================== */

export function ReviewTrend() {
  const reduce = useReducedMotion();
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  /* The card is stretched to its row-mate's height, so the plot measures the
     space it is actually given and draws at those pixel dimensions. A fixed
     viewBox scaled to width would leave dead space below the plot whenever the
     neighbouring card is taller. */
  const [box, setBox] = useState({ w: 640, h: 176 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = box.w;
  const H = box.h;
  const pad = { l: 34, r: 8, t: 12, b: 24 };
  const max = 160;

  const points = REVIEWS.map((d, i) => ({
    x: pad.l + (i / (REVIEWS.length - 1)) * (W - pad.l - pad.r),
    y: pad.t + (1 - d.value / max) * (H - pad.t - pad.b),
    ...d,
  }));

  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1].x} ${H - pad.b} L ${points[0].x} ${H - pad.b} Z`;
  const ticks = [0, 50, 100, 150];

  return (
    <div ref={wrapRef} className="relative h-full min-h-[9rem] w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="absolute inset-0"
        onPointerLeave={() => setHover(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - box.left) / box.width) * W;
          let nearest = 0;
          let best = Infinity;
          points.forEach((p, i) => {
            const d = Math.abs(p.x - rel);
            if (d < best) {
              best = d;
              nearest = i;
            }
          });
          setHover(nearest);
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.34" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => {
          const y = pad.t + (1 - t / max) * (H - pad.t - pad.b);
          return (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke={INK.grid} strokeWidth={1} />
              <text
                x={pad.l - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] tabular-nums"
                style={{ fill: INK.secondary }}
              >
                {t}
              </text>
            </g>
          );
        })}

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE.outQuint, delay: 0.35 }}
        />

        {/* 2px line, drawn once on entry. */}
        <motion.path
          d={line}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.25, ease: EASE.inOutQuart }}
        />

        {hover !== null && (
          <g>
            <line
              x1={points[hover].x}
              x2={points[hover].x}
              y1={pad.t}
              y2={H - pad.b}
              stroke={INK.axis}
              strokeWidth={1}
            />
            {/* 2px surface ring keeps the marker legible over the fill. */}
            <circle
              cx={points[hover].x}
              cy={points[hover].y}
              r={5}
              fill={ACCENT}
              stroke={SURFACE}
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {hover !== null && (
        <Tooltip
          x={points[hover].x}
          y={points[hover].y}
        >
          <div className={tipLabel}>Day {points[hover].day}</div>
          <div className={tipValue}>{points[hover].value} closed</div>
        </Tooltip>
      )}
    </div>
  );
}
