import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/data/news";

export default function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-gray-100 md:text-4xl">
          Latest news
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col overflow-hidden rounded-sm bg-[#1a2030]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={`object-cover ${article.position ?? "object-center"} transition-transform duration-500 group-hover:scale-105`}
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit rounded-sm bg-brand-lime px-3 py-1 font-display text-sm font-bold uppercase tracking-wide text-brand-navy">
                  {article.category}
                </span>

                <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-wide">
                  {article.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">
                  {article.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="font-display text-base font-bold uppercase tracking-wide">
                    {article.date}
                  </span>
                  <Link
                    href={`/news/${article.slug}`}
                    className="font-display text-base font-bold uppercase tracking-wide text-brand-lime transition-opacity hover:opacity-80"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}