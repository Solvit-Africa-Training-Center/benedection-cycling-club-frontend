import Link from "next/link";

function BikeIcon() {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 -top-12 hidden h-64 w-auto text-white/10 md:block"
    >
      {/* Wheels */}
      <circle cx="45" cy="80" r="34" />
      <circle cx="155" cy="80" r="34" />
      {/* Frame */}
      <path d="M45 80 72 38h66L90 80H45Z" />
      <path d="M90 80 72 38M138 38l17 42" />
      {/* Handlebar and saddle */}
      <path d="M138 38l-8-12h20M60 30h26" />
    </svg>
  );
}

export default function SupportBanner() {
  return (
    <section className="bg-[#0d111b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="relative overflow-hidden rounded-sm bg-[linear-gradient(90deg,#1b46c0_0%,#1a3da8_22%,#162a63_45%,#1a2030_68%)]">
          <BikeIcon />

          <div className="relative grid items-center gap-8 px-6 py-10 md:px-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Text */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-lime">
                Join the squad // Become part of our journey
              </p>
              <h2 className="mt-4 max-w-md font-display text-3xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                Support Rwandan cycling on the global stage
              </h2>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-gray-300">
                Whether you are an aspiring junior cyclist, an international
                supporter, or a performance sponsor, join our movement forging
                champions from Rubavu to the world.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="bg-brand-lime px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-navy transition-opacity hover:opacity-90"
              >
                Join the academy
              </Link>
              <Link
                href="/partners"
                className="bg-[#0d111b] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}