"use client";

import Image from "next/image";
import { useState } from "react";
import { partners } from "@/data/partners";

const triangleColors = ["#c6f10e", "#2563eb", "#34d399", "#c6f10e", "#2563eb", "#34d399"];

function TriangleRow() {
  return (
    <svg width="52" height="8" viewBox="0 0 52 8" aria-hidden="true">
      {triangleColors.map((color, index) => (
        <polygon
          key={color + index}
          points={`${index * 8.6},8 ${index * 8.6 + 4.3},1 ${index * 8.6 + 8.6},8`}
          fill={color}
        />
      ))}
    </svg>
  );
}

function PartnerCard({ partner }: { partner: (typeof partners)[number] }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-[#171d29] shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1 hover:border-brand-teal/60">
      <div className="relative min-h-28 border-b border-white/10 bg-white">
        <div className="relative h-28 w-full p-3">
          {partner.logo && !logoFailed ? (
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-contain object-center p-3"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center px-3">
              <span className="font-display text-3xl font-bold uppercase tracking-tight text-brand-navy">
                {partner.mark}
              </span>
            </div>
          )}
        </div>
        {partner.featured && (
          <span className="absolute right-4 top-4 rounded-full border border-brand-lime/50 bg-brand-navy/80 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-brand-lime">
            Official
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-2xl font-bold uppercase leading-none tracking-wide text-slate-100">
          {partner.name}
        </h2>
        <p className="mt-3 text-[11px] font-bold uppercase leading-relaxed tracking-wider text-brand-teal">
          {partner.specialization}
        </p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{partner.description}</p>

        {partner.website ? (
          <a
            href={partner.website}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-teal px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-navy"
          >
            {partner.websiteLabel}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="mt-6 inline-flex w-fit items-center rounded-full border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Website to be confirmed
          </span>
        )}
      </div>
    </article>
  );
}

export default function PartnerScreen() {
  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-navy/95 via-brand-navy/75 to-brand-navy/55" />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/20 via-transparent to-brand-navy" />

        <div className="mx-auto flex min-h-[360px] max-w-7xl flex-col justify-center px-4 py-16 md:min-h-[440px] md:px-6">
          <TriangleRow />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-brand-lime">
            Benediction Banafrica Cycling Team
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight md:text-7xl">
            Official <span className="text-brand-teal">Sponsors</span>
            <br />
            &amp; Partners
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-300 md:text-base">
            We are proud to ride with organizations that believe in the power of cycling,
            stronger communities and a sustainable future.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-lime">
              The team behind the team
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
              Our partners
            </h2>
          </div>
          <p className="max-w-xs text-right text-xs leading-relaxed text-gray-500">
            Eight partners. One peloton. A shared commitment to going further.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-white/10">
        <Image
          src="/background.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 -z-10 bg-brand-navy/75" />
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6 md:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-teal">
              Join the peloton
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none md:text-5xl">
              Together, we go further
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-300">
              Interested in becoming a partner? Let&apos;s create a bigger impact in cycling
              and beyond.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex w-fit items-center rounded-full bg-brand-teal px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy transition-colors hover:bg-brand-lime"
          >
            Partner with us
          </a>
        </div>
      </section>
    </main>
  );
}