"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const parse = (value: string) => value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);

/**
 * Animated number counter. Accepts strings like "40+", "250+", "8" —
 * animates the numeric part and preserves any prefix/suffix.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const match = parse(value);
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";
  const target = match ? parseFloat(match[2]) : 0;
  const isInt = Number.isInteger(target);

  // Start from the target so it's correct even if JS/animation is skipped.
  const [display, setDisplay] = useState(() =>
    match ? (isInt ? String(target) : target.toFixed(1)) : value
  );

  // Deps intentionally limited to [inView, value] so the RAF loop is NOT
  // restarted on every setDisplay re-render (which would freeze the count).
  useEffect(() => {
    const m = parse(value);
    if (!m) {
      setDisplay(value);
      return;
    }
    const to = parseFloat(m[2]);
    const int = Number.isInteger(to);
    if (!inView) {
      setDisplay("0");
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = to * eased;
      setDisplay(int ? Math.round(current).toString() : current.toFixed(1));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
