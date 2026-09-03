"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Wordmark } from "@/components/brand/logo";
import { EASE, STAGGER } from "@/lib/motion";

/**
 * Site footer — column structure from spec §3.
 *
 * Two things are deliberate here.
 *
 * The scope statement repeats. It already appears beside the framework marks,
 * and §1.3 requires the boundary to be preserved "whenever standards or
 * assurance are discussed" — a footer is the one place a reader checks when
 * they are deciding whether to believe a site, so it earns the repetition.
 *
 * There are no company registration details. §28 lists the operating entity,
 * jurisdiction and registered address among the claims that must stay internal
 * until confirmed, and the rule is to omit rather than soften. When they are
 * approved they belong in the bottom bar beside the copyright.
 */

const COPYRIGHT_YEAR = 2026;

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Standards", href: "/standards" },
      { label: "Chain of Custody", href: "/chain-of-custody" },
      { label: "Who it is for", href: "/solutions" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Developers", href: "/developers" },
      { label: "Academy", href: "/academy" },
      { label: "FAQ", href: "/faq" },
      { label: "Status", href: "/status" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/trust" },
      { label: "Grievance channel", href: "/grievance" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie policy", href: "/cookies" },
      { label: "Acceptable use", href: "/acceptable-use" },
      { label: "Security disclosure", href: "/security-disclosure" },
    ],
  },
] as const;

export function SiteFooter() {
  const reduce = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE.outQuint },
    },
  } as const;

  return (
    <footer className="border-t border-line bg-surface-0">
      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: STAGGER.tight } } }}
        className="shell py-20 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-20">
          {/* Mark and positioning */}
          <motion.div variants={item}>
            <Link href="/" aria-label="FIQS — home" className="pressable inline-block">
              <Wordmark tone="light" className="h-6 w-auto" />
            </Link>
            <p className="mt-6 max-w-[32ch] text-[0.875rem] leading-relaxed text-mist">
              The digital operating system for responsible gold supply chains.
            </p>
          </motion.div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <motion.div key={col.title} variants={item}>
                <h2 className="type-label-sm mb-5 text-mist">{col.title}</h2>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="pressable text-[0.875rem] text-dust hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scope boundary — §1.3. */}
        <motion.p
          variants={item}
          className="mt-16 max-w-[76ch] border-t border-line pt-10 text-[0.8125rem] leading-relaxed text-mist"
        >
          FIQS supports responsible sourcing workflows and produces audit-ready
          records. Certification of gold and accreditation under any assurance
          scheme remain with the recognised bodies and their approved assessors.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-3 text-[0.8125rem] text-ash sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Registered entity, jurisdiction and address land here once §28
              confirms them.

              The year is a constant rather than `new Date().getFullYear()`:
              this is a client component, and computing it at render makes the
              server and client disagree across a new year, which is a
              hydration mismatch for the sake of a number that changes once. */}
          <span>© {COPYRIGHT_YEAR} FIQS. All rights reserved.</span>
          <Link
            href="/grievance"
            className="pressable text-mist hover:text-paper sm:text-right"
          >
            Raise a concern anonymously
          </Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}
