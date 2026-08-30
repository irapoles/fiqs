/**
 * Shared motion vocabulary.
 *
 * Two registers, deliberately kept apart:
 *
 *   MARKETING — explanatory motion on surfaces a visitor sees once or twice.
 *   Longer, more expressive, allowed to carry meaning over time.
 *
 *   PRODUCT — anything dressed as FIQS software. Crisp and fast, because it
 *   has to read as a tool someone uses all day, not a thing being performed
 *   at them. Stays inside the 150–250ms band.
 *
 * Every curve here is a custom cubic-bezier. The CSS built-ins lack the punch
 * that makes motion feel intentional, and `ease-in` never appears at all — a
 * slow start delays feedback at exactly the moment the eye is on the element.
 */

export const EASE = {
  /** Enter / exit. Fast off the mark, settles in. The default. */
  outQuint: [0.23, 1, 0.32, 1],
  /** Stronger exit for larger travel. */
  outExpo: [0.19, 1, 0.22, 1],
  outQuart: [0.165, 0.84, 0.44, 1],
  /** On-screen movement — accelerate, then brake. */
  inOutQuart: [0.77, 0, 0.175, 1],
  /** iOS-like drawer curve, via Ionic. */
  drawer: [0.32, 0.72, 0, 1],
} as const;

export const DURATION = {
  press: 0.16,
  tooltip: 0.18,
  dropdown: 0.22,
  panel: 0.28,
  /** Marketing only — explanatory sequences are allowed to breathe. */
  narrative: 0.9,
  ambient: 1.6,
} as const;

/** Stagger between siblings. Long delays make an interface feel slow. */
export const STAGGER = {
  tight: 0.035,
  normal: 0.055,
  loose: 0.08,
} as const;

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** Nothing in the real world appears from nothing — never scale from 0. */
export const riseIn = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: EASE.outQuint },
  },
} as const;

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE.outQuint },
  },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE.outQuint } },
} as const;

/** Parent orchestrator — children inherit the cascade. */
export const stagger = (delayChildren = 0, staggerChildren = STAGGER.normal) =>
  ({
    hidden: {},
    visible: {
      transition: { delayChildren, staggerChildren },
    },
  }) as const;

/** Apple's spring parameterisation — easier to reason about than mass/stiffness. */
export const SPRING = {
  /** Settles without overshoot. Safe for functional UI. */
  calm: { type: "spring", duration: 0.5, bounce: 0 },
  /** A touch of life. Drag, dismiss, playful affordances only. */
  lively: { type: "spring", duration: 0.55, bounce: 0.18 },
  /** Mouse-tracking interpolation. Decorative by definition. */
  pointer: { stiffness: 90, damping: 18, mass: 0.9 },
} as const;
