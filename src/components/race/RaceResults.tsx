import Link from "next/link";
import type { RaceResult } from "@/data/races";

export default function RaceResults({ results }: { results: RaceResult[] }) {
  return (
    <section className="py-12 md:py-16">
      <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">RACE RESULTS</h2>

      <div className="mt-6 overflow-x-auto rounded-sm border border-blue-900/50 bg-[#0c1626]">
        <table className="w-full min-w-[640px] text-left">
          <caption className="sr-only">Race results</caption>
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Place</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Rider</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Race</th>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              const riderName = result.riderName ?? result.riderSlug;
              const href = result.riderSlug ? `/team/${result.riderSlug}` : null;
              return (
                <tr key={`${result.race}-${result.riderSlug}-${index}`} className={`border-t border-blue-900/50 text-sm text-gray-200 ${index % 2 === 1 ? "bg-white/[0.03]" : ""}`}>
                  <td className="px-4 py-3 text-sm text-gray-200">{result.place || "—"}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {href ? (
                      <Link href={href} className="hover:text-brand-lime">
                        {riderName}
                      </Link>
                    ) : (
                      riderName
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">{result.race}</td>
                  <td className="px-4 py-3 text-sm text-gray-200 tabular-nums">{result.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
