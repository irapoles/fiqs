/**
 * Demonstration data for the product surface.
 *
 * Spec §5.3 / §28: no figure here is a claim. Nothing describes a real
 * customer, a real lot, or a real assessment outcome, and the panel carries a
 * visible marker saying so. Names match the custody ledger in the hero so the
 * two surfaces read as one system rather than two mockups.
 */

export const NAV = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", icon: "grid", active: true }],
  },
  {
    group: "Due diligence",
    items: [
      { label: "Supplier onboarding", icon: "user" },
      { label: "Sanctions screening", icon: "shield" },
      { label: "Risk reviews", icon: "clock" },
      { label: "Grievance cases", icon: "flag" },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Mine & site records", icon: "layers" },
      { label: "Chain of custody", icon: "link" },
      { label: "Transactions", icon: "coin" },
      { label: "Inventory", icon: "box" },
    ],
  },
  {
    group: "Evidence",
    items: [
      { label: "Audit packs", icon: "doc" },
      { label: "Retention", icon: "archive" },
    ],
  },
] as const;

export const TILES = [
  {
    label: "Suppliers onboarded",
    value: 29,
    delta: "+7",
    window: "past 24 hours",
    tone: "neutral",
  },
  {
    label: "Custody events",
    value: 142,
    delta: "+18",
    window: "past 24 hours",
    tone: "neutral",
  },
  {
    label: "Screening hits",
    value: 3,
    delta: "2 unreviewed",
    window: "requires action",
    tone: "review",
  },
  {
    label: "Documents expiring",
    value: 12,
    delta: "within 30 days",
    window: "past 24 hours",
    tone: "neutral",
  },
] as const;

/** Custody events by stage. Ordinal — the chain order is the meaning. */
export const STAGE_MIX = [
  { stage: "Mine", value: 412 },
  { stage: "Supplier", value: 388 },
  { stage: "Purchase", value: 205 },
  { stage: "Transport", value: 194 },
  { stage: "Refining", value: 128 },
  { stage: "Sale", value: 97 },
] as const;

/** Ratios, not scores. Each is a count over a count, and says which counts. */
export const COVERAGE = [
  {
    label: "Site records",
    done: 10,
    total: 10,
    caption: "Every active site has a current GPS-verified record.",
    tone: "verified",
  },
  {
    label: "Monthly reviews",
    done: 118,
    total: 132,
    caption: "Supplier reviews closed for the current period.",
    tone: "review",
  },
] as const;

/** Monthly custody events, split by stage. Index matches STAGES order. */
export const MONTHLY = [
  { month: "Jan", stages: [38, 34, 18, 16, 11, 8] },
  { month: "Feb", stages: [52, 46, 25, 22, 15, 11] },
  { month: "Mar", stages: [61, 55, 29, 27, 18, 13] },
  { month: "Apr", stages: [49, 44, 24, 21, 14, 10] },
  { month: "May", stages: [35, 31, 17, 15, 10, 7] },
  { month: "Jun", stages: [47, 42, 23, 20, 14, 10] },
  { month: "Jul", stages: [28, 25, 13, 12, 8, 6] },
  { month: "Aug", stages: [64, 58, 31, 28, 19, 14] },
  { month: "Sep", stages: [41, 37, 20, 18, 12, 9] },
  { month: "Oct", stages: [44, 39, 21, 19, 13, 9] },
  { month: "Nov", stages: [39, 35, 19, 17, 11, 8] },
  { month: "Dec", stages: [55, 49, 26, 24, 16, 12] },
] as const;

/** Due diligence reviews closed, by day. Single series. */
export const REVIEWS = [
  { day: 1, value: 4 },
  { day: 4, value: 11 },
  { day: 7, value: 34 },
  { day: 10, value: 22 },
  { day: 13, value: 58 },
  { day: 16, value: 96 },
  { day: 19, value: 104 },
  { day: 22, value: 92 },
  { day: 25, value: 141 },
  { day: 28, value: 118 },
  { day: 31, value: 97 },
] as const;

export const REVIEW_TOTAL = 257;

/** Items needing a person, not a number. Fills the panel the source left empty. */
export const ATTENTION = [
  {
    ref: "SUP-0412",
    what: "Sanctions screening hit — ownership match",
    who: "Awaiting senior approval",
    state: "breach",
  },
  {
    ref: "LOT-2903-KMB",
    what: "Assay certificate not attached",
    who: "Kamituga Coop 12",
    state: "review",
  },
  {
    ref: "SUP-0388",
    what: "Site visit record older than 12 months",
    who: "Field operations",
    state: "review",
  },
  {
    ref: "LOT-2891-KMB",
    what: "Custody chain closed and signed",
    who: "Kigali refinery",
    state: "verified",
  },
] as const;
