"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export default function AboutHero() {
  const { t } = useI18n();
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      <Image
        src="/aboutus.jpeg"
        alt="A Benediction cyclist riding above Lake Kivu at sunset"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/50 via-brand-navy/75 to-brand-navy" />

      <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 md:min-h-[520px] md:px-6">
        <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          <span className="block text-gray-100">{t.about.hero}</span>
          <span className="block text-brand-lime">
            {t.about.heroAccent}
          </span>
        </h1>
      </div>
    </section>
  );
}
