"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE, STAGGER } from "@/lib/motion";

/**
 * Shared page furniture.
 *
 * Every page below the homepage is built from these, so the rhythm, the
 * reveal timing and the measure stay identical across the site rather than
 * being re-decided per page. The homepage keeps its own bespoke hero — it is
 * the one surface that earns one.
 */

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE.outQuint },
  },
} as const;

/** Page header. Sits under the fixed bar, so it carries its own top space. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <header className="shell pb-16 pt-36 lg:pb-24 lg:pt-44">
      <motion.div
        initial={reduce ? undefined : "hidden"}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
        className="max-w-[52rem]"
      >
        <motion.p variants={rise} className="type-label mb-7 text-gold">
          {eyebrow}
        </motion.p>
        <motion.h1 variants={rise} className="type-heading mb-6 text-paper">
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            variants={rise}
            className="type-body max-w-[54ch] text-mist"
            style={{ textWrap: "pretty" }}
          >
            {lead}
          </motion.p>
        )}
        {children && (
          <motion.div variants={rise} className="mt-10">
            {children}
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}

/** A titled band. `tone="recessed"` sinks it a step for alternation. */
export function Section({
  eyebrow,
  title,
  lead,
  tone = "canvas",
  children,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  tone?: "canvas" | "recessed";
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      className={
        tone === "recessed"
          ? "border-y border-line bg-surface-0 py-[var(--spacing-section)]"
          : "py-[var(--spacing-section)]"
      }
    >
      <div className="shell">
        {(eyebrow || title || lead) && (
          <motion.div
            initial={reduce ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
            className="mb-14 max-w-[46rem]"
          >
            {eyebrow && (
              <motion.p variants={rise} className="type-label mb-7 text-gold">
                {eyebrow}
              </motion.p>
            )}
            {title && (
              <motion.h2 variants={rise} className="type-heading text-paper">
                {title}
              </motion.h2>
            )}
            {lead && (
              <motion.p
                variants={rise}
                className="type-body mt-5 text-mist"
                style={{ textWrap: "pretty" }}
              >
                {lead}
              </motion.p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Card grid. Cards are equal-width by default; hierarchy comes from order. */
export function CardGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid gap-6 ${columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  body,
  meta,
  children,
}: {
  title: string;
  body?: string;
  meta?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: EASE.outQuint }}
      className="flex flex-col rounded-[var(--radius-card)] bg-surface-2 p-7"
    >
      {meta && <p className="type-label-sm mb-4 text-mist">{meta}</p>}
      <h3 className="type-subhead mb-3 text-paper">{title}</h3>
      {body && (
        <p
          className="text-[0.9375rem] leading-relaxed text-mist"
          style={{ textWrap: "pretty" }}
        >
          {body}
        </p>
      )}
      {children}
    </motion.article>
  );
}

/** Hairline list — rows rather than cards, where density beats separation. */
export function RowList({
  rows,
}: {
  rows: readonly { term: string; detail: string }[];
}) {
  const reduce = useReducedMotion();

  return (
    <motion.dl
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={{ visible: { transition: { staggerChildren: STAGGER.tight } } }}
      className="border-t border-line"
    >
      {rows.map((row) => (
        <motion.div
          key={row.term}
          variants={rise}
          className="grid gap-2 border-b border-line py-6 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-10"
        >
          <dt className="text-[0.9375rem] font-medium text-paper">{row.term}</dt>
          <dd
            className="text-[0.9375rem] leading-relaxed text-mist"
            style={{ textWrap: "pretty" }}
          >
            {row.detail}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

/**
 * Marks a surface whose content is not yet confirmed.
 *
 * Spec §28 requires unconfirmed claims to stay internal, and §30.5 to keep
 * them behind flags or omit them. Where a page must exist before its content
 * is approved, this states that plainly rather than letting a placeholder
 * read as fact.
 */
export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-[rgba(224,163,46,0.3)] bg-[rgba(224,163,46,0.07)] p-5 text-[0.875rem] leading-relaxed text-review-on-dark">
      <span
        aria-hidden="true"
        className="mt-[0.4375rem] h-1.5 w-1.5 shrink-0 rounded-full bg-review"
      />
      <span>{children}</span>
    </p>
  );
}

/** Scope boundary — §1.3 requires it wherever standards or assurance appear. */
export function ScopeNote() {
  return (
    <p className="max-w-[72ch] text-[0.875rem] leading-relaxed text-mist">
      FIQS supports responsible sourcing workflows and produces audit-ready
      records. Certification of gold and accreditation under any assurance
      scheme remain with the recognised bodies and their approved assessors.
    </p>
  );
}
