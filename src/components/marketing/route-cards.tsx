"use client";

import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/button";
import { EASE, STAGGER } from "@/lib/motion";

/**
 * The two audience routes — spec §5.8 / §9.
 *
 * §5.8 also asks for the choice to persist and personalise later steps. That
 * is deliberately not done here: it needs a cookie, and dropping a
 * personalisation cookie before a consent decision would contradict the
 * privacy posture the rest of the site takes. It belongs with the consent
 * mechanism, not ahead of it.
 */

const ROUTES = [
  {
    kicker: "Already inside an assurance process",
    title: "Keep the standard, gain the structure",
    body: "You hold your due diligence across folders, spreadsheets and email. FIQS moves the same evidence into one controlled system with versioning, approvals and retention built in.",
    points: [
      "Import existing records",
      "Schedule recurring reviews",
      "Track approvals",
      "Timestamp sign-off",
      "Export audit packs",
      "Maintain retention state",
    ],
    cta: { label: "See FIQS for existing programmes", href: "/demo" },
  },
  {
    kicker: "Starting your first assessment",
    title: "Start the work in the right shape",
    body: "Use FIQS to establish the structure, templates and training needed to build a management system from the ground up.",
    points: [
      "Guided policies & procedures",
      "Academy course",
      "Supplier onboarding forms",
      "Readiness checklist",
      "Gap report",
      "Recommended implementation sequence",
    ],
    cta: { label: "Start guided onboarding", href: "/onboarding" },
  },
] as const;

export function RouteCards() {
  const reduce = useReducedMotion();

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: STAGGER.loose } } }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {ROUTES.map((r) => (
          <motion.article
            key={r.title}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE.outQuint } },
            }}
            className="flex flex-col rounded-[var(--radius-card)] bg-surface-2 p-8 lg:p-10"
          >
            <p className="type-label-sm mb-6 text-gold">{r.kicker}</p>
            <h3 className="type-subhead mb-4 text-paper">{r.title}</h3>
            <p
              className="mb-8 text-[0.9375rem] leading-relaxed text-mist"
              style={{ textWrap: "pretty" }}
            >
              {r.body}
            </p>

            <ul className="mb-10 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {r.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-gold"
                  />
                  <span className="text-[0.875rem] text-dust">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <ButtonLink href={r.cta.href} variant="primary">
                {r.cta.label}
              </ButtonLink>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
