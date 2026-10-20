import type { Metadata } from "next";
import { todayInKigali } from "@/data/races";
import RaceHero from "@/components/race/RaceHero";
import UpcomingRaces from "@/components/race/UpcomingRaces";
import RaceResults from "@/components/race/RaceResults";
import ClubStats from "@/components/race/ClubStats";
import { getCyclists, getRaces, getTrophies, winsByRoster } from "@/lib/api";

export const metadata: Metadata = {
  title: "Races | Benediction Cycling Club",
};

export default async function RacePage() {
  const todayIso = todayInKigali();
  const [races, results, cyclists] = await Promise.all([getRaces(), getTrophies(), getCyclists()]);
  const stats = winsByRoster(results, cyclists);

  return (
    <main className="min-h-screen bg-brand-navy font-sans text-white">
      <RaceHero />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <UpcomingRaces races={races} todayIso={todayIso} />
        <RaceResults results={results} />
        <ClubStats stats={stats.some((stat) => stat.value > 0) ? stats : undefined} />
      </div>
    </main>
  );
}
