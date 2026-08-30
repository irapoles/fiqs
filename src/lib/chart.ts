/**
 * Chart parameters for the FIQS product surfaces.
 *
 * ---------------------------------------------------------------------------
 * Why there is no categorical palette here
 * ---------------------------------------------------------------------------
 * The brand rations colour hard: graphite carries the page, gold points, and a
 * layout that reads gold-first is wrong. A conventional dashboard palette —
 * eight unrelated hues cycling through the series — would break that outright,
 * and it would also be the wrong encoding for this data.
 *
 * Every multi-series figure on these surfaces is *ordinal*, not nominal:
 * the custody chain runs Mine → Supplier → Purchase → Transport → Refining →
 * Sale, and reordering it would change the meaning. Ordinal data takes a single
 * hue in monotone lightness steps, so the reader sees the sequence in the
 * colour itself. One hue, six steps — which is exactly what the brand can
 * afford to spend.
 *
 * The ramp below was validated, not eyeballed, against the raised card surface
 * (#15171A) as an ordinal ramp:
 *
 *   Lightness monotone ....... PASS  steps read light→dark
 *   Adjacent ΔL .............. PASS  all gaps >= 0.06
 *   Light-end contrast ....... PASS  #5E4715 at 2.04:1 vs surface
 *   Single hue ............... PASS  hue spread 7°
 *
 * Reef Gold sits at step 3 unchanged; the steps around it were moved to open
 * the gaps, rather than moving the brand fixture itself.
 */

/** Custody-stage ramp. Index is the stage's position in the chain. */
export const STAGE_RAMP = [
  "#FFE49E", // Sand — Mine
  "#EDCC7A", // Supplier
  "#D9B24C", // Reef Gold — Purchase
  "#B08A33", // Transport
  "#856521", // Refining
  "#5E4715", // Sale
] as const;

export const STAGES = [
  "Mine",
  "Supplier",
  "Purchase",
  "Transport",
  "Refining",
  "Sale",
] as const;

export type Stage = (typeof STAGES)[number];

/**
 * Status colours are reserved. They never stand in for "series 4", and they
 * never appear without an icon or a word beside them.
 *
 * All three clear WCAG AA for text on the card surface:
 * verified 10.07:1 · review 11.03:1 · breach 7.40:1.
 */
export const STATUS = {
  verified: "#7FD3A6",
  review: "#F0C56B",
  breach: "#E88F7C",
} as const;

/**
 * Ink. Note that brand Ash (#6E747E) measures 3.82:1 on the card surface —
 * under AA's 4.5:1 for small text — so micro-labels take Mist instead and Ash
 * is held back for larger secondary text.
 */
export const INK = {
  primary: "#F7F7F5",
  secondary: "#A8AEB8",
  muted: "#6E747E",
  grid: "rgba(255,255,255,0.07)",
  axis: "rgba(255,255,255,0.14)",
} as const;

/** The surface a mark is drawn on — used for the 2px spacer between fills. */
export const SURFACE = "#15171A";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

/** Circumference of a ring, for stroke-dasharray draw-on animations. */
export function circumference(radius: number) {
  return 2 * Math.PI * radius;
}

/** Monotone-ish cubic through points — smooths a trend without overshooting. */
export function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}
