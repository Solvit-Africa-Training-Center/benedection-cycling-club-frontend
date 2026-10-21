"use client";

import { useEffect, useState } from "react";
import { getRaceStatus, todayInKigali, type Race } from "@/data/races";
import { useI18n } from "@/lib/i18n/LanguageProvider";

function fmt(s: string, e: string | undefined, months: string[]): string {
  const a = s.split("-").map(Number);
  if (!e) return `${months[a[1] - 1]} ${a[2]}, ${a[0]}`;
  const b = e.split("-").map(Number);
  if (a[0] === b[0]) return `${months[a[1] - 1]} ${a[2]} \u2013 ${months[b[1] - 1]} ${b[2]}, ${a[0]}`;
  return `${months[a[1] - 1]} ${a[2]}, ${a[0]} \u2013 ${months[b[1] - 1]} ${b[2]}, ${b[0]}`;
}

function monthIndex(race: Race): number | null {
  if (!race.startDate || race.startDate.length < 7) return null;
  const month = Number(race.startDate.slice(5, 7));
  return month >= 1 && month <= 12 ? month : null;
}

function yearOf(race: Race): string {
  if (race.startDate && race.startDate.length >= 4) return race.startDate.slice(0, 4);
  return race.seasonYear ? String(race.seasonYear) : "";
}

function sortKey(race: Race): string {
  if (race.startDate) return race.startDate;
  if (race.seasonYear) return `${race.seasonYear}-12-31`;
  return "9999-12-31";
}

export default function UpcomingRaces({ races, todayIso }: { races: Race[]; todayIso: string }) {
  const { t, languages } = useI18n();
  const months = t.months;
  const cats = languages.labels.cyclist_category;
  const [today, setToday] = useState(todayIso);
  useEffect(() => {
    const id = todayInKigali();
    queueMicrotask(() => setToday(id));
  }, []);
  const [team, setTeam] = useState("all");
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState("all");
  const monthOptions: number[] = [];
  races.forEach((r) => {
    const m = monthIndex(r);
    if (m && !monthOptions.includes(m)) monthOptions.push(m);
  });
  monthOptions.sort((a, b) => a - b);
  const years: string[] = [];
  races.forEach((r) => {
    const y = yearOf(r);
    if (y && !years.includes(y)) years.push(y);
  });
  years.sort();
  const filtered = races.filter((r) => {
    if (team !== "all" && r.team !== team && r.team !== "all") return false;
    const m = monthIndex(r);
    if (month !== "all" && (m === null || String(m) !== month)) return false;
    if (year !== "all" && yearOf(r) !== year) return false;
    return true;
  });
  const ord = { ongoing: 0, upcoming: 1, season: 2, completed: 3 };
  const sorted = filtered.slice().sort((a, b) => {
    const sa = getRaceStatus(a, today);
    const sb = getRaceStatus(b, today);
    if (sa !== sb) return ord[sa] - ord[sb];
    const ka = sortKey(a);
    const kb = sortKey(b);
    if (sa === "completed") return ka < kb ? 1 : ka > kb ? -1 : 0;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  const sc =
    "appearance-none rounded-sm border border-white/20 bg-brand-navy px-4 py-2.5 pr-10 text-sm text-white outline-none hover:border-white/40 focus:ring-2 focus:ring-brand-lime focus:ring-offset-2 focus:ring-offset-brand-navy";
  const teamOptions = [
    { v: "all", l: t.race.allTeams },
    { v: "men", l: cats.men ?? "Men" },
    { v: "women", l: cats.women ?? "Women" },
    { v: "junior", l: cats.kids ?? "Junior" },
  ];

  function when(race: Race): string {
    if (!race.startDate) {
      return race.seasonYear ? `${race.seasonYear} ${t.race.seasonOf}` : t.race.dateTbc;
    }
    return fmt(race.startDate, race.endDate, months);
  }

  return (
    <section className="py-12 md:py-16">
      <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
        {t.race.upcoming}
      </h2>
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <label className="sr-only" htmlFor="filter-team">
            {t.race.filterTeam}
          </label>
          <select id="filter-team" value={team} onChange={(e) => setTeam(e.target.value)} className={sc}>
            {teamOptions.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {opt.l}
              </option>
            ))}
          </select>
          <Chev className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <label className="sr-only" htmlFor="filter-month">
            {t.race.filterMonth}
          </label>
          <select id="filter-month" value={month} onChange={(e) => setMonth(e.target.value)} className={sc}>
            <option value="all">{t.race.month}</option>
            {monthOptions.map((m) => (
              <option key={m} value={String(m)}>
                {months[m - 1]}
              </option>
            ))}
          </select>
          <Chev className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <label className="sr-only" htmlFor="filter-year">
            {t.race.filterYear}
          </label>
          <select id="filter-year" value={year} onChange={(e) => setYear(e.target.value)} className={sc}>
            <option value="all">{t.race.year}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Chev className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-sm border border-blue-900/50 bg-[#0c1626]">
        <table className="w-full min-w-[640px] text-left">
          <caption className="sr-only">{t.race.title}</caption>
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">
                {t.race.raceName}
              </th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">
                {t.race.date}
              </th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">
                {t.race.location}
              </th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">
                {t.race.status}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr className="border-t border-blue-900/50">
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                  {t.race.noMatch}
                </td>
              </tr>
            ) : (
              sorted.map((race, idx) => {
                const st = getRaceStatus(race, today);
                return (
                  <tr
                    key={race.id}
                    className={
                      idx % 2 === 1
                        ? "border-t border-blue-900/50 bg-white/[0.03] text-sm text-gray-200"
                        : "border-t border-blue-900/50 text-sm text-gray-200"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-white">{race.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{when(race)}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{race.location || t.race.tbc}</td>
                    <td className="px-4 py-3">
                      {st === "ongoing" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-3 py-1 text-xs font-medium text-black">
                          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-black motion-reduce:hidden" />
                          {t.race.ongoing}
                        </span>
                      ) : st === "upcoming" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/60 px-3 py-1 text-xs font-medium text-brand-lime">
                          {t.race.upcomingStatus}
                        </span>
                      ) : st === "season" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-gray-300">
                          {race.seasonYear ? `${race.seasonYear} ${t.race.seasonOf}` : t.race.season}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-gray-400">
                          {t.race.completed}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {sorted.length} {t.race.shown}
      </div>
    </section>
  );
}

function Chev({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
