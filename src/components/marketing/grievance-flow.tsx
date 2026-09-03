"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE, STAGGER } from "@/lib/motion";

/** The public case flow — spec §14. Seven stages, in order, no branching shown. */
const FLOW = [
  { title: "Submit concern", body: "With or without your name. No account required." },
  { title: "Receive reference code", body: "Issued immediately, and the only thing you need to check progress." },
  { title: "Internal review", body: "The case is routed to an assigned officer." },
  { title: "Investigation", body: "Findings are recorded against the case, with dates and names." },
  { title: "Decision / action plan", body: "A named decision, and the actions that follow from it." },
  { title: "Case closure", body: "Closed with its full history retained." },
  { title: "Status lookup", body: "Your reference code keeps working after closure." },
] as const;

export function GrievanceFlow() {
  const reduce = useReducedMotion();

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <motion.ol
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
        className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line md:grid-cols-2 lg:grid-cols-4"
      >
        {FLOW.map((s, i) => (
          <motion.li
            key={s.title}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.outQuint } },
            }}
            className="bg-surface-2 p-6"
          >
            <span className="type-mono mb-4 block text-[0.6875rem] text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-2.5 text-[0.9375rem] font-medium text-paper">{s.title}</h3>
            <p className="text-[0.875rem] leading-relaxed text-mist">{s.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
