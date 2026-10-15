import Hero from "@/components/home/Hero";
import News from "@/components/home/News";
import Nurturing from "@/components/home/Nurturing";
import Partners from "@/components/home/Partners";
import RacingKit from "@/components/home/RacingKit";
import SupportBanner from "@/components/home/SupportBanner";
import Team from "@/components/home/Team";

export default function Home() {
  return (
    <>
      <Hero />
      <Nurturing />
      <News />
      <Team />
      <RacingKit />
      <SupportBanner />
      <Partners />
    </>
  );
}