"use client";

import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/button";
import { EASE, STAGGER } from "@/lib/motion";

/**
 * Two ways to arrange a demo.
 *
 * Route 01 is the form further down the page — someone reaches out. Route 02
 * is a time booked there and then. Both stay available: an immediate booking
 * suits a visitor who already knows they want one, and the form suits
 * everyone who would rather describe their operation first.
 *
 * The Calendly link is not invented. Until a real one is supplied, route 02
 * says so and offers the form instead of pointing at a URL that would 404 in
 * front of a prospect — §28 is explicit that an unevidenced detail comes out
 * of public copy rather than being approximated. Drop the link into
 * CALENDLY_URL and the route goes live with no other change.
 */

const CALENDLY_URL: string | null = null;

const ROUTES = [
  {
    n: "01",
    title: "Request a callback",
    body: "Fill in your details and someone will reach out to arrange a demo.",
  },
  {
    n: "02",
    title: "Book a call now",
    body: "Choose an available time immediately through Calendly for a 15-minute session.",
  },
] as const;

export function BookingRoutes() {
  const reduce = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE.outQuint },
    },
  } as const;

  return (
    <motion.div
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
      className="grid gap-5 md:grid-cols-2"
    >
      {ROUTES.map((r) => {
        const live = r.n === "01" || CALENDLY_URL !== null;

        return (
          <motion.section
            key={r.n}
            variants={item}
            className="flex flex-col rounded-[var(--radius-card)] bg-surface-2 p-7"
          >
            <span className="type-mono mb-5 text-[0.75rem] text-gold">{r.n}</span>
            <h3 className="type-subhead mb-3 text-paper">{r.title}</h3>
            <p
              className="mb-7 text-[0.9375rem] leading-relaxed text-mist"
              style={{ textWrap: "pretty" }}
            >
              {r.body}
            </p>

            {/* Pushed to the foot so the two actions share a line regardless
                of how the copy above them wraps. */}
            <div className="mt-auto">
              {r.n === "01" ? (
                <ButtonLink href="#request" variant="secondary">
                  Go to the form
                </ButtonLink>
              ) : live ? (
                <ButtonLink
                  href={CALENDLY_URL as string}
                  variant="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Choose a time
                </ButtonLink>
              ) : (
                <p className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-review-on-dark">
                  <span
                    aria-hidden="true"
                    className="mt-[0.375rem] h-1.5 w-1.5 shrink-0 rounded-full bg-review"
                  />
                  <span>
                    Instant booking is not connected yet. Use the form below and
                    we will come back with times.
                  </span>
                </p>
              )}
            </div>
          </motion.section>
        );
      })}
    </motion.div>
  );
}
