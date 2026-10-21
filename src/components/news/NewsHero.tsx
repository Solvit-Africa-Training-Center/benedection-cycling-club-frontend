"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export default function NewsHero() {
  const { t } = useI18n();
  return (
    <section className="relative isolate h-[300px] overflow-hidden bg-brand-navy text-white md:h-[380px] lg:h-[450px]">
      <Image
        src="/newshero.jpeg"
        alt="A Benediction cyclist climbing a mountain road"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-top"
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-navy/50 via-brand-navy/75 to-brand-navy" />

      <div className="mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
        <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          <span className="block text-gray-100">{t.news.hero}</span>
          <span className="block text-brand-lime">{t.news.heroAccent}</span>
        </h1>
      </div>
    </section>
  );
}
