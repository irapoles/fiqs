"use client";

import { STATUS } from "@/lib/chart";

/**
 * Product screens for the operating sequence.
 *
 * One chrome, five bodies — the same rail, titlebar and control language the
 * dashboard uses, so the five steps read as five views of one system rather
 * than five illustrations. Everything is demonstration data and the frame
 * says so.
 *
 * These are deliberately static: they sit beside explanatory copy, a reader
 * looks at each for a couple of seconds, and animating them would compete
 * with the text for the same attention.
 */

const RAIL = [
  { group: "Legal", items: ["KYC & CDD", "Complaints", "KYC queue"] },
  {
    group: "Business",
    items: [
      "Suppliers",
      "Screening",
      "Transactions",
      "On-chain audit",
      "Inventory",
      "Audit packs",
    ],
  },
] as const;

function Chrome({
  title,
  actions,
  active,
  children,
}: {
  title: string;
  actions?: readonly string[];
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1">
      <div className="flex">
        {/* Mini rail */}
        <div className="hidden w-[8.5rem] shrink-0 flex-col border-r border-line bg-surface-0 py-3 sm:flex">
          <div className="mb-3 flex items-center gap-1.5 px-3">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-surface-3 text-[0.5rem] font-medium text-gold">
              AN
            </span>
            <span className="truncate text-[0.5625rem] text-mist">A. Nsimba</span>
          </div>
          {RAIL.map((section) => (
            <div key={section.group} className="mb-2.5">
              <div className="mb-1 px-3 text-[0.5rem] uppercase tracking-[0.14em] text-ash">
                {section.group}
              </div>
              {section.items.map((item) => (
                <div
                  key={item}
                  className={`mx-1.5 rounded-[3px] px-1.5 py-[0.1875rem] text-[0.5625rem] ${
                    item === active ? "bg-surface-3 text-paper" : "text-mist"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <span className="truncate text-[0.6875rem] font-medium text-paper">
              {title}
            </span>
            <span className="flex shrink-0 gap-1.5">
              {actions?.map((a, i) => (
                <span
                  key={a}
                  className={`rounded-[3px] px-2 py-1 text-[0.5625rem] ${
                    i === 0
                      ? "bg-gold text-graphite"
                      : "border border-line text-mist"
                  }`}
                >
                  {a}
                </span>
              ))}
            </span>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>

      <div className="border-t border-line bg-surface-0 px-4 py-1.5">
        <span className="text-[0.5625rem] tracking-[0.06em] text-ash">
          Demonstration data
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const label = "mb-1 block text-[0.5625rem] text-mist";
const field =
  "rounded-[4px] border border-line bg-surface-2 px-2 py-1.5 text-[0.5625rem] text-ash";

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
          <span className={label}>
            What are the requirements to mine legally in this country?
          </span>
          <div className={field}>Your answer here</div>
        </div>
        <div>
          <span className={label}>Is the operation subject to regulatory oversight?</span>
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
          <span className={label}>GPS coordinates of the mine</span>
          <div className="flex items-center justify-between gap-2">
            <div className={`${field} flex-1`}>−2.8841, 28.1975</div>
            <span className="shrink-0 rounded-[4px] border border-line px-2 py-1.5 text-[0.5625rem] text-mist">
              Attach files
            </span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function Evaluate() {
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
          <span key={h} className="text-[0.5rem] uppercase tracking-[0.14em] text-ash">
            {h}
          </span>
        ))}
      </div>
      <div className="flex flex-col">
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
      </div>
    </Chrome>
  );
}

function Trace() {
  const events = [
    { t: "09 Aug 07:14Z", e: "Extraction logged at pit face", h: "0x8f2a…c14d" },
    { t: "09 Aug 15:02Z", e: "Weighed and sealed at gate", h: "0x41bd…9e07" },
    { t: "11 Aug 09:38Z", e: "Assay certified — Au 4.21 g/t", h: "0xc077…b2a1" },
    { t: "14 Aug 06:12Z", e: "Refinery intake reconciled", h: "0x9a4c…d8b6" },
  ] as const;

  return (
    <Chrome title="Chain of custody — LOT-2891-KMB" actions={["Export pack"]} active="On-chain audit">
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

function Operate() {
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
            <span className="mb-1 block text-[0.5rem] uppercase tracking-[0.14em] text-ash">
              {s.k}
            </span>
            <span className="text-[0.75rem] font-medium tabular-nums text-sand">{s.v}</span>
          </div>
        ))}
      </div>
      <div className="mb-1.5 grid grid-cols-[0.8fr_1.2fr_0.7fr_0.7fr] gap-2 border-b border-line pb-1.5">
        {["Ref", "Counterparty", "Mass", "Value"].map((h) => (
          <span key={h} className="text-[0.5rem] uppercase tracking-[0.14em] text-ash">
            {h}
          </span>
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

function Report() {
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
      <div className="flex flex-col">
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
      </div>
    </Chrome>
  );
}

export const STEP_SCREENS: Record<string, () => React.ReactElement> = {
  Onboard,
  Evaluate,
  Trace,
  Operate,
  Report,
};
