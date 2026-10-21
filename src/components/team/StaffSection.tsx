"use client";

import type { StaffMember } from "@/data/staff";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import StaffCard from "./StaffCard";

export default function StaffSection({ staff }: { staff: StaffMember[] }) {
  const { t } = useI18n();
  return (
    <section aria-labelledby="staff-heading" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <h2
        id="staff-heading"
        className="font-display text-3xl font-bold uppercase text-white md:text-4xl"
      >
        {t.team.staffHeading}
      </h2>
      <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-gray-400 md:text-base">
        {t.team.staffIntro}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {staff.map((member) => (
          <StaffCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
}
