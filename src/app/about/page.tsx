import AboutHero from "@/components/aboutUs/AboutHero";
import AboutStats from "@/components/aboutUs/AboutStats";
import AboutSection from "@/components/aboutUs/AboutSection";
import AboutTimeline from "@/components/aboutUs/AboutTimeline";
import { findClubSection, getClubOverview, getMilestones, getTrophies } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLang } from "@/lib/i18n/server";

export default async function AboutPage() {
  const t = getDictionary(await getRequestLang());
  const [club, milestones, trophies] = await Promise.all([
    getClubOverview(),
    getMilestones(),
    getTrophies(),
  ]);
  const founded = club?.profile.founded_year;
  const yearsRacing = founded ? Math.max(1, new Date().getFullYear() - founded) : undefined;
  const story = findClubSection(club?.sections, ["story", "about"]);
  const mission = findClubSection(club?.sections, ["mission"]);
  const vision = findClubSection(club?.sections, ["vision"]);
  const quote = club?.profile.tagline;

  return (
    <>
      <AboutHero />
      <AboutStats
        yearsRacing={yearsRacing}
        majorTrophies={trophies.length || undefined}
      />
      <AboutSection
        title={story?.title || t.about.story}
        text={story?.body || ""}
      />
      <AboutSection
        title={mission?.title || t.about.mission}
        reverse
        light
        text={mission?.body || ""}
      />
      <AboutSection
        title={vision?.title || t.about.vision}
        text={vision?.body || ""}
        quote={quote}
      />
      <AboutTimeline milestones={milestones} />
    </>
  );
}
