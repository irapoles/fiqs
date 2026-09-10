"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* The bar earns its backdrop only once content has passed beneath it. */
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    /* Hold the page still behind the panel, and put the scrollbar's width
       back as padding so the layout underneath does not jump. */
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the panel so the keyboard follows the eye.
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE.outQuint, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
            lifted || open
              ? "border-line bg-graphite/72 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
            <Link href="/" aria-label="FIQS — home" className="pressable hitbox shrink-0">
              <Wordmark tone="light" className="h-[1.375rem] w-auto" />
            </Link>

            {/* Tighter between lg and xl. The inline nav appears at 1024,
                where its six labels plus the two pills come to 5px more than
                the bar can hold and "Chain of Custody" wraps to two lines;
                4px off each of the five gaps buys back 20px. Full gap returns
                at xl, where there is room for it. */}
            <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`pressable type-label-sm relative hover:text-paper ${
                    pathname === item.href ? "text-paper" : "text-mist"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              {/* Wrapped rather than given `hidden sm:inline-flex` directly:
                  the button's own base class already sets `inline-flex`, and
                  two unprefixed display utilities on one element are settled
                  by Tailwind's ordering rather than by the order they appear
                  in the attribute. That tie has already been lost once here.

                  Secondary, so the pair reads as one primary and one way in —
                  gold is the action colour and a second gold pill beside
                  "Book a demo" would leave the bar with two of them. */}
              <span className="hidden sm:inline-flex">
                <ButtonLink href="/sign-in" variant="secondary">
                  Sign in
                </ButtonLink>
              </span>
              <ButtonLink href="/demo" variant="primary">
                Book a demo
              </ButtonLink>

              {/* Menu toggle — below the breakpoint where the inline nav fits. */}
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="pressable hitbox -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-paper lg:hidden"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {open ? (
                    <path d="M5 5l10 10M15 5L5 15" />
                  ) : (
                    <path d="M3 6h14M3 10h14M3 14h14" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ---- Mobile menu ------------------------------------------------
          A sibling of <header>, never a child: the header sets
          `backdrop-filter` when lifted, which makes it the containing block
          for fixed descendants and collapses a nested panel to nothing.

          Conditionally rendered rather than animated out, so the links are
          genuinely gone from the tree when closed instead of lingering as
          invisible, focusable targets.
          ---------------------------------------------------------------- */}
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="menu-in fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-graphite lg:hidden"
        >
          <nav aria-label="Main" className="shell flex flex-col py-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`border-b border-line py-5 text-[1.375rem] font-medium tracking-[-0.02em] ${
                  pathname === item.href ? "text-gold" : "text-paper"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-10" onClick={() => setOpen(false)}>
              <ButtonLink href="/sign-in" variant="secondary" className="w-full">
                Sign in
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
