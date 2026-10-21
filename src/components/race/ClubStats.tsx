"use client";

import { useEffect, useRef, useState } from "react";
import type { ClubStat } from "@/data/races";
import { clubStats as fallbackStats } from "@/data/races";
import { useI18n } from "@/lib/i18n/LanguageProvider";

function CountUp({ target }: { target: number }) {
  const [value, setValue] = useState(1);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setValue(target));
      return;
    }
    const el = wrapRef.current;
    if (!el) { queueMicrotask(() => setValue(target)); return; }
    const duration = 1500;
    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(2, -10 * t);
        setValue(Math.round(1 + (target - 1) * eased));
        if (t < 1) { rafRef.current = requestAnimationFrame(step); }
        else { setValue(target); }
      };
      rafRef.current = requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((en) => { if (en.isIntersecting) { run(); obs.disconnect(); } }); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <span ref={wrapRef}>
      <span aria-hidden="true" className="font-display text-5xl font-extrabold text-brand-lime md:text-6xl">{value}</span>
      <span className="sr-only">{target}</span>
    </span>
  );
}

export default function ClubStats({ stats = fallbackStats }: { stats?: ClubStat[] }) {
  const { t } = useI18n();
  const items = stats.length ? stats : fallbackStats;
  function labelFor(stat: ClubStat) {
    if (stat.roster === "men") return t.race.winsMen;
    if (stat.roster === "women") return t.race.winsWomen;
    if (stat.roster === "junior") return t.race.winsJunior;
    return stat.label;
  }
  return (
    <section className="py-12 md:py-16">
      <div className="grid grid-cols-1 divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((stat) => (
          <div key={stat.roster ?? stat.label} className="flex flex-col items-center py-10 text-center">
            <CountUp target={stat.value} />
            <p className="mt-3 font-display text-lg font-semibold text-white md:text-xl">{labelFor(stat)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
