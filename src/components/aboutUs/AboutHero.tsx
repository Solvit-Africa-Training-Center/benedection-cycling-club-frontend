import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        {/* Text */}
        <div>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-5xl">
            <span className="block text-gray-100">The legacy of our club</span>
            <span className="block text-brand-lime">
              African cycling excellence
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-400 md:text-base">
            Benediction Cycling Team was founded in 2005 by Benoit Munyakindi and Felix Sempoma, driven by a shared vision to transform lives through cycling. What began as a passion for the sport has grown into a programme dedicated to developing talent and creating opportunities for young athletes.
            We believe that athletes should thrive both on and off the bike. Alongside sporting development, Benediction values education, discipline, teamwork and life opportunities. With Benoit's background in the tourism industry and a longstanding commitment to sport, the programme has continued to support emerging cycling talent.
            Based in Rubavu, western Rwanda, on the shores of Lake Kivu, Benediction works to strengthen Rwanda's cycling culture and support the ambition of making Rwanda a leading cycling hub in Africa.
            The programme has supported men's and women's cycling and a Continental-level team. The current team structure and official status should be stated according to the season being presented.
          </p>
        </div>

        {/* Framed photo */}
        <div className="rounded-sm bg-[#141a26] p-2 md:p-3 lg:ml-auto lg:w-full lg:max-w-460px">
          <div className="relative aspect-3/2 overflow-hidden">
            <Image
              src="/aboutus.jpeg"
              alt="A Benediction cyclist riding above Lake Kivu at sunset"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}