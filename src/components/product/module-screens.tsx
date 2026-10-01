"use client";

import { STATUS } from "@/lib/chart";
import { Chrome, colHead, fieldBox, fieldLabel } from "@/components/product/chrome";

/**
 * Product views for the ten platform modules (spec §6).
 *
 * All demonstration data. The five views that also appear in the homepage
 * sequence are defined here and re-exported, so a module and its homepage
 * counterpart can never drift apart.
 */

/* ---------------------------------------------------------------- */
/* 1 · Mine & exploration data                                       */
/* ---------------------------------------------------------------- */

function MineData() {
  const docs = [
    { name: "Drilling programme 2026-Q1", kind: "Technical", size: "18 holes" },
    { name: "Geological survey — Block 4", kind: "Survey", size: "44 pp" },
    { name: "Production record — August", kind: "Production", size: "Monthly" },
    { name: "Mining licence ML-4471", kind: "Licence", size: "Expires 2029" },
  ] as const;

  return (
    <Chrome title="Mine & exploration data" actions={["Upload"]} active="Mine data">
      <div className="mb-2 grid grid-cols-[1.6fr_0.8fr_0.8fr] gap-2 border-b border-line pb-1.5">
        {["Document", "Class", "Detail"].map((h) => (
          <span key={h} className={colHead}>{h}</span>
        ))}
      </div>
      {docs.map((d) => (
        <div
          key={d.name}
          className="grid grid-cols-[1.6fr_0.8fr_0.8fr] items-center gap-2 border-b border-line-soft py-2 last:border-b-0"
        >
          <span className="truncate text-[0.5625rem] text-paper">{d.name}</span>
          <span className="text-[0.5625rem] text-mist">{d.kind}</span>
          <span className="text-[0.5625rem] text-mist">{d.size}</span>
        </div>
      ))}
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 2 · Supplier & mine onboarding                                    */
/* ---------------------------------------------------------------- */

function Onboard() {
  return (
    <Chrome
      title="Supplier onboarding — Kamituga Coop 12"
      actions={["Save", "Export to PDF"]}
      active="KYC & CDD"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-line text-[0.5rem] text-mist">
          1
        </span>
        <span className="text-[0.625rem] font-medium text-paper">
          Legal &amp; licensing
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div>
          <span className={fieldLabel}>
            What are the requirements to mine legally in this country?
          </span>
          <div className={fieldBox}>Your answer here</div>
        </div>
        <div>
          <span className={fieldLabel}>
            Is the operation subject to regulatory oversight?
          </span>
          <div className="flex gap-1.5">
            <span className="rounded-[4px] bg-gold px-2.5 py-1 text-[0.5625rem] font-medium text-graphite">
              Yes
            </span>
            <span className="rounded-[4px] border border-line px-2.5 py-1 text-[0.5625rem] text-mist">
              No
            </span>
            <span className="rounded-[4px] border border-line px-2.5 py-1 text-[0.5625rem] text-mist">
              Unknown
            </span>
          </div>
        </div>
        <div>
          <span className={fieldLabel}>Supporting documents</span>
          <div className="flex items-center justify-between gap-2">
            <div className={`${fieldBox} flex-1`}>3 files attached</div>
            <span className="shrink-0 rounded-[4px] border border-line px-2 py-1.5 text-[0.5625rem] text-mist">
              Attach files
            </span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 3 · GPS site verification                                         */
/* ---------------------------------------------------------------- */

function SiteVerification() {
  return (
    <Chrome title="Site verification — ML-4471" actions={["Verify"]} active="Site verification">
      {/* A coordinate plot, not a map tile: no third-party map service is
          contracted, and a decorative fake map would misrepresent a control. */}
      <div className="relative mb-3 h-[7.5rem] overflow-hidden rounded-[4px] border border-line bg-surface-2">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "1.5rem 1.5rem",
          }}
        />
        <span
          aria-hidden="true"
          className="absolute left-[38%] top-[46%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        />
        <span
          aria-hidden="true"
          className="absolute left-[38%] top-[46%] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(217,178,76,0.35)]"
        />
        <span className="absolute bottom-2 left-2.5 type-mono text-[0.5rem] text-mist">
          −2.8841, 28.1975
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          { k: "Coordinates captured on site", ok: true },
          { k: "Within licensed boundary", ok: true },
          { k: "Photograph matches record", ok: false },
        ].map((r) => (
          <div key={r.k} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: r.ok ? STATUS.verified : STATUS.review }}
            />
            <span className="flex-1 text-[0.5625rem] text-paper">{r.k}</span>
            <span
              className="text-[0.5625rem]"
              style={{ color: r.ok ? STATUS.verified : STATUS.review }}
            >
              {r.ok ? "Confirmed" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 4 · Sanctions & risk screening                                    */
/* ---------------------------------------------------------------- */

function Screening() {
  const rows = [
    { name: "Kamituga Coop 12", check: "Sanctions · ownership", state: "verified", note: "No match" },
    { name: "Bukavu Trading SARL", check: "Sanctions · ownership", state: "breach", note: "Match — review" },
    { name: "Uvira Minerals Ltd", check: "PEP screening", state: "review", note: "Pending" },
    { name: "Kigali Refinery", check: "Adverse media", state: "verified", note: "No match" },
  ] as const;

  return (
    <Chrome title="Sanctions & risk screening" actions={["Run screening"]} active="Screening">
      <div className="mb-2 grid grid-cols-[1.3fr_1fr_0.9fr] gap-2 border-b border-line pb-1.5">
        {["Counterparty", "Check", "Result"].map((h) => (
          <span key={h} className={colHead}>{h}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          className="grid grid-cols-[1.3fr_1fr_0.9fr] items-center gap-2 border-b border-line-soft py-2 last:border-b-0"
        >
          <span className="truncate text-[0.5625rem] text-paper">{r.name}</span>
          <span className="truncate text-[0.5625rem] text-mist">{r.check}</span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: STATUS[r.state] }}
            />
            <span className="text-[0.5625rem]" style={{ color: STATUS[r.state] }}>
              {r.note}
            </span>
          </span>
        </div>
      ))}
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 5 · Due diligence workflow                                        */
/* ---------------------------------------------------------------- */

/**
 * Every item on this checklist is a risk being screened *for*, so a tick was
 * saying the opposite of what was meant: it read as "child labour — done".
 * The mark is now an X, which reads as "looked for, not found", and the
 * legend states that outright rather than trusting the glyph to carry it.
 *
 * "Human rights" became "Human rights abuses" for the same reason — as a bare
 * category it is the one label on the list that could be read as a thing you
 * want to find.
 *
 * The counter says "screened" rather than "complete": five returned a result,
 * the sixth is still open, and "complete" invited the reader to total the
 * ticks as progress.
 */
function DueDiligence() {
  const checks = [
    "Child labour",
    "Forced labour",
    "Human rights abuses",
    "Bribery & corruption",
    "Sanctions exposure",
    "Chain-of-custody gaps",
  ] as const;

  return (
    <Chrome title="Monthly review — August 2026" actions={["Submit"]} active="Due diligence">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[0.625rem] font-medium text-paper">Control checklist</span>
        <span className="text-[0.5625rem] text-mist">5 of 6 screened</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {checks.map((c, i) => {
          const screened = i < 5;
          return (
            <div key={c} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border"
                style={{
                  borderColor: screened ? STATUS.verified : "rgba(255,255,255,0.18)",
                  background: screened ? "rgba(20,202,116,0.18)" : "transparent",
                }}
              >
                {screened && (
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke={STATUS.verified} strokeWidth="1.6" strokeLinecap="round">
                    <path d="M2 2 6 6M6 2 2 6" />
                  </svg>
                )}
              </span>
              <span className="truncate text-[0.5625rem] text-paper">{c}</span>
            </div>
          );
        })}
      </div>

      {/* The legend is not optional decoration. An X is only unambiguous once
          something on screen says which way round it reads. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-2">
        <span className="flex items-center gap-1.5">
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke={STATUS.verified} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M2 2 6 6M6 2 2 6" />
          </svg>
          <span className="text-[0.5rem] text-mist">Not identified in this demonstration</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-[7px] w-[7px] rounded-[2px] border border-[rgba(255,255,255,0.18)]"
          />
          <span className="text-[0.5rem] text-mist">Not yet screened</span>
        </span>
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 6 · OECD-aligned controls                                         */
/* ---------------------------------------------------------------- */

function OecdControls() {
  const steps = [
    { n: "Step 1", k: "Management systems", state: "verified" },
    { n: "Step 2", k: "Identify and assess risk", state: "verified" },
    { n: "Step 3", k: "Strategy to respond to risk", state: "verified" },
    { n: "Step 4", k: "Third-party audit", state: "review" },
    { n: "Step 5", k: "Public reporting", state: "review" },
  ] as const;

  return (
    <Chrome title="Five-step framework" actions={["Export evidence"]} active="Due diligence">
      <div className="flex flex-col gap-1.5">
        {steps.map((s) => (
          <div
            key={s.n}
            className="flex items-center gap-2.5 rounded-[4px] border border-line bg-surface-2 px-2.5 py-2"
          >
            <span className="type-mono shrink-0 text-[0.5rem] text-ash">{s.n}</span>
            <span className="min-w-0 flex-1 truncate text-[0.5625rem] text-paper">{s.k}</span>
            <span
              className="shrink-0 rounded-[3px] px-1.5 py-0.5 text-[0.5rem]"
              style={{
                color: STATUS[s.state],
                background:
                  s.state === "verified" ? "rgba(47,158,104,0.14)" : "rgba(224,163,46,0.14)",
              }}
            >
              {s.state === "verified" ? "Evidenced" : "In progress"}
            </span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 7 · Blockchain chain of custody                                   */
/* ---------------------------------------------------------------- */

function Custody() {
  const events = [
    { t: "09 Aug 07:14Z", e: "Extraction logged at pit face", h: "0x8f2a…c14d" },
    { t: "09 Aug 15:02Z", e: "Weighed and sealed at gate", h: "0x41bd…9e07" },
    { t: "11 Aug 09:38Z", e: "Assay certified — Au 4.21 g/t", h: "0xc077…b2a1" },
    { t: "14 Aug 06:12Z", e: "Refinery intake reconciled", h: "0x9a4c…d8b6" },
  ] as const;

  return (
    <Chrome
      title="Chain of custody — LOT-2891-KMB"
      actions={["Export pack"]}
      active="Chain of custody"
    >
      <div className="relative flex flex-col gap-3.5 pl-4">
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 left-[0.1875rem] top-1.5 w-px bg-line-strong"
        />
        {events.map((ev) => (
          <div key={ev.h} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-4 top-1 h-[0.4375rem] w-[0.4375rem] rounded-full bg-gold"
            />
            <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
              <span className="text-[0.5625rem] tabular-nums text-mist">{ev.t}</span>
              <span className="type-mono text-[0.5rem] text-ash">{ev.h}</span>
            </div>
            <span className="block text-[0.625rem] text-paper">{ev.e}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 8 · Grievance, escalation & sign-off                              */
/* ---------------------------------------------------------------- */

function Grievance() {
  const flow = [
    { k: "Concern received", who: "Anonymous", done: true },
    { k: "Assigned to officer", who: "A. Nsimba", done: true },
    { k: "Investigation", who: "Field operations", done: true },
    { k: "Senior approval", who: "Awaiting", done: false },
    { k: "Action plan retained", who: "—", done: false },
  ] as const;

  return (
    <Chrome title="Case GRV-0117" actions={["Add note"]} active="Grievance">
      <div className="mb-3 flex items-center justify-between rounded-[4px] bg-surface-2 px-2.5 py-2">
        <span className="type-mono text-[0.5rem] text-mist">Reference GRV-0117</span>
        <span className="text-[0.5625rem]" style={{ color: STATUS.review }}>
          Open · 6 days
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {flow.map((s) => (
          <div key={s.k} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: s.done ? STATUS.verified : "rgba(255,255,255,0.2)" }}
            />
            <span className="min-w-0 flex-1 truncate text-[0.5625rem] text-paper">{s.k}</span>
            <span className="shrink-0 text-[0.5625rem] text-mist">{s.who}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 9 · Transactions & financial controls                             */
/* ---------------------------------------------------------------- */

function Transactions() {
  const rows = [
    { ref: "PUR-4471", party: "Kamituga Coop 12", amt: "312.4 g", val: "$21,480" },
    { ref: "PUR-4472", party: "Uvira Minerals", amt: "188.0 g", val: "$12,930" },
    { ref: "SAL-2210", party: "Kigali Refinery", amt: "480.2 g", val: "$33,010" },
  ] as const;

  return (
    <Chrome title="Transactions & inventory" actions={["New purchase"]} active="Transactions">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { k: "Purchased (30d)", v: "1.94 kg" },
          { k: "In inventory", v: "612 g" },
          { k: "Settled", v: "$67,420" },
        ].map((s) => (
          <div key={s.k} className="rounded-[4px] bg-surface-2 px-2.5 py-2">
            <span className={`${colHead} mb-1 block`}>{s.k}</span>
            <span className="text-[0.75rem] font-medium tabular-nums text-sand">{s.v}</span>
          </div>
        ))}
      </div>
      <div className="mb-1.5 grid grid-cols-[0.8fr_1.2fr_0.7fr_0.7fr] gap-2 border-b border-line pb-1.5">
        {["Ref", "Counterparty", "Mass", "Value"].map((h) => (
          <span key={h} className={colHead}>{h}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div
          key={r.ref}
          className="grid grid-cols-[0.8fr_1.2fr_0.7fr_0.7fr] gap-2 border-b border-line-soft py-1.5 last:border-b-0"
        >
          <span className="type-mono text-[0.5rem] text-mist">{r.ref}</span>
          <span className="truncate text-[0.5625rem] text-paper">{r.party}</span>
          <span className="text-[0.5625rem] tabular-nums text-mist">{r.amt}</span>
          <span className="text-[0.5625rem] tabular-nums text-paper">{r.val}</span>
        </div>
      ))}
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */
/* 10 · Reporting & audit packs                                      */
/* ---------------------------------------------------------------- */

function AuditPacks() {
  const contents = [
    { k: "Supplier due diligence files", n: "38 documents", ok: true },
    { k: "Monthly review records", n: "12 periods", ok: true },
    { k: "Custody events with signatures", n: "1,204 events", ok: true },
    { k: "Assay certificates", n: "2 outstanding", ok: false },
  ] as const;

  return (
    <Chrome title="Audit pack — Jan–Dec 2026" actions={["Generate", "Preview"]} active="Audit packs">
      <div className="mb-3 flex items-center justify-between rounded-[4px] bg-surface-2 px-2.5 py-2">
        <span className="text-[0.5625rem] text-mist">Retention</span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: STATUS.verified }}
          />
          <span className="text-[0.5625rem]" style={{ color: STATUS.verified }}>
            Enforced
          </span>
        </span>
      </div>
      {contents.map((c) => (
        <div
          key={c.k}
          className="flex items-center gap-2 border-b border-line-soft py-2 last:border-b-0"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: c.ok ? STATUS.verified : STATUS.review }}
          />
          <span className="min-w-0 flex-1 truncate text-[0.5625rem] text-paper">{c.k}</span>
          <span
            className="shrink-0 text-[0.5625rem]"
            style={{ color: c.ok ? undefined : STATUS.review }}
          >
            {c.n}
          </span>
        </div>
      ))}
    </Chrome>
  );
}

/* ---------------------------------------------------------------- */

export const MODULE_SCREENS = {
  "mine-data": MineData,
  onboarding: Onboard,
  "site-verification": SiteVerification,
  screening: Screening,
  "due-diligence": DueDiligence,
  "oecd-controls": OecdControls,
  "chain-of-custody": Custody,
  grievance: Grievance,
  transactions: Transactions,
  "audit-packs": AuditPacks,
} as const;

/** The five the homepage sequence also uses — one definition, two surfaces. */
export const STEP_SCREENS: Record<string, () => React.ReactElement> = {
  Onboard,
  Evaluate: Screening,
  Trace: Custody,
  Operate: Transactions,
  Report: AuditPacks,
};
