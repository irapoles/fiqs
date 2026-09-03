"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { MODULE_SCREENS } from "@/components/product/module-screens";
import { MODULES } from "@/content/platform-modules";

/**
 * The ten platform modules — spec §6.
 *
 * Sticky module navigation on desktop, a horizontal scroller on mobile. Every
 * module has a stable anchor (§24 asks for stable anchor URLs for the product
 * modules) so a section can be linked to directly.
 *
 * The active item is tracked with a single IntersectionObserver over all ten
 * sections rather than a scroll handler: no per-frame work on the main thread,
 * and no measurement that a scroll container above could invalidate.
 */

export function PlatformModules() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(MODULES[0].id);
  const sections = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const nodes = [...sections.current.values()];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the reading band, so passing a
        // short section does not leave the previous one highlighted.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="shell grid gap-12 pb-[var(--spacing-section)] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
      {/* ---- Module navigation ---- */}
      <nav
        aria-label="Platform modules"
        className="min-w-0 lg:sticky lg:top-28 lg:self-start"
      >
        <h2 className="type-label-sm mb-5 text-mist">Modules</h2>

        {/* Desktop: a list. Mobile: the same list turned into a scroller, so
            the nav never eats the screen on a phone. */}
        <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
          {MODULES.map((m, i) => {
            const on = active === m.id;
            return (
              <li key={m.id} className="shrink-0 lg:shrink">
                <a
                  href={`#${m.id}`}
                  aria-current={on ? "true" : undefined}
                  className={`pressable flex items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-small)] px-3 py-2 text-[0.8125rem] lg:whitespace-normal ${
                    on
                      ? "bg-surface-2 text-paper"
                      : "text-mist hover:bg-surface-2 hover:text-paper"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`type-mono text-[0.625rem] ${on ? "text-gold" : "text-ash"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---- Module sections ---- */}
      <div className="flex min-w-0 flex-col gap-20 lg:gap-28">
        {MODULES.map((m) => {
          const Screen = MODULE_SCREENS[m.id];
          return (
            <motion.section
              key={m.id}
              id={m.id}
              ref={(el) => {
                if (el) sections.current.set(m.id, el);
                else sections.current.delete(m.id);
              }}
              /* Anchored sections clear the fixed header when linked to. */
              className="scroll-mt-28"
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: EASE.outQuint }}
            >
              <h3 className="type-subhead mb-4 text-paper">{m.title}</h3>
              <p
                className="mb-8 max-w-[52ch] text-[0.9375rem] leading-relaxed text-mist"
                style={{ textWrap: "pretty" }}
              >
                {m.body}
              </p>
              <Screen />
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
