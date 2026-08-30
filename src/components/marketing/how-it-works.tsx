"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { STEP_SCREENS } from "@/components/product/step-screens";

/**
 * The operating sequence — spec §5.5.
 *
 * Five capability groups in the order the work actually happens, each paired
 * with the view of the product where that work is done. The rail running down
 * the middle advances as the reader advances, so the motion reports where they
 * are in the chain rather than performing at them.
 *
 * The rail is built from per-step segments rather than one bar driven by page
 * scroll progress. A single scroll-linked bar needs the page to be tall enough
 * for its offset range to resolve and freezes silently if anything above it
 * becomes a scroll container; segments need no measurement at all. Each
 * segment inherits its step's in-view state through variants rather than
 * carrying its own observer, so its animation is driven by the step arriving
 * rather than by the segment — which at zero scale has no height to observe.
 */

const STEPS = [
  {
    title: "Onboard",
    body: "Mines and suppliers, with KYC, ownership, site records and GPS verification captured once.",
  },
  {
    title: "Evaluate",
    body: "Due diligence workflows, sanctions screening, risk reviews and the monthly controls behind them.",
  },
  {
    title: "Trace",
    body: "Custody events, approvals, transport and refining — each one linked to the record it belongs to.",
  },
  {
    title: "Operate",
    body: "Purchases, sales, inventory, cash movement and the financial controls around them.",
  },
  {
    title: "Report",
    body: "Audit packs, evidence exports, retention state and management sign-off, for a chosen period.",
  },
] as const;

const STEP = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE.outQuint },
  },
} as const;

const SEGMENT = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.85, ease: EASE.inOutQuart, delay: 0.1 },
  },
} as const;

const MARKER = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: EASE.outQuint },
  },
} as const;

const SCREEN = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.outQuint, delay: 0.12 },
  },
} as const;

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="shell py-[var(--spacing-section)]">
      {/* ---- Section head, centred ---- */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE.outQuint }}
        className="mx-auto mb-20 max-w-[46rem] text-center lg:mb-28"
      >
        <p className="type-label mb-7 text-gold">One operating layer</p>
        <h2 className="type-heading mb-6 text-paper">
          From mine data to final transaction, in one controlled system
        </h2>
        <p className="type-body text-mist" style={{ textWrap: "pretty" }}>
          FIQS connects operational data, responsible sourcing controls and
          transaction records in one environment — without rebuilding the
          evidence trail every time.
        </p>
      </motion.div>

      {/* ---- The sequence ---- */}
      <ol className="relative">
        {STEPS.map((step, i) => {
          const Screen = STEP_SCREENS[step.title];
          const last = i === STEPS.length - 1;

          return (
            <motion.li
              key={step.title}
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={STEP}
              className="grid items-start gap-x-10 gap-y-8 pb-20 last:pb-0 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1.4fr)] lg:gap-y-0 lg:pb-28"
            >
              {/* Copy */}
              <div className="lg:pt-2">
                {/* Regular, not Medium — 400 is the lightest weight the guide
                    sanctions, and the numeral is a marker rather than a
                    heading, so it should not compete with the title beneath. */}
                <div
                  aria-hidden="true"
                  className="mb-3 text-[2rem] font-normal leading-none tracking-[-0.03em] text-gold lg:text-[2.25rem]"
                >
                  {i + 1}
                </div>
                <h3 className="mb-4 text-[1.75rem] font-medium leading-[1.05] tracking-[-0.025em] text-paper lg:text-[2rem]">
                  {step.title}
                </h3>
                <p
                  className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-mist"
                  style={{ textWrap: "pretty" }}
                >
                  {step.body}
                </p>
              </div>

              {/* Rail — desktop only; on a phone the stack is its own sequence
                  and a vertical line beside it adds nothing.

                  `self-stretch` because the grid is `items-start`, which would
                  otherwise size this column to the marker and leave the line
                  nothing to span. The negative bottom carries it through the
                  row's bottom padding, which sits outside the grid row, so the
                  segments meet rather than stopping short of one another. */}
              <div className="relative hidden justify-center self-stretch lg:flex">
                {!last && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-0 -bottom-28 w-px bg-line-strong"
                    />
                    <motion.span
                      aria-hidden="true"
                      variants={SEGMENT}
                      className="absolute top-0 -bottom-28 w-px origin-top bg-gradient-to-b from-gold to-[rgba(217,178,76,0.25)]"
                    />
                  </>
                )}
                <motion.span
                  variants={MARKER}
                  className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-[0.75rem] font-medium tabular-nums text-gold"
                >
                  {i + 1}
                </motion.span>
              </div>

              {/* Screen */}
              <motion.div variants={SCREEN}>
                <Screen />
              </motion.div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
