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
 * Sale, and reordering it would change the meaning. Ordinal data takes a
 * continuous ramp in monotone lightness steps, so the reader sees the sequence
 * in the colour itself rather than having to consult the legend for order.
 *
 * ---------------------------------------------------------------------------
 * Why these particular colours
 * ---------------------------------------------------------------------------
 * The ramp runs between two hues the FIQS application already ships — #00C2FF
 * and #CB3CFF — so the marketing figures and the product agree. The four steps
 * between them were interpolated in OKLab with lightness forced monotone, not
 * picked by eye, then measured against the product's card surface (#111114):
 *
 *   0  #00C2FF  9.12:1   L* 0.762
 *   1  #69AEFF  8.17:1   L* 0.740
 *   2  #8E99FF  7.32:1   L* 0.718
 *   3  #A881FF  6.51:1   L* 0.696
 *   4  #BB64FF  5.73:1   L* 0.672
 *   5  #CB3CFF  5.05:1   L* 0.650
 *
 *   Lightness monotone ....... PASS  strictly decreasing
 *   Adjacent ΔL* ............. PASS  every gap 0.022, evenly spaced
 *   Mark contrast ............ PASS  weakest step 5.05:1, floor is 3:1
 *
 * The product's own blues are deliberately *not* used as marks: #0E43FB
 * measures 2.89:1 on that surface and #0038FF 2.70:1, both under the 3:1
 * floor for a non-text graphic. Steps 1–3 above sit in the same blue-violet
 * band and clear it.
 */

/** Custody-stage ramp. Index is the stage's position in the chain. */
export const STAGE_RAMP = [
  "#00C2FF", // Mine
  "#69AEFF", // Supplier
  "#8E99FF", // Purchase
  "#A881FF", // Transport
  "#BB64FF", // Refining
  "#CB3CFF", // Sale
] as const;

/**
 * Single-series accent — a lone trend line or gauge, where there is no order
 * to encode and the ramp would be meaningless. The ramp's brightest end, so a
 * one-series plot reads as the same family as a six-series one. 9.12:1 on the
 * product card.
 */
export const ACCENT = "#00C2FF";

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
 * `verified` is the product's own green. `review` and `breach` are not: the
 * application ships no amber and no red, and borrowing a violet from the ramp
 * to mean "escalated" would say nothing to a reader — a warning state has to
 * look like one. These two stay on the semantic hues.
 *
 * All three clear WCAG AA for text on the product card (#111114):
 * verified 8.73:1 · review 11.66:1 · breach 7.82:1.
 */
export const STATUS = {
  verified: "#14CA74",
  review: "#F0C56B",
  breach: "#E88F7C",
} as const;

/**
 * Ink, from the product. Its greys measure better on its own card than the
 * brand's do on ours: #7E89AC is 5.44:1 against #111114, where brand Ash was
 * 3.82:1 and under AA's 4.5:1 for small text.
 *
 * Grid and axis are tinted with the ink rather than plain white, which is what
 * gives the product's plots their slightly cool cast.
 */
export const INK = {
  primary: "#FAFAFA",
  secondary: "#AEB9E1",
  muted: "#7E89AC",
  grid: "rgba(174,185,225,0.10)",
  axis: "rgba(174,185,225,0.20)",
} as const;

/** The surface a mark is drawn on — used for the 2px spacer between fills. */
export const SURFACE = "#111114";

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
