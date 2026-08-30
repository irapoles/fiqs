"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE, STAGGER } from "@/lib/motion";

/**
 * Spec §5.3. These name the frameworks the work is *structured around* — they
 * are not endorsements, and the wording must never imply certification or
 * accreditation, which remain with the recognised bodies and their assessors.
 */
const REFERENCES = [
  "OECD Due Diligence Guidance",
  "LBMA ASM Toolkit",
  "Responsible Minerals Assurance Process",
] as const;

export function ProofStrip() {
  const reduce = useReducedMotion();

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
        className="shell flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between md:gap-10"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.outQuint } },
          }}
          className="type-label shrink-0 text-ash"
        >
          Structured around
        </motion.p>

        <div className="flex flex-col gap-x-10 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center">
          {REFERENCES.map((ref) => (
            <motion.span
              key={ref}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.outQuint } },
              }}
              className="text-[0.9375rem] text-mist"
            >
              {ref}
            </motion.span>
          ))}
        </div>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.outQuint } },
          }}
          className="max-w-[22rem] text-[0.8125rem] leading-relaxed text-ash md:text-right"
        >
          FIQS supports responsible sourcing workflows and produces audit-ready
          records. Certification and accreditation remain with the recognised
          bodies and their approved assessors.
        </motion.p>
      </motion.div>
    </section>
  );
}
