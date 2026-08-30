"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";

/** Sample a cubic-bezier at time t — Newton's method, good enough for a counter. */
function bezier([x1, y1, x2, y2]: readonly number[], t: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  let x = t;
  for (let i = 0; i < 5; i++) {
    const slope = (3 * ax * x + 2 * bx) * x + cx;
    if (Math.abs(slope) < 1e-6) break;
    x -= (((ax * x + bx) * x + cx) * x - t) / slope;
  }
  return ((ay * x + by) * x + cy) * x;
}

/**
 * Counts to `target` once, on mount. Spec §4.5 allows count-up on hero load —
 * "animate once, then stop", so there is no loop and no re-trigger.
 *
 * Runs on rAF rather than React state per frame where it can, but a counter is
 * cheap enough that a state write per frame stays well inside budget.
 */
export function useCountUp(target: number, { duration = 1400, delay = 0 } = {}) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    // Under reduced motion the effect does nothing at all — the final value is
    // derived at return instead. Writing state here would be a synchronous
    // setState inside an effect body, and a cascading render for no gain.
    if (reduce) return;

    let start: number | null = null;
    const startedAt = performance.now() + delay;

    const tick = (now: number) => {
      if (now < startedAt) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      if (start === null) start = now;

      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * bezier(EASE.outQuart, t)));

      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, delay, reduce]);

  return reduce ? target : value;
}
