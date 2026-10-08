'use client';

import { useState } from 'react';
import Link from 'next/link';
import { navLinks } from '@/data/navLinks';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'DE'>('EN');

  return (
    <header className="sticky top-0 z-50 bg-club-bg/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-club-lime text-club-bg flex items-center justify-center font-black text-xl tracking-tighter">
            BCC
          </div>
          <div>
            <div className="text-base md:text-lg font-black tracking-wider uppercase text-white group-hover:text-club-lime transition">
              BENEDICTION <span className="text-club-lime">CC</span>
            </div>
            <div className="text-[10px] tracking-widest text-club-muted font-bold uppercase">
              RUBAVU, RWANDA • UCI CONTINENTAL
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action & Language Toggle */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Visible EN/DE Language Toggle */}
          <div className="flex items-center border border-white/15 rounded bg-club-panel text-[11px] font-black font-mono overflow-hidden">
            <button
              type="button"
              onClick={() => setCurrentLang('EN')}
              className={`px-2.5 py-1 transition ${
                currentLang === 'EN'
                  ? 'bg-club-lime text-club-bg'
                  : 'text-club-muted hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => setCurrentLang('DE')}
              className={`px-2.5 py-1 transition ${
                currentLang === 'DE'
                  ? 'bg-club-lime text-club-bg'
                  : 'text-club-muted hover:text-white'
              }`}
            >
              DE
            </button>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-white hover:text-club-lime transition"
          >
            PRO SHOP
          </Link>
          <Link
            href="/support"
            className="bg-club-lime text-club-bg text-xs font-black tracking-wider uppercase px-4 py-2.5 rounded-sm hover:brightness-110 transition shadow-sm"
          >
            SUPPORT CLUB
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Language Toggle */}
          <div className="flex items-center border border-white/15 rounded bg-club-panel text-[11px] font-black font-mono overflow-hidden">
            <button
              type="button"
              onClick={() => setCurrentLang('EN')}
              className={`px-2 py-0.5 transition ${
                currentLang === 'EN'
                  ? 'bg-club-lime text-club-bg'
                  : 'text-club-muted'
              }`}
            >
              EN
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => setCurrentLang('DE')}
              className={`px-2 py-0.5 transition ${
                currentLang === 'DE'
                  ? 'bg-club-lime text-club-bg'
                  : 'text-club-muted'
              }`}
            >
              DE
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-club-muted hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-club-panel border-b border-white/10 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-club-lime text-club-bg text-xs font-black tracking-wider uppercase py-3 rounded-sm hover:brightness-110 transition"
            >
              SUPPORT CLUB
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
