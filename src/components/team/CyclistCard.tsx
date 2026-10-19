import Link from "next/link";
import type { Cyclist } from "@/data/cyclists";
import PhotoPlaceholder from "./PhotoPlaceholder";

type CyclistCardProps = {
  cyclist: Cyclist;
};

export default function CyclistCard({ cyclist }: CyclistCardProps) {
  const hasImage = Boolean(cyclist.image);
  const textColor = hasImage ? "text-slate-900" : "text-white";

  return (
    <Link
      href={`/team/${cyclist.slug ?? cyclist.id ?? encodeURIComponent(cyclist.name)}`}
      aria-label={`View profile: ${cyclist.name}`}
      className="group relative block rounded-2xl focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-lime focus-visible:outline-offset-4"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 translate-x-3 -translate-y-6 rounded-2xl bg-brand-teal opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
      >
        <span className="absolute top-1 right-3 flex items-center gap-1 font-display text-xs uppercase tracking-wide text-slate-900">
          Read more
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      </div>

      <div className="relative z-10 aspect-[3/4] overflow-hidden rounded-2xl">
        <PhotoPlaceholder
          name={cyclist.name}
          src={cyclist.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute top-4 left-4 z-10 flex flex-row items-start gap-2">
          <h3
            className={`font-display text-sm font-bold uppercase tracking-wide [writing-mode:vertical-rl] rotate-180 ${textColor}`}
          >
            {cyclist.name}
          </h3>
          <p
            className={`font-sans text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 ${textColor}`}
          >
            {cyclist.role}
          </p>
        </div>
      </div>
    </Link>
  );
}

