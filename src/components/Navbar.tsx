"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Race", href: "/race" },
  { label: "Partners", href: "/partners" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "DE">("EN");

  return (
    <header className="sticky top-0 z-50 bg-brand-navy font-display text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Benediction Cycling Club logo"
            width={800}
            height={400}
            quality={100}
            className="h-10 w-auto rounded-sm"
          />
          <span className="leading-none">
            <span className="block text-lg font-bold uppercase tracking-wide">
              Benediction
            </span>
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-lime">
              Cycling Club
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "text-xl font-semibold uppercase tracking-wide text-brand-lime"
                    : "text-sm font-medium uppercase tracking-wide text-gray-400 transition-colors hover:text-white"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: language toggle + mobile button */}
        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Language"
            className="flex rounded-full border border-white/15 bg-white/5 p-1"
          >
            {(["EN", "DE"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                  lang === code
                    ? "bg-linear-to-r from-brand-teal to-emerald-500 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="rounded-md p-2 text-gray-300 hover:text-white lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 lg:hidden">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`rounded px-2 py-2 text-base font-medium uppercase tracking-wide ${
                pathname === href ? "text-brand-lime" : "text-gray-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      {/* Gradient bottom line */}
      <div className="h-3px w-full bg-linear-to-r from-blue-600 via-emerald-400 to-brand-lime" />
    </header>
  );
}