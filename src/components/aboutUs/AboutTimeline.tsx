import TimelineSlider from "@/components/aboutUs/TimelineSlider";

export type TimelineMilestone = {
  tag: string;
  year: string;
  title: string;
  text: string;
  achievement: string;
  yearClass: string;
  achievementClass: string;
  current: boolean;
};

const fallbackMilestones: TimelineMilestone[] = [
  {
    tag: "Year 01",
    year: "2012",
    title: "Inception & grassroots scouting",
    text: "Formation of Benediction Club in Rubavu by passionate coaches, scouting athletic young cyclists navigating steep slopes of Western Province.",
    achievement: "1st regional title",
    yearClass: "text-brand-lime",
    achievementClass: "text-gray-400",
    current: false,
  },
  {
    tag: "Continental break",
    year: "2016",
    title: "UCI points & championship jersey",
    text: "Secured first historic international UCI Africa Tour points, sweeping the Rwandan National Road Championships with homegrown talent.",
    achievement: "National jersey claim",
    yearClass: "text-indigo-200",
    achievementClass: "text-indigo-200",
    current: false,
  },
  {
    tag: "Professional licensing",
    year: "2020",
    title: "UCI Continental tier registered",
    text: "Registered as a UCI Continental Team under the banner of Benediction Ignite / Banafrica, ensuring calendar spots in top-tier stage races globally.",
    achievement: "Continental status",
    yearClass: "text-teal-300",
    achievementClass: "text-teal-300",
    current: false,
  },
  {
    tag: "Current era",
    year: "2024-26",
    title: "Tour du Rwanda domination & KOM",
    text: "Multiple explosive stage victories, claiming the prestigious King of the Mountains classification and fielding 4 riders into UCI World Championship heats.",
    achievement: "KOM & GC stages",
    yearClass: "text-brand-lime",
    achievementClass: "text-brand-lime",
    current: true,
  },
];

export default function AboutTimeline({
  milestones = fallbackMilestones,
}: {
  milestones?: TimelineMilestone[];
}) {
  const items = milestones.length ? milestones : fallbackMilestones;
  return (
    <section className="bg-[#1b212d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        {/* Header */}
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-200">
            Chronological milestones
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-gray-100 md:text-5xl">
            The Ascension timeline
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-gray-400 md:text-sm">
            Key tactical checkpoints in our journey from local Rubavu club to
            international racing power.
          </p>
        </div>

        {/* Cards: one sliding row with arrows */}
        <div className="mt-12">
          <TimelineSlider>
            {items.map((m, index) => (
              <article
                key={`${m.year}-${m.title}-${index}`}
                className="flex flex-col rounded-sm bg-[#222836] p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`rounded-sm px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                      m.current
                        ? "bg-brand-lime text-brand-navy"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {m.tag}
                  </span>
                  <span
                    className={`font-display text-2xl font-bold leading-none ${m.yearClass}`}
                  >
                    {m.year}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-base font-bold uppercase leading-tight tracking-wide text-gray-100">
                  {m.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">
                  {m.text}
                </p>

                <p
                  className={`mt-auto pt-5 text-[10px] font-bold uppercase tracking-wider ${m.achievementClass}`}
                >
                  Achievement: {m.achievement}
                </p>
              </article>
            ))}
          </TimelineSlider>
        </div>
      </div>
    </section>
  );
}