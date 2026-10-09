import Image from "next/image";
import type { Cyclist } from "@/data/cyclists";
import { defaultGallery } from "@/data/cyclists";
import PhotoPlaceholder from "@/components/team/PhotoPlaceholder";
import { StarIcon, TrophyIcon } from "./icons";

function TimelineIcon({ index }: { index: number }) {
  const Icon = index < 2 ? TrophyIcon : StarIcon;
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-700 bg-blue-950/60">
      <Icon className="h-5 w-5 text-brand-lime" />
    </span>
  );
}

export default function CareerHighlights({ rider }: { rider: Cyclist }) {
  const highlights = rider.highlights ?? [];

  return (
    <section aria-label="Career highlights" className="mt-14">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
        Career Highlights
      </h2>
      {highlights.length > 0 ? (
        <div className="relative mt-8">
          <div
            aria-hidden="true"
            className="absolute left-6 top-0 h-full w-px bg-blue-900 md:left-0 md:top-6 md:h-px md:w-full"
          />
          <ol className="relative flex flex-col gap-8 md:flex-row md:gap-6">
            {highlights.map((highlight, index) => (
              <li key={`${highlight.year}-${highlight.event}`} className="relative flex-1 md:pt-16">
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-6 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-brand-lime md:top-[1.35rem] md:block"
                />
                <div className="relative flex items-start gap-4 md:block">
                  <TimelineIcon index={index} />
                  <div className="md:mt-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-wide text-brand-lime">
                      {highlight.year}
                    </p>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-gray-300">
                      {highlight.event}
                    </p>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-gray-300">
                      {highlight.result}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="mt-4 font-sans text-sm text-gray-500">Coming soon</p>
      )}
    </section>
  );
}

export function RiderGallery({
  name,
  images,
  rider,
}: {
  name: string;
  images?: (string | undefined)[];
  rider?: Cyclist;
}) {
  const source = images ?? rider?.gallery ?? defaultGallery;
  const tiles = [source[0], source[1], source[2], source[3]];
  return (
    <section aria-label={`${name} gallery`} className="mt-14">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
        Gallery
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((src, index) =>
          src ? (
            <div
              key={`${name}-gallery-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <Image
                src={src}
                alt={`Benediction Cycling Club gallery photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              key={`${name}-gallery-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <PhotoPlaceholder
                name={name}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}

