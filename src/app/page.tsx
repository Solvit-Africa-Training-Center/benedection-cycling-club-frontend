import Hero from "@/components/home/Hero";
import News from "@/components/home/News";
import Nurturing from "@/components/home/Nurturing";
import Partners from "@/components/home/Partners";
import RacingKit from "@/components/home/RacingKit";
import SupportBanner from "@/components/home/SupportBanner";
import Team from "@/components/home/Team";
import { findClubSection, getClubOverview, getCyclists, getNewsArticles, getPartners, getShopCatalog } from "@/lib/api";

export default async function Home() {
  const [news, cyclists, partners, shop, club] = await Promise.all([
    getNewsArticles(),
    getCyclists(),
    getPartners(),
    getShopCatalog(),
    getClubOverview(),
  ]);
  const homeCopy = findClubSection(club?.sections, ["home"]);
  const supportCopy = findClubSection(club?.sections, ["support"]);
  const kit = shop.products.slice(0, 4).map((product) => ({
    name: product.name,
    tagline: product.category,
    price: `${product.currency === "USD" ? "$" : `${product.currency} `}${product.price.toFixed(2)}`,
    image: product.image,
  }));

  return (
    <>
      <Hero body={homeCopy?.body} />
      <Nurturing />
      <News articles={news} />
      <Team riders={cyclists.slice(0, 5)} />
      <RacingKit items={kit} />
      <SupportBanner title={supportCopy?.title} body={supportCopy?.body} />
      <Partners />
    </>
  );
}