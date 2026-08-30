"use client";

import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/button";
import { EASE } from "@/lib/motion";

/**
 * The operating sequence — spec §5.5.
 *
 * Five capability groups in the order the work actually happens. The rail
 * connecting them advances as the reader advances, so the motion reports where
 * they are in the chain rather than performing at them.
 *
 * The rail is built from per-step segments rather than one bar driven by page
 * scroll progress. A single scroll-linked bar is the obvious construction and
 * it is brittle: it needs the page to be tall enough for its offset range to
 * resolve, and it silently freezes if anything above it becomes a scroll
 * container. Segments need no measurement at all — each one fills when its
 * step arrives, and they concatenate into one continuous line.
 *
 * Everything animated is transform or opacity; the whole thing holds still
 * under reduced motion.
 */

const STEPS = [
  {
    title: "Onboard",
    body: "Mines and suppliers, with KYC, ownership, site records and GPS verification captured once.",
    icon: "user",
  },
  {
    title: "Evaluate",
    body: "Due diligence workflows, sanctions screening, risk reviews and the monthly controls behind them.",
    icon: "shield",
  },
  {
    title: "Trace",
    body: "Custody events, approvals, transport and refining — each one linked to the record it belongs to.",
    icon: "link",
  },
  {
    title: "Operate",
    body: "Purchases, sales, inventory, cash movement and the financial controls around them.",
    icon: "coin",
  },
  {
    title: "Report",
    body: "Audit packs, evidence exports, retention state and management sign-off, for a chosen period.",
    icon: "doc",
  },
] as const;

/* Variants, so a step's arrival drives its own subtree. */

const STEP = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.outQuint },
  },
} as const;

const SEGMENT = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.75, ease: EASE.inOutQuart, delay: 0.12 },
  },
} as const;

const MARKER = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: EASE.outQuint, delay: 0.08 },
  },
} as const;

function StepIcon({ name }: { name: string }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    user: (
      <>
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3 13.5a5 5 0 0 1 10 0" />
      </>
    ),
    shield: <path d="M8 1.8 13 4v4c0 3-2.2 5.4-5 6.2C5.2 13.4 3 11 3 8V4z" />,
    link: (
      <>
        <path d="M6.6 9.4a2.6 2.6 0 0 0 3.9.3l2-2a2.6 2.6 0 0 0-3.7-3.7l-1.1 1.1" />
        <path d="M9.4 6.6a2.6 2.6 0 0 0-3.9-.3l-2 2a2.6 2.6 0 0 0 3.7 3.7l1.1-1.1" />
      </>
    ),
    coin: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.8v6.4M6.3 6.4h2.6a1.3 1.3 0 0 1 0 2.6H6.9a1.3 1.3 0 0 0 0 2.6h2.8" />
      </>
    ),
    doc: (
      <>
        <path d="M9 1.8H4.4v12.4h7.2V4.4z" />
        <path d="M9 1.8v2.6h2.6M6.2 8h3.6M6.2 10.6h3.6" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="shell py-[var(--spacing-section)]">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
        {/* ---- Left: holds position while the sequence runs ---- */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE.outQuint }}
          >
            <p className="type-label mb-7 text-gold">One operating layer</p>
            <h2 className="type-heading mb-6 text-paper">
              From mine data to final transaction, in one controlled system
            </h2>
            <p
              className="type-body mb-9 text-mist"
              style={{ textWrap: "pretty" }}
            >
              FIQS connects operational data, responsible sourcing controls and
              transaction records in one environment — without rebuilding the
              evidence trail every time.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/demo" variant="primary">
                Book a demo
              </ButtonLink>
              <ButtonLink href="/platform" variant="ghost" className="group">
                Explore the platform
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 ease-[var(--ease-out-quint)] group-hover:translate-x-0.5"
                >
                  →
                </span>
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* ---- Right: the sequence ---- */}
        <ol className="relative">
          {/* Unlit rail, full height. Inset so it runs through the centre of
              the markers. */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line-strong"
          />

          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={STEP}
              className="relative flex gap-6 pb-14 last:pb-0"
            >
              {/* Each step owns the rail segment leading away from it and
                  fills it as it arrives; the segments concatenate into one
                  continuous line.

                  The segment inherits the parent's inView state through
                  variants rather than carrying its own `whileInView`. It has
                  to: at scaleY 0 its box has no area, and IntersectionObserver
                  never reports a zero-area element as intersecting — so an
                  observer on the segment itself could never fire the animation
                  that gives it height. */}
              {i < STEPS.length - 1 && (
                <motion.span
                  aria-hidden="true"
                  variants={SEGMENT}
                  className="absolute bottom-0 left-[1.375rem] top-6 w-px origin-top bg-gradient-to-b from-gold to-sand"
                />
              )}

              {/* Marker. Sits on the canvas colour so the rail passes behind
                  it rather than through it. */}
              <motion.span
                variants={MARKER}
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-gold"
              >
                <StepIcon name={step.icon} />
              </motion.span>

              <div className="pt-2">
                <div className="mb-2.5 flex items-baseline gap-3">
                  <h3 className="type-subhead text-paper">{step.title}</h3>
                  <span className="type-mono text-ash">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p
                  className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-mist"
                  style={{ textWrap: "pretty" }}
                >
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
