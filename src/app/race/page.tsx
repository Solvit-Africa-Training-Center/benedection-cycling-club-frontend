import type { Metadata } from "next";
import { races, todayInKigali } from "@/data/races";
import RaceHero from "@/components/race/RaceHero";
import UpcomingRaces from "@/components/race/UpcomingRaces";
import RaceResults from "@/components/race/RaceResults";
import ClubStats from "@/components/race/ClubStats";

export const metadata: Metadata = {
  title: "Races | Benediction Cycling Club",
};

export default function RacePage() {
  const todayIso = todayInKigali();

  return (
    <main className="min-h-screen bg-brand-navy font-sans text-white">
      <RaceHero />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <UpcomingRaces races={races} todayIso={todayIso} />
        <RaceResults />
        <ClubStats />
      </div>
    </main>
  );
}
