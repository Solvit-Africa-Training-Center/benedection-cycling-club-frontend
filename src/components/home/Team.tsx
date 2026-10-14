"use client";
import Image from "next/image";
import Link from "next/link";

const riders = [
  { name: "Mugisha Moise", role: "Cyclist", image: "/member1.jpg" },
  { name: "Manizabayo Eric", role: "Cyclist", image: "/member2.jpg" },
  { name: "Masengesho Vainqueur", role: "Cyclist", image: "/member3.jpg" },
  { name: "Uwiduhaye Mike", role: "Cyclist", image: "/member4.jpg" },
  { name: "Nzafashwanayo Jean Claude", role: "Cyclist", image: "/member5.jpg" },
];

export default function Team() {
  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Official team
          </h2>
          <Link
            href="/team"
            className="rounded-full bg-brand-lime px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-navy transition-opacity hover:opacity-90"
          >
            Load more
          </Link>
        </div>

        {/* Sliding row: swipe or scroll sideways to see every rider */}
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] lg:gap-5 [&::-webkit-scrollbar]:hidden">
          {riders.map((rider) => (
            <article
              key={rider.name}
              className="relative aspect-[3/4] w-[calc((100%-1rem)/2)] shrink-0 snap-start overflow-hidden rounded-2xl bg-gray-300 lg:w-[calc((100%-3.75rem)/4)]"
            >
              <Image
                src={rider.image}
                alt={`${rider.name}, ${rider.role}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-top"
              />
              {/* Vertical name label */}
              <p className="absolute left-3 top-4 rotate-180 font-display uppercase leading-tight text-brand-navy [writing-mode:vertical-rl]">
                <span className="block text-xs font-semibold tracking-wide">
                  {rider.name}
                </span>
                <span className="block text-[10px] tracking-wider text-brand-navy/70">
                  {rider.role}
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}