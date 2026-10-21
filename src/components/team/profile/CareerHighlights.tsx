import type { Cyclist } from "@/data/cyclists";
import PhotoPlaceholder from "@/components/team/PhotoPlaceholder";
import { TrophyIcon } from "./icons";

const GALLERY_ASPECT = "4 / 5";

function buildGalleryTiles(rider: Cyclist): string[] {
  const raw = ((rider.gallery ?? []) as string[]).filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
  if (raw.length >= 4) return raw.slice(0, 4);
  const own = Array.from(new Set(raw));
  if (own.length >= 1) {
    const repeated: string[] = [];
    while (repeated.length < 4) repeated.push(...own);
    return repeated.slice(0, 4);
  }
  if (rider.image) return [rider.image, rider.image, rider.image, rider.image];
  return [];
}

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
  const tiles = buildGalleryTiles(rider);
  return (
    <section aria-label={`${name} gallery`} className="mt-14">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
        Gallery
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((src, index) => (
            <div
              key={`${name}-gallery-${index}`}
              className="relative overflow-hidden rounded-sm bg-[#d9dce1]"
              style={{ aspectRatio: GALLERY_ASPECT }}
            >
              <PhotoPlaceholder
                name={name}
                src={src}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ))}
      </div>
    </section>
  );
}

