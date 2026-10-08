"use client";

import { useMemo, useState } from "react";
import { featuredTeam, type RiderCategory } from "@/data/cyclists";
import CyclistCard from "./CyclistCard";

type Filter = "All" | RiderCategory;

const filters: Filter[] = ["All", "Climber", "Sprinter", "All-Rounder", "Time Trialist"];

export default function RosterSection() {
  const [active, setActive] = useState<Filter>("All");

  const riders = useMemo(
    () => (active === "All" ? featuredTeam : featuredTeam.filter((r) => r.category === active)),
    [active]
  );

  return (
    <section aria-labelledby="roster-heading" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-club-lime">Pro roster</p>
          <h2 id="roster-heading" className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Meet the riders
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-club-muted">
            Filter by specialty to explore the climbers, sprinters, and engines racing for Benediction.
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-club-muted" aria-live="polite">
          {riders.length} rider{riders.length === 1 ? "" : "s"}
        </p>
      </div>

      <div role="tablist" aria-label="Filter riders by category" className="mt-6 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const selected = active === filter;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-pressed={selected}
              onClick={() => setActive(filter)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                selected
                  ? "bg-club-lime text-club-bg"
                  : "bg-white/5 text-gray-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {riders.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {riders.map((cyclist) => (
            <CyclistCard key={cyclist.id} cyclist={cyclist} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-club-panel p-6 text-sm text-club-muted">
          No riders in this category yet. Check back after trials.
        </p>
      )}
    </section>
  );
}

