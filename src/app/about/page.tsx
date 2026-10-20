import AboutHero from "@/components/aboutUs/AboutHero";
import AboutStats from "@/components/aboutUs/AboutStats";
import AboutSection from "@/components/aboutUs/AboutSection";
import AboutTimeline from "@/components/aboutUs/AboutTimeline";
import { getClubOverview, getMilestones, getTrophies } from "@/lib/api";

const fallbackQuote =
  "We didn't just build a team in Rubavu. We built a belief that African endurance athletes can dictate the pace on any alpine ascent in the world.";

function sectionBody(
  sections: { slug: string; title: string; body: string }[] | undefined,
  keys: string[],
  fallback: string,
) {
  const match = sections?.find((section) =>
    keys.some((key) => section.slug.toLowerCase().includes(key) || section.title.toLowerCase().includes(key)),
  );
  return match?.body || fallback;
}

export default async function AboutPage() {
  const [club, milestones, trophies] = await Promise.all([
    getClubOverview(),
    getMilestones(),
    getTrophies(),
  ]);
  const founded = club?.profile.founded_year;
  const yearsRacing = founded ? Math.max(1, new Date().getFullYear() - founded) : undefined;
  const sections = club?.sections;
  const quote = club?.profile.tagline || fallbackQuote;

  return (
    <>
      <AboutHero />
      <AboutStats
        yearsRacing={yearsRacing}
        majorTrophies={trophies.length || undefined}
      />
      <AboutSection
        title="Our story"
        text={sectionBody(
          sections,
          ["story", "about"],
          "To empower talented cyclists through professional training, mentorship, and opportunities, build discipline, teamwork, resilience, and excellence both on and off the bike and contribute to the growth of cycling in Rwanda and create pathways for athletes to reach their full potential.",
        )}
      />
      <AboutSection
        title="Mission"
        reverse
        light
        text={sectionBody(
          sections,
          ["mission"],
          "Inspire young Rwandans by showing them that a future as professional athletes is possible.\nContribute to the development of Rwanda's cycling culture by providing international exposure and competitive opportunities.\nTrain and educate young talents to become ambassadors and role models for future generations.\nUse cycling to encourage discipline, personal growth and opportunity.\nSupport development pathways for both male and female cyclists.",
        )}
      />
      <AboutSection
        title="Vision"
        text={sectionBody(
          sections,
          ["vision"],
          "Drive the growth of cycling through a distinctive training and development platform.\nHelp establish Rwanda as a leading cycling hub in Africa.\nContribute to Rwandan cycling history through talent development and international competition.\nBuild a sustainable programme that creates opportunities for future generations.",
        )}
        quote={quote}
      />
      <AboutTimeline milestones={milestones} />
    </>
  );
}