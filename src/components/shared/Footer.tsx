'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-club-panel border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* PELOTON DISPATCH Newsletter Signup Box */}
        <div className="bg-club-panel-light rounded-xl border border-white/10 p-6 md:p-8 mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-black tracking-widest text-club-lime uppercase">
              PELOTON DISPATCH
            </span>
            <h3 className="text-lg md:text-xl font-black uppercase text-white tracking-wide mt-1">
              SUBSCRIBE TO DIRECT RACE TELEMETRY &amp; TEAM DISPATCHES
            </h3>
            <p className="text-xs text-club-muted leading-relaxed mt-1">
              Receive breaking race reports, training updates from Lake Kivu, and exclusive kit drops directly in your inbox.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto min-w-[320px]"
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              className="bg-club-bg border border-white/15 px-4 py-2.5 rounded text-xs text-white placeholder:text-club-muted focus:outline-none focus:border-club-lime flex-1"
              required
            />
            <button
              type="submit"
              className="bg-club-lime text-club-bg text-xs font-black tracking-wider uppercase px-5 py-2.5 rounded hover:brightness-110 transition whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* 3-Column Footer Layout matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Column 1: Club Description Text (Existing) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-club-lime text-club-bg flex items-center justify-center font-black text-xl">
                BCC
              </div>
              <div>
                <span className="text-base font-black tracking-wider uppercase text-white">
                  BENEDICTION <span className="text-club-lime">CYCLING CLUB</span>
                </span>
                <p className="text-[10px] tracking-widest text-club-muted font-bold uppercase">
                  RUBAVU, RWANDA • UCI CONTINENTAL TEAM
                </p>
              </div>
            </div>

            <p className="text-club-muted text-xs leading-relaxed">
              Rwanda&apos;s pioneering cycling club and NGO based on the shores of Lake Kivu.
              Dedicated to high-altitude performance, youth talent development, and representing
              Rwanda with pride on the African and global cycling circuits.
            </p>

            <div className="text-xs text-club-muted space-y-1 pt-1">
              <p>📍 Headquarters: Rubavu District, Western Province, Rwanda</p>
              <p>📧 Contact: info@benedictioncyclingclub.rw</p>
            </div>
          </div>

          {/* Column 2: NAVIGATION */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-club-lime mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Club Heritage
                </Link>
              </li>
              <li>
                <Link
                  href="/races"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Tour &amp; Races
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Roster &amp; Staff
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Race Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CLUB HUB */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-club-lime mb-4">
              CLUB HUB
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/shop"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Pro Team Kit
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  Join The Academy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs font-bold uppercase tracking-wider text-club-muted hover:text-club-lime transition"
                >
                  HQ &amp; Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-club-muted">
          <p>© {new Date().getFullYear()} Benediction Cycling Club. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Registered Rwandan Non-Governmental Organization (NGO)</span>
            <span>•</span>
            <span className="text-club-lime font-bold">UCI Registered Club</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
