"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { FAQS } from "@/content/faqs";

/**
 * FAQ with search — spec §16.
 *
 * Uses native <details>/<summary>, so it is keyboard-operable, expandable
 * before hydration and findable by in-page browser search without any of the
 * disclosure logic being ours to get wrong.
 *
 * Filtering is client-side over eight seeded entries; when the set grows past
 * what is sensible to ship to the browser, this becomes a server search
 * without the markup changing.
 */
export function FaqList() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <div className="mb-10 max-w-[32rem]">
        <label htmlFor="faq-search" className="type-label-sm mb-3 block text-mist">
          Search
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Certification, blockchain, data access…"
          className="w-full rounded-[var(--radius-small)] border border-line bg-surface-2 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-ash focus:border-[rgba(255,255,255,0.28)] focus:outline-none"
        />
      </div>

      <p aria-live="polite" className="mb-6 text-[0.8125rem] text-mist">
        {results.length} {results.length === 1 ? "question" : "questions"}
      </p>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE.outQuint }}
        className="border-t border-line"
      >
        {results.map((f) => (
          <details key={f.id} id={f.id} className="group scroll-mt-28 border-b border-line">
            <summary className="pressable flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[1.0625rem] font-medium text-paper marker:hidden">
              {f.q}
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-mist transition-transform duration-200 ease-[var(--ease-out-quint)] group-open:rotate-45"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 3.2v9.6M3.2 8h9.6" />
                </svg>
              </span>
            </summary>
            <p className="max-w-[68ch] pb-7 text-[0.9375rem] leading-relaxed text-mist">
              {f.a}
            </p>
          </details>
        ))}

        {!results.length && (
          <p className="py-10 text-[0.9375rem] text-mist">
            Nothing matches that. The demo session is a working one — bring the
            question.
          </p>
        )}
      </motion.div>
    </section>
  );
}
