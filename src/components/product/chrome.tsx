"use client";

/**
 * Shared product chrome.
 *
 * One rail, one titlebar, one control language. Every mock product view on the
 * site renders inside this, so the marketing pages read as views of a single
 * system rather than as a set of unrelated illustrations — and so a change to
 * the product's furniture happens in one place.
 *
 * Every instance carries the "demonstration data" marker: spec §5.2 requires
 * any public figure to be real or plainly shown as non-production, and the
 * marker belongs to the frame rather than to each caller so it cannot be
 * forgotten.
 */

const RAIL = [
  { group: "Legal", items: ["KYC & CDD", "Complaints", "KYC queue"] },
  {
    group: "Business",
    items: [
      "Mine data",
      "Suppliers",
      "Site verification",
      "Screening",
      "Due diligence",
      "Chain of custody",
      "Grievance",
      "Transactions",
      "Inventory",
      "Audit packs",
    ],
  },
] as const;

export function Chrome({
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
    <div className="product-skin overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1">
      <div className="flex">
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
                    i === 0 ? "bg-gold text-graphite" : "border border-line text-mist"
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

/* Shared field furniture, so every mock form looks like the same product. */
export const fieldLabel = "mb-1 block text-[0.5625rem] text-mist";
export const fieldBox =
  "rounded-[4px] border border-line bg-surface-2 px-2 py-1.5 text-[0.5625rem] text-ash";
export const colHead = "text-[0.5rem] uppercase tracking-[0.14em] text-ash";
