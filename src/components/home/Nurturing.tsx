export default function Nurturing() {
  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="max-w-xl font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl">
          Nurturing world class African cycling talent
        </h2>

        <div className="relative mt-10 overflow-hidden rounded-sm bg-[#1a2030] p-6 md:p-10">
          <h3 className="max-w-xs font-display text-xl font-bold uppercase leading-tight tracking-wide">
            The volcanoes are our daily proving ground
          </h3>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-gray-400 md:text-sm">
            Surrounded by Mount Karisimbi and Mount Bisoke, our athletes train
            at thin atmospheric pressure where lung capacities expand and
            lactic resistance is refined. What began as a community youth
            cycling initiative in Rubavu has crystallized into the dominant
            Continental force across Central and East Africa.
          </p>

          {/* Faint mountain icon, bottom-right corner */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 80"
            className="pointer-events-none absolute -bottom-2 right-4 h-20 w-auto text-white/5 md:h-28"
            fill="currentColor"
          >
            <polygon points="0,80 40,15 65,50 85,25 120,80" />
          </svg>
        </div>
      </div>
    </section>
  );
}