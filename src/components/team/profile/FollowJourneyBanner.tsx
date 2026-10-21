"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { FacebookIcon, XLogoIcon, YoutubeIcon } from "./icons";

export default function FollowJourneyBanner() {
  const { t } = useI18n();
  const socials = [
    { label: t.team.followX, href: "#", Icon: XLogoIcon },
    { label: t.team.followYt, href: "#", Icon: YoutubeIcon },
    { label: t.team.followFb, href: "#", Icon: FacebookIcon },
  ];
  return (
    <section aria-label={t.team.followTitle} className="mt-14">
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-slate-800 to-brand-navy">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-lime" />
          <div className="flex-1 pl-3">
            <h2 className="font-display text-2xl font-bold uppercase text-white">
              {t.team.followTitle}
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-gray-300">
              {t.team.followBody}
            </p>
          </div>
          <div className="flex items-center gap-3 pl-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500 text-white transition-colors hover:border-brand-lime hover:text-brand-lime"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <div className="pl-3 md:pl-0">
            <Link
              href="/team"
              className="inline-block rounded-sm border border-brand-lime px-5 py-3 font-sans text-xs font-bold uppercase tracking-wide text-brand-lime transition-colors hover:bg-brand-lime hover:text-black"
            >
              {t.team.meetOthers}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
