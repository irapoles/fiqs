"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE, STAGGER } from "@/lib/motion";

/**
 * Operator testimonials.
 *
 * ---------------------------------------------------------------------------
 * THESE QUOTES ARE PLACEHOLDERS. They are not real people and not real
 * customers.
 * ---------------------------------------------------------------------------
 *
 * Spec §28 lists reference customers and pilot operators among the claims that
 * must stay internal until confirmed, and §5.13 forbids unverified external
 * validation outright — "if a claim cannot be evidenced, remove it from public
 * copy instead of softening it". A fabricated quote attributed to a named
 * operator is the exact shape of claim those rules exist to stop.
 *
 * So this section carries two safeguards until real, approved quotes arrive:
 *
 *   1. `APPROVED` gates the whole section. While it is false the section
 *      renders a visible placeholder marker; flip it only when every quote
 *      below has been replaced with an approved one.
 *   2. No invented faces. The guide forbids anonymous silhouettes standing in
 *      for miners, and generated portraits of people who do not exist would be
 *      worse, so attribution is set as an initial monogram.
 *
 * Regions named below are real places in Tanzania; the operations and people
 * are not.
 */

const APPROVED = false;

const QUOTES = [
  {
    quote:
      "We had the policies and the paperwork. What we did not have was a way to show an assessor the whole chain in one place, without three weeks of digging through folders.",
    name: "Neema Kimaro",
    role: "Managing Director",
    operation: "Placeholder operation",
    region: "Geita Region, Tanzania",
  },
  {
    quote:
      "The monthly reviews used to live in one person's inbox. Now the record exists whether or not that person is in the office, and it carries the signature that proves it.",
    name: "Joseph Mwangosi",
    role: "Head of Compliance",
    operation: "Placeholder operation",
    region: "Chunya District, Tanzania",
  },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function Testimonials() {
  const reduce = useReducedMotion();

  const card = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE.outQuint },
    },
  } as const;

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ visible: { transition: { staggerChildren: STAGGER.loose } } }}
      >
        <motion.div variants={card} className="mb-14 max-w-[46rem]">
          <p className="type-label mb-7 text-gold">From the pit face</p>
          <h2 className="type-heading text-paper">
            Built by operators, used by operators
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {QUOTES.map((q) => (
            <motion.figure
              key={q.name}
              variants={card}
              className="flex flex-col justify-between rounded-[var(--radius-card)] bg-surface-2 p-8 lg:p-10"
            >
              <blockquote className="mb-10">
                <p
                  className="type-subhead text-paper"
                  style={{ textWrap: "pretty" }}
                >
                  {/* Typographic quotes, not the straight ASCII pair. */}
                  &ldquo;{q.quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[0.8125rem] font-medium text-gold"
                >
                  {initials(q.name)}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[0.9375rem] font-medium text-paper">
                    {q.name}
                  </span>
                  <span className="text-[0.8125rem] text-mist">
                    {q.role} · {q.operation}
                  </span>
                  <span className="text-[0.8125rem] text-mist">{q.region}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {!APPROVED && (
          <motion.p
            variants={card}
            className="mt-6 flex items-center gap-2 text-[0.6875rem] tracking-[0.06em] text-mist"
          >
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-review" />
            Placeholder quotes · not real customers, pending approval before
            launch
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
