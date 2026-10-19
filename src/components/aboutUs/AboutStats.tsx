import type { ReactNode } from "react";

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
  label: string;
  value: string;
  title: string;
  text: string;
  titleClass: string;
  iconClass: string;
  icon: ReactNode;
}[] = [
  {
    label: "Legacy duration",
    value: "6",
    title: "Years of racing",
    text: "Sustained competitive peloton legacy since inception.",
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
    label: "Podiums & palmarès",
    value: "17",
    title: "Major trophies",
    text: "Tour du Rwanda stages, African Continental crowns & GC titles.",
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
    label: "National selection",
    value: "10",
    title: "National callups",
    text: "Rwandan National Team representatives forged in our ranks.",
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
    label: "Altitude gradient",
    value: "2.8K",
    title: "Meters peak climbs",
    text: "Training summits across the Virunga volcanic spine.",
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
  const display = stats.map((stat) => {
    if (stat.title === "Years of racing" && yearsRacing) {
      return { ...stat, value: String(yearsRacing) };
    }
    if (stat.title === "Major trophies" && majorTrophies) {
      return { ...stat, value: String(majorTrophies) };
    }
    return stat;
  });
  return (
    <section className="bg-[#121823]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {display.map((stat) => (
          <article
            key={stat.label}
            className="rounded-sm bg-[#1a2030] p-5 text-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {stat.label}
              </p>
              <span className={stat.iconClass}>{stat.icon}</span>
            </div>

            <p className="mt-3 font-display text-6xl font-bold leading-none tracking-tight">
              {stat.value}
            </p>

            <h3
              className={`mt-3 font-display text-base font-bold uppercase tracking-wide ${stat.titleClass}`}
            >
              {stat.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              {stat.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}