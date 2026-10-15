import NewsHero from "@/components/news/NewsHero";
import NewsGrid from "@/components/news/NewsGrid";
import NewsPagination from "@/components/news/NewsPagination";
import { news } from "@/data/news";

const PAGE_SIZE = 6; // use 6 while testing with only 9 articles

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const totalPages = Math.max(1, Math.ceil(news.length / PAGE_SIZE));
  const current = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const articles = news.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <NewsHero />
      <NewsGrid articles={articles} />
      <NewsPagination
        current={current}
        total={totalPages}
        shown={articles.length}
        totalArticles={news.length}
      />
    </>
  );
}