"use client";

import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/button";
import { Dashboard } from "@/components/product/dashboard";
import { ParticleStone } from "@/components/hero/particle-stone";
import { EASE, STAGGER } from "@/lib/motion";

/** Words rise in sequence — the headline assembles rather than appears. */
const WORD = {
  hidden: { opacity: 0, y: "0.42em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.78, ease: EASE.outQuint },
  },
} as const;

const HEADLINE = "The digital operating system for responsible gold supply chains";

export function Hero() {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(" ");

  return (
    <section className="relative">
      {/* ---- The fold -------------------------------------------------
          Its own stacking context, so the orb centres on the viewport the
          visitor actually lands on rather than on the whole section.
          -------------------------------------------------------------- */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      {/* ---- Orb ---- Sized in vmin so it stays circular and keeps its
          presence on a phone. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.9, ease: EASE.outQuint, delay: 0.15 }}
          className="h-full w-full"
        >
          <ParticleStone className="h-full w-full" />
        </motion.div>
      </div>

      {/* Type scrim — a tight ellipse behind the copy only. Wide enough to
          hold the measure, narrow enough that the orb's rim stays intact on
          both sides of it. */}
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0" />

      <div className="shell relative flex flex-col items-center pt-24 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
          className="flex flex-col items-center"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.outQuint } },
            }}
            className="type-label mb-8 text-gold"
          >
            Responsible gold infrastructure
          </motion.p>

          <h1 className="type-display mb-8 max-w-[20ch] text-paper">
            {reduce ? (
              HEADLINE
            ) : (
              <motion.span
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.045 } },
                }}
                className="inline"
              >
                {words.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    {/* No `will-change` here: Motion promotes the layer for
                        the duration of the transition and releases it on
                        completion. Pinning it permanently across nine spans
                        leaves nine orphaned compositing layers, which the
                        mobile paint path drops outright. */}
                    <motion.span variants={WORD} className="inline-block">
                      {word}
                      {i < words.length - 1 ? " " : ""}
                    </motion.span>
                  </span>
                ))}
              </motion.span>
            )}
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.62, ease: EASE.outQuint, delay: 0.48 },
              },
            }}
            className="type-body mb-11 max-w-[var(--container-measure)] text-mist"
            style={{ textWrap: "pretty" }}
          >
            FIQS centralises mine records, supplier onboarding, due diligence
            workflows, sanctions screening, chain of custody, gold transactions
            and financial reporting in one secure platform.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.62, ease: EASE.outQuint, delay: 0.58 },
              },
            }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:gap-3"
          >
            <ButtonLink href="/demo" variant="primary">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/overview" variant="secondary">
              Download corporate overview
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
          </motion.div>
        </motion.div>
      </div>
      </div>

      {/* ---- Product composition ----
          The actual operator view, lifted out of the fold so the orb owns the
          first screen and the software owns the scroll that follows. */}
      <div className="shell relative -mt-10 pb-[var(--spacing-section)]">
        <Dashboard compact />
      </div>
    </section>
  );
}
