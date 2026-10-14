import Link from "next/link";

export default function TrialsBanner() {
  return (
    <section aria-labelledby="trials-heading" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-950 to-brand-navy p-8 md:p-12">
        <h2
          id="trials-heading"
          className="font-display text-3xl font-bold uppercase text-blue-200 md:text-4xl"
        >
          Think you have the lungs for Lake Kivu?
        </h2>
        <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-blue-100/80 md:text-base">
          Our Junior Development Academy scouts young cyclists aged 12–18 across the Western
          Province. Open trials take place every quarter at the Rubavu Training Velodrome.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 font-sans">
          <Link
            href="/contact"
            className="rounded-sm bg-brand-lime px-6 py-3 text-xs font-bold uppercase tracking-wide text-black transition-colors hover:bg-white"
          >
            Register for Trials
          </Link>
          <Link
            href="/contact"
            className="rounded-sm bg-black/70 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-black"
          >
            Contact Coaching Staff
          </Link>
        </div>
      </div>
    </section>
  );
}
