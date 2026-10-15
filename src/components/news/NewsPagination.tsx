import Link from "next/link";

type NewsPaginationProps = {
  current: number;
  total: number;
  shown: number;
  totalArticles: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function NewsPagination({
  current,
  total,
  shown,
  totalArticles,
}: NewsPaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const href = (p: number) => (p === 1 ? "/news" : `/news?page=${p}`);

  const edge =
    "rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider";
  const off = "pointer-events-none text-gray-600";
  const on = "bg-white/5 text-gray-300 transition-colors hover:bg-white/10";

  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm bg-[#141a26] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Showing {shown} of {totalArticles} squad dispatches{" "}
            <span className="text-brand-lime">&bull;</span> Page {pad(current)}{" "}
            / {pad(total)}
          </p>

          <nav aria-label="News pages" className="flex items-center gap-2">
            {current > 1 ? (
              <Link href={href(current - 1)} className={`${edge} ${on}`}>
                Previous
              </Link>
            ) : (
              <span className={`${edge} ${off}`}>Previous</span>
            )}

            {pages.map((p) => (
              <Link
                key={p}
                href={href(p)}
                aria-current={p === current ? "page" : undefined}
                className={`rounded-sm px-3 py-1.5 text-[11px] font-semibold ${
                  p === current
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 transition-colors hover:bg-white/10"
                }`}
              >
                {p}
              </Link>
            ))}

            {current < total ? (
              <Link href={href(current + 1)} className={`${edge} ${on}`}>
                Next
              </Link>
            ) : (
              <span className={`${edge} ${off}`}>Next</span>
            )}
          </nav>
        </div>
      </div>
    </section>
  );
}