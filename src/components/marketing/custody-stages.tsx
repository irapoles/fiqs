"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { STAGE_RAMP } from "@/lib/chart";
import { EASE } from "@/lib/motion";

/**
 * The six-stage custody workflow — spec §8.
 *
 * Selecting a stage reveals what that stage captures. Stage colour comes from
 * the validated ordinal ramp, the same one the dashboard charts use, so the
 * position in the chain is legible from the colour on both surfaces.
 *
 * Tab semantics are wired by hand rather than reached for from a library:
 * roving focus, arrow-key movement, and `aria-selected` on the tab rather
 * than the panel. §22 requires keyboard operation and no hover-only paths.
 */

const STAGES = [
  {
    id: "mine",
    title: "Mine",
    record: "Mine record, licence and GPS-verified site",
    evidence: "Licence, site photographs, production log",
    owner: "Site supervisor",
    risk: "Site-level risk rating",
  },
  {
    id: "supplier",
    title: "Supplier",
    record: "Supplier record with ownership and KYC",
    evidence: "KYC pack, ownership chain, screening result",
    owner: "Compliance officer",
    risk: "Counterparty screening state",
  },
  {
    id: "purchase",
    title: "Purchase",
    record: "Purchase transaction and settlement",
    evidence: "Purchase note, weight ticket, payment record",
    owner: "Buyer",
    risk: "Transaction threshold checks",
  },
  {
    id: "transport",
    title: "Transport",
    record: "Movement between custody holders",
    evidence: "Seal number, transport document, handover signature",
    owner: "Field agent",
    risk: "Chain-of-custody gap detection",
  },
  {
    id: "refining",
    title: "Refining",
    record: "Refinery intake and assay",
    evidence: "Assay certificate, intake reconciliation",
    owner: "Refinery intake desk",
    risk: "Mass balance variance",
  },
  {
    id: "sale",
    title: "Sale",
    record: "Sale transaction and final settlement",
    evidence: "Sale contract, export permit, settlement record",
    owner: "Finance",
    risk: "Export and sanctions checks",
  },
] as const;

export function CustodyStages() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const next =
      e.key === "ArrowRight" ? active + 1 : e.key === "ArrowLeft" ? active - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const wrapped = (next + STAGES.length) % STAGES.length;
    setActive(wrapped);
    document.getElementById(`stage-tab-${STAGES[wrapped].id}`)?.focus();
  };

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <div
        role="tablist"
        aria-label="Custody stages"
        onKeyDown={onKeyDown}
        className="relative mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
      >
        {STAGES.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              id={`stage-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="stage-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`pressable flex flex-col items-start gap-3 rounded-[var(--radius-card)] p-4 text-left transition-colors ${
                on ? "bg-surface-2" : "bg-surface-1 hover:bg-surface-2"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-1 w-full rounded-full"
                style={{
                  background: STAGE_RAMP[i],
                  opacity: on ? 1 : 0.35,
                }}
              />
              <span className={`text-[0.875rem] ${on ? "text-paper" : "text-mist"}`}>
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${stage.id}`}
        key={stage.id}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: EASE.outQuint }}
        className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { k: "Core record", v: stage.record },
          { k: "Required evidence", v: stage.evidence },
          { k: "Responsible", v: stage.owner },
          { k: "Risk state", v: stage.risk },
        ].map((cell) => (
          <div key={cell.k} className="bg-surface-2 p-6">
            <p className="type-label-sm mb-3 text-mist">{cell.k}</p>
            <p className="text-[0.9375rem] leading-relaxed text-paper">{cell.v}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
