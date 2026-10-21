"use client";

import { useI18n } from "@/lib/i18n/LanguageProvider";

export default function TrialsBanner() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="trials-heading" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-950 to-brand-navy p-6 md:p-8">
        <h2
          id="trials-heading"
          className="font-display text-3xl font-bold uppercase text-blue-200 md:text-4xl"
        >
          {t.team.trialsTitle}
        </h2>
        <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-blue-100/80 md:text-base">
          {t.team.trialsBody}
        </p>
      </div>
    </section>
  );
}
