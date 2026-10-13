import Image from "next/image";
import type { Cyclist } from "@/data/cyclists";
import PhotoPlaceholder from "@/components/team/PhotoPlaceholder";
import { TrophyIcon } from "./icons";

export default function CareerHighlights({ rider }: { rider: Cyclist }) {
  const results = rider.topResults ?? [];

  return (
    <section aria-label="Career highlights" className="mt-14">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
        Career Highlights
      </h2>
      {results.length > 0 ? (
        <div className="rounded-sm border border-blue-900/50 bg-[#0c1626] px-4 py-3">
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-blue-900/50 px-4 py-3 last:border-b-0"
              >
                <TrophyIcon className="h-4 w-4 shrink-0 text-brand-lime" />
                <p className="font-sans text-sm text-gray-300">{result}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 font-sans text-sm text-gray-500">Coming soon</p>
      )}
    </section>
  );
}

export function RiderGallery({ name, rider }: { name: string; rider: Cyclist }) {
  const gallery = Array.from(new Set(rider.gallery ?? []));
  const tiles = [gallery[0], gallery[1], gallery[2], gallery[3]];
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
                alt={`${name} gallery photo ${index + 1}`}
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

