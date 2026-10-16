import Hero from "@/components/home/Hero";
import News from "@/components/home/News";
import Nurturing from "@/components/home/Nurturing";
import Partners from "@/components/home/Partners";
import RacingKit from "@/components/home/RacingKit";
import SupportBanner from "@/components/home/SupportBanner";
import Team from "@/components/home/Team";
import { getCyclists, getNewsArticles, getPartners, getShopCatalog } from "@/lib/api";

export default async function Home() {
  const [news, cyclists, partners, shop] = await Promise.all([
    getNewsArticles(),
    getCyclists(),
    getPartners(),
    getShopCatalog(),
  ]);
  const kit = shop.products.slice(0, 4).map((product) => ({
    name: product.name,
    tagline: product.category,
    price: `${product.currency === "USD" ? "$" : `${product.currency} `}${product.price.toFixed(2)}`,
    image: product.image,
  }));

  return (
    <>
      <Hero />
      <Nurturing />
      <News articles={news} />
      <Team riders={cyclists.slice(0, 5)} />
      <RacingKit items={kit} />
      <SupportBanner />
      <Partners
        partners={partners.slice(0, 6).map((partner) => ({
          name: partner.name,
          caption: partner.specialization,
        }))}
      />
    </>
  );
}