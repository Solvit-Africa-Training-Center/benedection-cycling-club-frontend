import Link from "next/link";
import type { Cyclist } from "@/data/cyclists";
import TeamPhoto from "./TeamPhoto";

type RiderCardProps = {
  rider: Cyclist;
};

export default function RiderCard({ rider }: RiderCardProps) {
  return (
    <article className="overflow-hidden border border-white/10 bg-white/[0.04]">
      <Link
        href={`/team/${rider.slug}`}
        aria-label={`Read more about ${rider.name}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime"
      >
        <div className="relative">
          <TeamPhoto name={rider.name} image={rider.image} aspectClass="aspect-[3/4]" />
          <div className="absolute inset-y-0 left-0 flex flex-row items-start gap-2 bg-gradient-to-r from-black/70 via-black/30 to-transparent p-3">
            <h3 className="font-display text-lg font-bold uppercase leading-none tracking-wide text-white [writing-mode:vertical-rl] rotate-180">
              {rider.name}
            </h3>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-lime [writing-mode:vertical-rl] rotate-180">
              {rider.role}
            </p>
          </div>
          <span className="absolute bottom-3 left-3 bg-brand-lime px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-widest text-black opacity-0 transition-all duration-200 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
            Read more
          </span>
        </div>
      </Link>
    </article>
  );
}

