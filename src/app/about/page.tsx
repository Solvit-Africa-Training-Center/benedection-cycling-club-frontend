import AboutHero from "@/components/aboutUs/AboutHero";
import AboutStats from "@/components/aboutUs/AboutStats";
import AboutSection from "@/components/aboutUs/AboutSection";
import AboutTimeline from "@/components/aboutUs/AboutTimeline";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutSection
        title="Our story"
        text="To empower talented cyclists through professional training, mentorship, and opportunities, build discipline, teamwork, resilience, and excellence both on and off the bike and contribute to the growth of cycling in Rwanda and create pathways for athletes to reach their full potential."
        quote="We didn't just build a team in Rubavu. We built a belief that African endurance athletes can dictate the pace on any alpine ascent in the world."
      />
       <AboutSection
        title="Mission"
        reverse
        light
        text="Inspire young Rwandans by showing them that a future as professional athletes is possible.\nContribute to the development of Rwanda's cycling culture by providing international exposure and competitive opportunities.\nTrain and educate young talents to become ambassadors and role models for future generations.\nUse cycling to encourage discipline, personal growth and opportunity.\nSupport development pathways for both male and female cyclists."
        quote="We didn't just build a team in Rubavu. We built a belief that African endurance athletes can dictate the pace on any alpine ascent in the world."
      />
       <AboutSection
        title="Vision"
        text="Drive the growth of cycling through a distinctive training and development platform.\nHelp establish Rwanda as a leading cycling hub in Africa.\nContribute to Rwandan cycling history through talent development and international competition.\nBuild a sustainable programme that creates opportunities for future generations."
        quote="We didn't just build a team in Rubavu. We built a belief that African endurance athletes can dictate the pace on any alpine ascent in the world."
      />
      <AboutTimeline />
    </>
  );
}