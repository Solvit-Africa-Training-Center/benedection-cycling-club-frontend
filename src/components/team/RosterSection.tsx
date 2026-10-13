"use client";

import { useMemo, useState } from "react";
import { cyclists, type RiderCategory } from "@/data/cyclists";
import CyclistCard from "./CyclistCard";

type FilterKey = "all" | RiderCategory;

export default function RosterSection() {
  const [active, setActive] = useState<FilterKey>("all");

  const allCount = cyclists.length;
  const menCount = useMemo(() => cyclists.filter((r) => r.category === "men").length, []);
  const womenCount = useMemo(
    () => cyclists.filter((r) => r.category === "women").length,
    []
  );
  const juniorCount = useMemo(
    () => cyclists.filter((r) => r.category === "junior").length,
    []
  );

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: `All Personnel (${allCount})` },
    { key: "men", label: `UCI Continental Men (${menCount})` },
    { key: "women", label: `Women's Development Team (${womenCount})` },
    { key: "junior", label: `Junior Squad [Kids] (${juniorCount})` },
  ];

  const riders = useMemo(
    () => (active === "all" ? cyclists : cyclists.filter((r) => r.category === active)),
    [active]
  );

  return (
    <section aria-labelledby="roster-heading" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div
        role="tablist"
        aria-label="Filter personnel by squad"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const selected = active === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(filter.key)}
              className={`rounded-sm px-4 py-2 font-sans text-xs font-bold uppercase tracking-wide transition-colors ${
                selected
                  ? "bg-brand-lime text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <h2
        id="roster-heading"
        className="mt-10 font-display text-3xl font-bold uppercase text-white md:text-4xl"
      >
        First Team &amp; Academy Cyclists
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {riders.map((rider) => (
          <CyclistCard key={rider.slug} cyclist={rider} />
        ))}
      </div>
    </section>
  );
}
