"use client";

import { motion, useReducedMotion } from "motion/react";

import { useCountUp } from "@/hooks/use-count-up";
import { EASE, STAGGER } from "@/lib/motion";
import { STATUS } from "@/lib/chart";
import {
  ATTENTION,
  COVERAGE,
  NAV,
  REVIEW_TOTAL,
  TILES,
} from "@/components/product/dashboard-data";
import {
  CoverageRing,
  MonthlyBars,
  ReviewTrend,
  SignOffGauge,
  StageDonut,
} from "@/components/product/charts";

/* ================================================================== */
/* Shared card                                                         */
/* ================================================================== */

function Card({
  children,
  className = "",
  delay = 0,
  title,
  meta,
  fill = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  title?: string;
  meta?: React.ReactNode;
  fill?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: EASE.outQuint, delay }}
      className={`flex flex-col rounded-[var(--radius-card)] bg-surface-2 p-6 ${className}`}
    >
      {(title || meta) && (
        <header className="mb-6 flex items-start justify-between gap-4">
          {title && <h3 className="type-label-sm text-mist">{title}</h3>}
          {meta}
        </header>
      )}
      {/* `fill` lets a plot claim whatever height the grid row hands the card,
          so a card stretched by a taller neighbour has no dead space under
          its chart. */}
      <div className={fill ? "min-h-0 flex-1" : undefined}>{children}</div>
    </motion.section>
  );
}

/* ================================================================== */
/* Sidebar                                                             */
/* ================================================================== */

/** Minimal glyphs — 1.5px strokes, matching the hairline weight elsewhere. */
function NavIcon({ name }: { name: string }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    grid: (
      <>
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </>
    ),
    user: (
      <>
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3 13.5a5 5 0 0 1 10 0" />
      </>
    ),
    shield: <path d="M8 1.8 13 4v4c0 3-2.2 5.4-5 6.2C5.2 13.4 3 11 3 8V4z" />,
    clock: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.6V8l2.3 1.6" />
      </>
    ),
    flag: (
      <>
        <path d="M3.8 14V2.6" />
        <path d="M3.8 3.2h7.6l-1.4 2.8 1.4 2.8H3.8" />
      </>
    ),
    layers: (
      <>
        <path d="M8 1.8 14 5 8 8.2 2 5z" />
        <path d="M2 8.6 8 11.8l6-3.2" />
        <path d="M2 12 8 15.2 14 12" />
      </>
    ),
    link: (
      <>
        <path d="M6.6 9.4a2.6 2.6 0 0 0 3.9.3l2-2a2.6 2.6 0 0 0-3.7-3.7l-1.1 1.1" />
        <path d="M9.4 6.6a2.6 2.6 0 0 0-3.9-.3l-2 2a2.6 2.6 0 0 0 3.7 3.7l1.1-1.1" />
      </>
    ),
    coin: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.8v6.4M6.3 6.4h2.6a1.3 1.3 0 0 1 0 2.6H6.9a1.3 1.3 0 0 0 0 2.6h2.8" />
      </>
    ),
    box: (
      <>
        <path d="M13.5 5.2v5.6L8 14 2.5 10.8V5.2L8 2z" />
        <path d="M2.5 5.2 8 8.4l5.5-3.2M8 8.4V14" />
      </>
    ),
    doc: (
      <>
        <path d="M9 1.8H4.4v12.4h7.2V4.4z" />
        <path d="M9 1.8v2.6h2.6M6.2 8h3.6M6.2 10.6h3.6" />
      </>
    ),
    archive: (
      <>
        <rect x="2" y="2.8" width="12" height="3" rx="0.8" />
        <path d="M3.2 5.8v6.6a.8.8 0 0 0 .8.8h8a.8.8 0 0 0 .8-.8V5.8M6.6 8.8h2.8" />
      </>
    ),
    settings: (
      <>
        <circle cx="8" cy="8" r="2.1" />
        <path d="M8 1.6v1.7M8 12.7v1.7M14.4 8h-1.7M3.3 8H1.6M12.5 3.5l-1.2 1.2M4.7 11.3l-1.2 1.2M12.5 12.5l-1.2-1.2M4.7 4.7 3.5 3.5" />
      </>
    ),
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

function Sidebar() {
  return (
    <aside className="hidden w-[15.5rem] shrink-0 flex-col border-r border-line bg-surface-0 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-[0.75rem] font-medium text-gold">
          AN
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.8125rem] font-medium text-paper">A. Nsimba</span>
          <span className="text-[0.6875rem] text-mist">Field operations</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-hidden px-3 pb-4">
        {NAV.map((section) => (
          <div key={section.group}>
            {/* Group headers carry a disclosure chevron, as in the product. */}
            <div className="mb-1.5 flex items-center gap-1.5 px-2">
              <span className="type-label-sm text-mist">{section.group}</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-mist"
                aria-hidden="true"
              >
                <path d="M6 3.5 10.5 8 6 12.5" />
              </svg>
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = "active" in item && item.active;
                return (
                  <li key={item.label}>
                    <span
                      className={`flex items-center gap-2.5 rounded-[var(--radius-small)] px-2 py-[0.4375rem] text-[0.8125rem] transition-colors duration-150 ease-[var(--ease-out-quint)] ${
                        active
                          ? "bg-surface-3 text-paper"
                          : "text-mist hover:bg-surface-2 hover:text-paper"
                      }`}
                    >
                      <span className={active ? "text-gold" : "text-mist"}>
                        <NavIcon name={item.icon} />
                      </span>
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Settings sits at the foot of the rail, away from the working nav. */}
      <div className="border-t border-line px-3 py-4">
        <span className="flex items-center gap-2.5 rounded-[var(--radius-small)] px-2 py-[0.4375rem] text-[0.8125rem] text-mist">
          <NavIcon name="settings" />
          Settings
        </span>
      </div>
    </aside>
  );
}

/* ================================================================== */
/* Card chrome — range pills and delta badges                          */
/* ================================================================== */

/** A date-range control, in one row above the plot it governs. */
function RangePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="pressable inline-flex items-center gap-1.5 rounded-[var(--radius-small)] border border-line bg-surface-3 px-2.5 py-1.5 text-[0.6875rem] text-mist hover:text-paper">
      <svg
        width="11"
        height="11"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="2.4" y="3.2" width="11.2" height="10.4" rx="1.2" />
        <path d="M2.4 6.4h11.2M5.6 2v2.4M10.4 2v2.4" />
      </svg>
      {children}
      <svg
        width="9"
        height="9"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3.5 6 8 10.5 12.5 6" />
      </svg>
    </span>
  );
}

/** Period-on-period change. Direction is stated in the arrow *and* the sign. */
function DeltaBadge({ value, up = true }: { value: string; up?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[var(--radius-small)] px-1.5 py-0.5 text-[0.6875rem] font-medium"
      style={{
        color: STATUS.verified,
        background: "rgba(47,158,104,0.14)",
      }}
    >
      {value}
      <span aria-hidden="true">{up ? "↗" : "↘"}</span>
    </span>
  );
}

/* ================================================================== */
/* Stat tile — a hero number needs no plot, so it gets none            */
/* ================================================================== */

function Tile({ item, index }: { item: (typeof TILES)[number]; index: number }) {
  const reduce = useReducedMotion();
  const shown = useCountUp(item.value, { duration: 1250, delay: 260 + index * 90 });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE.outQuint },
        },
      }}
      className="rounded-[var(--radius-card)] bg-surface-2 p-5"
    >
      <div className="type-label-sm mb-4 text-mist">{item.label}</div>
      <div className="mb-4 text-[2.25rem] font-medium leading-none tracking-[-0.04em] tabular-nums text-sand">
        {reduce ? item.value : shown}
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-[var(--radius-small)] bg-surface-3 px-2 py-1">
        {item.tone === "review" && (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: STATUS.review }}
          />
        )}
        <span
          className="text-[0.6875rem] font-medium"
          style={{ color: item.tone === "review" ? STATUS.review : undefined }}
        >
          {item.delta}
        </span>
        <span className="text-[0.6875rem] text-mist">{item.window}</span>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* Needs attention                                                     */
/* ================================================================== */

const STATE_LABEL = {
  verified: "Signed",
  review: "Open",
  breach: "Escalated",
} as const;

function Attention() {
  const reduce = useReducedMotion();

  return (
    <motion.ul
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
      className="flex flex-col"
    >
      {ATTENTION.map((row) => (
        <motion.li
          key={row.ref}
          variants={{
            hidden: { opacity: 0, x: -8 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.42, ease: EASE.outQuint },
            },
          }}
          className="flex items-start gap-3 border-b border-line-soft py-3 last:border-b-0"
        >
          {/* Status never travels alone — the dot always has a word beside it. */}
          <span
            aria-hidden="true"
            className="mt-[0.4375rem] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: STATUS[row.state] }}
          />
          <span className="min-w-0 flex-1">
            <span className="mb-1 flex flex-wrap items-center gap-x-2">
              <span className="type-mono text-mist">{row.ref}</span>
              <span
                className="text-[0.6875rem] font-medium"
                style={{ color: STATUS[row.state] }}
              >
                {STATE_LABEL[row.state]}
              </span>
            </span>
            <span className="block text-[0.8125rem] leading-snug text-paper">
              {row.what}
            </span>
            <span className="block text-[0.75rem] text-mist">{row.who}</span>
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* ================================================================== */
/* Dashboard                                                           */
/* ================================================================== */

/**
 * `compact` is the homepage treatment: the top two rows only, clamped and
 * faded out at the foot so the panel reads as a working application
 * continuing below rather than as a screenshot that ran out. The full
 * dashboard is more detail than a first-time visitor can absorb, and at full
 * height it dwarfs the copy above it.
 *
 * The demonstration-data marker moves to the head in compact mode. It is
 * required by §5.2, and the fade would swallow it at the foot.
 */
export function Dashboard({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface-1">
      {compact && (
        <div className="flex items-center gap-2 border-b border-line bg-surface-0 px-6 py-3">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-mist" />
          <span className="text-[0.6875rem] tracking-[0.06em] text-mist">
            Demonstration data · not a production record
          </span>
        </div>
      )}

      <div
        className={compact ? "flex max-h-[32rem] lg:max-h-[38rem]" : "flex"}
        style={
          compact
            ? {
                maskImage:
                  "linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)",
              }
            : undefined
        }
      >
        <Sidebar />

        <div className="min-w-0 flex-1 bg-surface-1 p-4 sm:p-6">
          {/* ---- Tiles ---- */}
          <motion.div
            initial={reduce ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-70px" }}
            variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
            className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4"
          >
            {TILES.map((t, i) => (
              <Tile key={t.label} item={t} index={i} />
            ))}
          </motion.div>

          {/* ---- Stage mix + coverage ---- */}
          <div className="mb-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
            <Card title="Custody events by stage" delay={0.05}>
              <StageDonut />
            </Card>

            <div className="grid gap-4">
              {COVERAGE.map((c, i) => (
                <Card key={c.label} delay={0.1 + i * 0.05}>
                  <CoverageRing item={c} delay={0.35 + i * 0.12} />
                </Card>
              ))}
            </div>
          </div>

          {/* ---- Sign-off gauge + monthly volume ---- */}
          {!compact && (
          <>
          <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
            <Card title="Lots with a complete signature set" delay={0.05}>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
                <SignOffGauge done={182} total={194} label="182 of 194 lots" />
                <ul className="flex flex-col gap-2.5">
                  <li className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ background: STATUS.verified }}
                    />
                    <span className="text-[0.8125rem] text-mist">Signed</span>
                    <span className="ml-auto text-[0.8125rem] tabular-nums text-paper">
                      182
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ background: STATUS.review }}
                    />
                    <span className="text-[0.8125rem] text-mist">Open</span>
                    <span className="ml-auto text-[0.8125rem] tabular-nums text-paper">
                      9
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ background: STATUS.breach }}
                    />
                    <span className="text-[0.8125rem] text-mist">Escalated</span>
                    <span className="ml-auto text-[0.8125rem] tabular-nums text-paper">
                      3
                    </span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card
              title="Custody events by month"
              delay={0.1}
              meta={<RangePill>Jan 2026 – Dec 2026</RangePill>}
            >
              <MonthlyBars />
            </Card>
          </div>

          {/* ---- Trend + attention ---- */}
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card
              title="Due diligence reviews closed"
              delay={0.05}
              fill
              meta={<RangePill>January 2026</RangePill>}
            >
              <div className="flex h-full flex-col">
                <div className="mb-5 flex shrink-0 items-center gap-3">
                  <span className="text-[2rem] font-medium leading-none tracking-[-0.04em] tabular-nums text-sand">
                    {REVIEW_TOTAL}
                  </span>
                  <DeltaBadge value="16.8%" />
                </div>
                <div className="min-h-0 flex-1">
                  <ReviewTrend />
                </div>
              </div>
            </Card>

            <Card
              title="Needs attention"
              delay={0.1}
              meta={
                <span className="text-[0.6875rem] text-mist">4 open items</span>
              }
            >
              <Attention />
            </Card>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Spec §5.2 — public figures must be real or plainly marked. In
          compact mode this sits at the head instead, above the fade. */}
      {!compact && (
      <div className="flex items-center gap-2 border-t border-line bg-surface-0 px-6 py-3">
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-mist" />
        <span className="text-[0.6875rem] tracking-[0.06em] text-mist">
          Demonstration data · not a production record
        </span>
      </div>
      )}
    </div>
  );
}
