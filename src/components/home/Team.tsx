"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const riders = [
  { name: "Mugisha Moise", role: "Cyclist", image: "/member1.jpg" },
  { name: "Manizabayo Eric", role: "Cyclist", image: "/member2.jpg" },
  { name: "Masengesho Vainqueur", role: "Cyclist", image: "/member3.jpg" },
  { name: "Uwiduhaye Mike", role: "Cyclist", image: "/member4.jpg" },
  { name: "Nzafashwanayo Jean Claude", role: "Cyclist", image: "/member5.jpg" },
];

export default function Team() {
  const trackRef = useRef<HTMLDivElement>(null);

  function slideNext() {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return;

    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    const cardStep = second.offsetLeft - first.offsetLeft;
    const visible = Math.max(1, Math.round((track.clientWidth - 24) / cardStep));

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;

    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: cardStep * visible, behavior: "smooth" });
    }
  }

  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Official team
          </h2>
          <button
            type="button"
            onClick={slideNext}
            className="rounded-full bg-brand-lime px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-navy transition-opacity hover:opacity-90"
          >
            Load more
          </button>
        </div>

        {/* One-row sliding track: the riders live INSIDE this div */}
        <div
          ref={trackRef}
          className="-mx-3 mt-6 flex flex-nowrap snap-x snap-mandatory scroll-pl-3 gap-4 overflow-x-auto px-3 pb-3 pt-10 [scrollbar-width:none] lg:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {riders.map((rider) => (
            <Link
              key={rider.name}
              href="/team"
              className="group relative block w-[calc((100%-1rem)/2)] shrink-0 snap-start lg:w-[calc((100%-3.75rem)/4)]"
            >
              {/* Teal card that appears on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-7 bottom-3 left-3 hidden rounded-2xl bg-linear-to-br from-teal-400 to-emerald-300 opacity-0 transition-all duration-300 group-hover:opacity-100 lg:block"
              >
                <span className="absolute right-4 top-2 text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                  Read more
                </span>
              </div>

              {/* Rider card */}
              <article className="relative z-10 aspect-[3/4] overflow-hidden rounded-2xl bg-gray-300">
                <Image
                  src={rider.image}
                  alt={`${rider.name}, ${rider.role}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-top"
                />
                <p className="absolute left-3 top-4 rotate-180 font-display uppercase leading-tight text-brand-navy [writing-mode:vertical-rl]">
                  <span className="block text-xs font-semibold tracking-wide">
                    {rider.name}
                  </span>
                  <span className="block text-[10px] tracking-wider text-brand-navy/70">
                    {rider.role}
                  </span>
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}