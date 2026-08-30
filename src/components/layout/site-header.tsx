"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Wordmark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { EASE } from "@/lib/motion";

const NAV = [
  { label: "Platform", href: "/platform" },
  { label: "Standards", href: "/standards" },
  { label: "Chain of Custody", href: "/chain-of-custody" },
  { label: "Developers", href: "/developers" },
  { label: "Academy", href: "/academy" },
  { label: "Company", href: "/about" },
];

export function SiteHeader() {
  const [lifted, setLifted] = useState(false);
  const reduce = useReducedMotion();

  /* The bar earns its backdrop only once content has passed beneath it. */
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE.outQuint, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          lifted
            ? "border-line bg-graphite/72 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-8">
          <Link
            href="/"
            aria-label="FIQS — home"
            className="pressable hitbox shrink-0"
          >
            {/* 120px is the guide's digital minimum for the wordmark. */}
            <Wordmark tone="light" className="h-[1.375rem] w-auto" />
          </Link>

          {/* Uppercase and widely tracked — the nav reads as panel labelling,
              which is the same voice the section eyebrows speak in. */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="pressable type-label-sm relative text-mist hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-5">
            <Link
              href="/sign-in"
              className="pressable hitbox type-label-sm hidden text-mist hover:text-paper sm:block"
            >
              Sign in
            </Link>
            <ButtonLink href="/demo" variant="primary">
              Book a demo
            </ButtonLink>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
