import type { Metadata } from "next";
import RosterSection from "@/components/team/RosterSection";
import StaffSection from "@/components/team/StaffSection";
import TrialsBanner from "@/components/team/TrialsBanner";

export const metadata: Metadata = {
  title: "Team | Benediction Cycling Club",
  description:
    "Engineered on the volcanic grades of Rwanda and honed along the mist of Lake Kivu.",
};

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-brand-navy font-sans text-white">
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-12 md:px-6 md:pt-16">
        <h1 className="font-display text-5xl font-extrabold uppercase leading-none text-white md:text-7xl">
          Rosters &amp; Athletes
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
          Engineered on the volcanic grades of Rwanda and honed along the mist of Lake
          Kivu. Meet the grimpeurs, puncheurs, sprinters, and technical minds powering
          Benediction CC.
        </p>
      </section>

      <RosterSection />

      <div className="mt-16">
        <StaffSection />
      </div>

      <div className="mt-16 pb-16">
        <TrialsBanner />
      </div>
    </main>
  );
}
