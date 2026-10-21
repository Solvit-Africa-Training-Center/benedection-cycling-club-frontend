"use client";

import PartnersMarquee from "@/components/PartnersMarquee";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export default function Partners() {
  const { t } = useI18n();
  return (
    <section className="bg-[#1b212d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            {t.home.partnersKicker}
          </p>
          <h2 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-gray-100 md:text-2xl">
            {t.home.partnersTitle}
          </h2>
        </div>

        <div className="mt-8">
          <PartnersMarquee />
        </div>
      </div>
    </section>
  );
}
