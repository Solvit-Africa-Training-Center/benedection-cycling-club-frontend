"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/LanguageProvider";

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const stats: {
  key: "years" | "trophies" | "callups" | "altitude";
  value: string;
  titleClass: string;
  iconClass: string;
  icon: ReactNode;
}[] = [
  {
    key: "years",
    value: "6",
    titleClass: "text-brand-lime",
    iconClass: "text-indigo-200",
    icon: (
      <svg {...iconProps}>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    key: "trophies",
    value: "17",
    titleClass: "text-indigo-200",
    iconClass: "text-brand-lime",
    icon: (
      <svg {...iconProps}>
        <path d="M8 21h8M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
      </svg>
    ),
  },
  {
    key: "callups",
    value: "10",
    titleClass: "text-teal-300",
    iconClass: "text-teal-300",
    icon: (
      <svg {...iconProps}>
        <path d="M5 21V4" />
        <path d="M5 4h11l-2 4 2 4H5" />
      </svg>
    ),
  },
  {
    key: "altitude",
    value: "2.8K",
    titleClass: "text-white",
    iconClass: "text-brand-lime",
    icon: (
      <svg {...iconProps}>
        <path d="m3 19 6-11 4 7 3-4 5 8H3Z" />
      </svg>
    ),
  },
];

export default function AboutStats({
  yearsRacing,
  majorTrophies,
}: {
  yearsRacing?: number;
  majorTrophies?: number;
}) {
  const { t } = useI18n();
  const copy = {
    years: { label: t.about.yearsLabel, title: t.about.yearsTitle, text: t.about.yearsText },
    trophies: { label: t.about.trophiesLabel, title: t.about.trophiesTitle, text: t.about.trophiesText },
    callups: { label: t.about.callupsLabel, title: t.about.callupsTitle, text: t.about.callupsText },
    altitude: { label: t.about.altitudeLabel, title: t.about.altitudeTitle, text: t.about.altitudeText },
  };
  const display = stats.map((stat) => {
    if (stat.key === "years" && yearsRacing) {
      return { ...stat, value: String(yearsRacing) };
    }
    if (stat.key === "trophies" && majorTrophies) {
      return { ...stat, value: String(majorTrophies) };
    }
    return stat;
  });
  return (
    <section className="bg-[#121823]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {display.map((stat) => (
          <article
            key={stat.key}
            className="rounded-sm bg-[#1a2030] p-5 text-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {copy[stat.key].label}
              </p>
              <span className={stat.iconClass}>{stat.icon}</span>
            </div>

            <p className="mt-3 font-display text-6xl font-bold leading-none tracking-tight">
              {stat.value}
            </p>

            <h3
              className={`mt-3 font-display text-base font-bold uppercase tracking-wide ${stat.titleClass}`}
            >
              {copy[stat.key].title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              {copy[stat.key].text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}