import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsArticle } from "@/lib/api";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) notFound();

  const paragraphs = article.content ?? [article.excerpt];

  return (
    <article className="bg-brand-navy text-white">
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <Link
          href="/news"
          className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-brand-lime"
        >
          &larr; Back to news
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <span className="rounded-sm bg-brand-lime px-3 py-1 font-display text-sm font-bold uppercase tracking-wide text-brand-navy">
            {article.category}
          </span>
          <span className="font-display text-base font-bold uppercase tracking-wide text-gray-300">
            {article.date}
          </span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-sm bg-[#1a2030]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            unoptimized={article.image.startsWith("http")}
            className={`object-cover ${article.position ?? "object-center"}`}
          />
        </div>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-gray-300 md:text-base">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <Link
          href="/news"
          className="mt-12 inline-block rounded-sm bg-brand-lime px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-navy transition-opacity hover:opacity-90"
        >
          All news
        </Link>
      </div>
    </article>
  );
}