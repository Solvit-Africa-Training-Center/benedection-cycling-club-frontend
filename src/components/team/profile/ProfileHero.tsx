"use client";

import type { Cyclist } from "@/data/cyclists";
import PhotoPlaceholder from "@/components/team/PhotoPlaceholder";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import type { Dictionary } from "@/lib/i18n/dictionary";

function localizeTitle(title: string, t: Dictionary, category?: Cyclist["category"]): string {
  const key = title.trim().toLowerCase();
  if (key === "women's road cyclist" || (key === "road cyclist" && category === "women")) {
    return t.team.womensRoadCyclist;
  }
  if (key === "road cyclist") return t.team.roadCyclist;
  return title;
}

export default function ProfileHero({ rider }: { rider: Cyclist }) {
  const { t, lang } = useI18n();
  const displayName = rider.name;
  const image = rider.image;
  const bio = lang === "nl-BE" ? rider.bioNl ?? rider.bio ?? rider.description : rider.bio ?? rider.description;

  return (
    <section aria-label={`${displayName} overview`}>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <PhotoPlaceholder
            name={displayName}
            src={image}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-none text-white md:text-6xl">
            {displayName}
          </h1>
          {rider.title ? (
            <p className="mt-4 inline-block bg-blue-600 px-3 py-1 font-sans text-xs font-bold uppercase tracking-wide text-white">
              {localizeTitle(rider.title, t, rider.category)}
            </p>
          ) : null}
          {bio ? (
            <p className="mt-4 max-w-md whitespace-pre-line font-sans text-sm leading-relaxed text-gray-300">
              {bio}
            </p>
          ) : (
            <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-gray-500">
              {t.common.profileSoon}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
