import Image from "next/image";

export default function RaceHero() {
  return (
    <section
      className="relative overflow-hidden min-h-[260px] md:min-h-[360px] lg:min-h-[440px]"
      aria-label="Race hero"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/team/riders/team_race.jpg"
          alt="Benediction Cycling Club riders racing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-[260px] items-center justify-center px-4 md:min-h-[360px] lg:min-h-[440px]">
        <h1 className="font-display text-center text-6xl font-extrabold uppercase tracking-tight text-white md:text-8xl">
          RACES
        </h1>
      </div>
    </section>
  );
}
