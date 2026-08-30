"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { EASE, STAGGER } from "@/lib/motion";

/**
 * Framework bar.
 *
 * This is deliberately NOT a customer logo wall. Spec §1.2 and §5.6 forbid any
 * implication of endorsement, approval or certification, and §17 forbids
 * unverified external validation. Two things carry that: the section is
 * labelled "Structured around" rather than "Trusted by", and the scope
 * statement sits in this block rather than buried in the footer — it is the
 * only thing standing between these marks and an implied endorsement, so it
 * stays visible.
 *
 * Polygon is separated from the three frameworks because it is a different
 * kind of thing: a technology the platform writes to, not a standard the work
 * is shaped by.
 */

const FRAMEWORKS = [
  {
    name: "OECD Due Diligence Guidance",
    src: "/frameworks/oecd.png",
    width: 2182,
    height: 1221,
    /* Wordmark-plus-globe, so it carries more height than the others. */
    className: "h-[3.75rem]",
  },
  {
    name: "LBMA ASM Toolkit",
    src: "/frameworks/lbma.png",
    width: 1046,
    height: 1221,
    className: "h-[5.25rem]",
  },
] as const;

export function FrameworkBar() {
  const reduce = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE.outQuint },
    },
  } as const;

  return (
    <section
      aria-label="Frameworks the platform structures work around"
      className="relative border-y border-line bg-surface-0"
    >
      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: STAGGER.loose } } }}
        className="shell py-12"
      >
        <motion.p
          variants={item}
          className="type-label mb-12 text-center text-[0.8125rem] text-mist"
        >
          Structured around
        </motion.p>

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
          {FRAMEWORKS.map((f) => (
            <motion.div key={f.name} variants={item} className="flex flex-col items-center gap-5 text-center">
              {/* Third-party marks are shown monochrome on the dark surface.
                  invert() lifts the black artwork to white; screen drops the
                  white plate behind it, so the mark sits on graphite cleanly
                  whether or not the source has an alpha channel. */}
              <div className="flex h-20 items-center justify-center">
                <Image
                  src={f.src}
                  alt={f.name}
                  width={f.width}
                  height={f.height}
                  className={`${f.className} w-auto opacity-80`}
                  style={{ filter: "invert(1)", mixBlendMode: "screen" }}
                />
              </div>
              <div className="text-[0.9375rem] font-medium text-paper">
                {f.name}
              </div>
            </motion.div>
          ))}

          {/* RMAP has no mark supplied, so it is set as type rather than
              substituting an unofficial one. */}
          <motion.div variants={item} className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 items-center justify-center">
              <span className="text-[2rem] font-medium leading-none tracking-[-0.03em] text-paper opacity-80">
                RMAP
              </span>
            </div>
            <div className="text-[0.9375rem] font-medium text-paper">
              Responsible Minerals Assurance Process
            </div>
          </motion.div>
        </div>

        {/* Polygon is a dependency, not a standard — hence its own line. */}
        <motion.div
          variants={item}
          className="mt-12 flex flex-col items-center gap-4 border-t border-line pt-10 sm:flex-row sm:justify-center"
        >
          <div className="flex items-center gap-4">
            <span className="type-label-sm shrink-0 text-mist">
              Ledger references written to
            </span>
            <Image
              src="/frameworks/polygon.svg"
              alt="Polygon"
              width={2627}
              height={514}
              className="h-6 w-auto opacity-80"
            />
          </div>
        </motion.div>

        {/* Scope boundary — §1.3 requires this visible, never buried. */}
        <motion.p
          variants={item}
          className="mx-auto mt-12 max-w-[68ch] text-center text-[0.8125rem] leading-relaxed text-mist"
        >
          FIQS supports responsible sourcing workflows and produces audit-ready
          records. Certification of gold and accreditation under any assurance
          scheme remain with the recognised bodies and their approved assessors.
          These marks identify the frameworks the platform structures work
          around; they do not indicate endorsement, approval or membership.
        </motion.p>
      </motion.div>
    </section>
  );
}
