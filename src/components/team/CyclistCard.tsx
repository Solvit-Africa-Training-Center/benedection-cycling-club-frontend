import type { Cyclist } from "@/data/cyclists";
import PhotoPlaceholder from "./PhotoPlaceholder";

type CyclistCardProps = {
  cyclist: Cyclist;
};

export default function CyclistCard({ cyclist }: CyclistCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-club-panel ring-1 ring-white/10 transition-transform hover:-translate-y-1">
      <PhotoPlaceholder name={cyclist.name} className="aspect-[4/3] w-full" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-club-lime/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-club-lime">
            {cyclist.category}
          </span>
          <span className="rounded-sm bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
            {cyclist.nationality}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-white">{cyclist.name}</h3>
        <p className="text-sm font-medium text-club-muted">{cyclist.role}</p>
        {cyclist.specialty && (
          <p className="mt-1 text-xs text-club-muted">{cyclist.specialty}</p>
        )}
        {(cyclist.age || cyclist.hometown) && (
          <p className="mt-2 text-xs text-club-muted">
            {[cyclist.age ? `Age ${cyclist.age}` : null, cyclist.hometown].filter(Boolean).join(" · ")}
          </p>
        )}
        {cyclist.bio && (
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{cyclist.bio}</p>
        )}
      </div>
    </article>
  );
}

