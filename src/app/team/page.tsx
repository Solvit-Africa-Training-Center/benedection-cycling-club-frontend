import type { Metadata } from "next";
import Image from "next/image";
import RosterSection from "@/components/team/RosterSection";
import StaffSection from "@/components/team/StaffSection";
import TrialsBanner from "@/components/team/TrialsBanner";
import { getCyclists, getStaff } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLang } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Team | Benediction Cycling Club",
  description:
    "Engineered on the challenging grades of Rwanda and honed along the mist of Lake Kivu.",
};

export default async function TeamPage() {
  const t = getDictionary(await getRequestLang());
  const [cyclists, staff] = await Promise.all([getCyclists(), getStaff()]);

  return (
    <main className="min-h-screen bg-brand-navy font-sans text-white">
      <section className="relative overflow-hidden min-h-[clamp(26rem,60vw,85vh)]">
        <Image
          src="/images/team/riders/hero_team.jpg"
          alt="Benediction Cycling Club riders"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-transparent to-brand-navy"
        />
        <div className="relative z-10 flex min-h-[clamp(26rem,60vw,85vh)] flex-col justify-end pb-10 pt-12 md:pt-16">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-widest text-brand-lime">
              {t.team.kicker}
            </p>
            <h1 className="font-display text-5xl font-extrabold uppercase leading-none text-white md:text-7xl">
              {t.team.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
              {t.team.intro}
            </p>
          </div>
        </div>
      </section>

      <RosterSection cyclists={cyclists} />

      <div className="mt-16">
        <StaffSection staff={staff} />
      </div>

      <div className="mt-16 pb-16">
        <TrialsBanner />
      </div>
    </main>
  );
}
