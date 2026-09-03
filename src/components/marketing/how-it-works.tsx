"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { STEP_SCREENS } from "@/components/product/module-screens";

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
    icon: "pin",
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

/**
 * Step glyphs. 1.4px strokes, matching the hairline weight used across the
 * product surfaces so the marker reads as part of the same system.
 *
 *   pin    — a located site: onboarding is the moment a record gets a place
 *   shield — screening and risk review
 *   link   — custody, one record joined to the next
 *   coin   — the transaction itself
 *   doc    — the pack that leaves the building
 */
function StepIcon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    pin: (
      <>
        <path d="M8 14.2s4.6-3.9 4.6-7.4a4.6 4.6 0 1 0-9.2 0C3.4 10.3 8 14.2 8 14.2Z" />
        <circle cx="8" cy="6.7" r="1.7" />
      </>
    ),
    shield: (
      <>
        <path d="M8 1.8 13 4v4c0 3-2.2 5.4-5 6.2C5.2 13.4 3 11 3 8V4z" />
        <path d="M6.2 7.9 7.5 9.2l2.4-2.5" />
      </>
    ),
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
        <path d="M9 1.8v2.6h2.6M6.2 8.4h3.6M6.2 11h2.4" />
      </>
    ),
  };
  return <svg {...common}>{paths[name] ?? paths.doc}</svg>;
}

const STEP = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASE.outQuint },
  },
} as const;

/* Copy and screen each fade and rise, the screen a touch further and a beat
   later, so the pair arrives with some depth instead of moving as one block. */
const COPY = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.outQuint },
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
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.outQuint, delay: 0.14 },
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
              /* Triggered by how much of the step is on screen rather than a
                 pixel margin: a step is most of a viewport tall, so a fixed
                 margin would fire it while it is still largely below the fold. */
              viewport={{ once: true, amount: 0.35 }}
              variants={STEP}
              /* Equal outer columns so the rail sits on the section's centre
                 line. An asymmetric split puts the rail off-centre, which
                 reads as a mistake rather than as emphasis. */
              className="grid items-center gap-x-10 gap-y-8 pb-20 last:pb-0 lg:min-h-[70vh] lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] lg:gap-y-0 lg:pb-0"
            >
              {/* Copy */}
              <motion.div variants={COPY}>
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
              </motion.div>

              {/* Rail — desktop only; on a phone the stack is its own sequence
                  and a vertical line beside it adds nothing.

                  `self-stretch` because the grid centres its items, which would
                  otherwise size this column to the marker and leave the line
                  nothing to span. Each row is a full viewport, so the segment
                  runs the whole height and the segments meet end to end. */}
              {/* `items-center` matters: the column is stretched to the full
                  row, so without it the marker pins to the top while the copy
                  and the screen sit centred. */}
              <div className="relative hidden items-center justify-center self-stretch lg:flex">
                {/* The unlit rail runs past the last step too, so the sequence
                    reads as continuous rather than stopping at the marker. */}
                <span
                  aria-hidden="true"
                  className={`absolute top-0 w-px bg-line-strong ${last ? "h-1/2" : "bottom-0"}`}
                />
                {!last && (
                  <motion.span
                    aria-hidden="true"
                    variants={SEGMENT}
                    className="absolute bottom-0 top-0 w-px origin-top bg-gradient-to-b from-gold to-[rgba(217,178,76,0.4)]"
                  />
                )}
                {/* An icon for the work the step does — the number is already
                    carried by the copy column, so repeating it here would spend
                    the marker on nothing. */}
                <motion.span
                  variants={MARKER}
                  className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-gold"
                >
                  <StepIcon name={step.icon} />
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
