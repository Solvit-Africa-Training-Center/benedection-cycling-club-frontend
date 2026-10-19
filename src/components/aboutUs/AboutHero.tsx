import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      {/* Background photo */}
      <Image
        src="/aboutus.jpeg"
        alt="A Benediction cyclist riding above Lake Kivu at sunset"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Dark overlay that fades into the page color, same as the home hero */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/50 via-brand-navy/75 to-brand-navy" />

      <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 md:min-h-[520px] md:px-6">
        <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          <span className="block text-gray-100">The legacy of our club</span>
          <span className="block text-brand-lime">
            African cycling excellence
          </span>
        </h1>
      </div>
    </section>
  );
}