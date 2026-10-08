import Link from "next/link";

export default function TrialsBanner() {
  return (
    <section aria-labelledby="trials-heading" className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
      <div className="overflow-hidden rounded-2xl bg-club-blue p-8 md:p-12">
        <p className="text-xs font-bold uppercase tracking-widest text-white/80">Open trials</p>
        <h2 id="trials-heading" className="mt-2 max-w-2xl text-3xl font-bold text-white md:text-4xl">
          Think you can climb above the crags of Rubavu?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
          Join the Benediction academy trials. Show your discipline, power, and teamwork — earn a place in the next generation of Rwandan cycling.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-club-lime px-6 py-3 text-sm font-bold uppercase tracking-wider text-club-bg transition-transform hover:-translate-y-0.5"
          >
            Apply for trials
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
          >
            Contact the club
          </Link>
        </div>
      </div>
    </section>
  );
}

