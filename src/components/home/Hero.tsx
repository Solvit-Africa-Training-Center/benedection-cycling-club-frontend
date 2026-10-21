"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/LanguageProvider";

const triangleColors = [
  "#c6f10e", "#2563eb", "#34d399", "#c6f10e", "#2563eb",
  "#34d399", "#c6f10e", "#2563eb", "#34d399", "#2563eb",
];

export default function Hero({ body }: { body?: string }) {
  const { t } = useI18n();
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      <Image
        src="/background.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/50 via-brand-navy/75 to-brand-navy" />

      <div className="mx-auto flex min-h-420px max-w-7xl flex-col justify-center px-4 py-16 md:min-h-520px md:px-6">
        <svg
          width="84"
          height="10"
          viewBox="0 0 84 10"
          aria-hidden="true"
          className="mb-4"
        >
          {triangleColors.map((color, i) => (
            <polygon
              key={i}
              points={`${i * 8.4},10 ${i * 8.4 + 4},1 ${i * 8.4 + 8},10`}
              fill={color}
            />
          ))}
        </svg>

        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
          {t.home.heroLine1}{" "}
          <span className="bg-linear-to-r from-sky-200 to-indigo-300 bg-clip-text text-transparent">
            {t.home.heroCrags}
          </span>
          <br />
          <span className="bg-linear-to-r from-brand-lime to-emerald-400 bg-clip-text text-transparent">
            {t.home.heroVolcanoes}
          </span>{" "}
          {t.home.heroOf}
        </h1>

        <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-gray-300 md:text-base">
          {body || t.home.heroBody}
        </p>
      </div>
    </section>
  );
}
