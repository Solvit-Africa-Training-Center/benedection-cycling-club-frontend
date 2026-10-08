import type { Metadata } from "next";
import RosterSection from "@/components/team/RosterSection";
import StaffSection from "@/components/team/StaffSection";
import TrialsBanner from "@/components/team/TrialsBanner";

export const metadata: Metadata = {
  title: "Team | Benediction Cycling Club",
  description: "Meet the riders and staff of Benediction Cycling Club Rubavu.",
};

export default function TeamPage() {
  return (
    <main className="bg-club-bg text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-club-lime">Benediction CC · Rubavu</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Rising above the crags &amp; volcanoes
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-club-muted md:text-base">
            Elite Rwandan riders forged on high-altitude roads along Lake Kivu — racing with grit, precision, and discipline on the global stage.
          </p>
        </div>
      </section>
      <RosterSection />
      <StaffSection />
      <div className="pt-12">
        <TrialsBanner />
      </div>
    </main>
  );
}

