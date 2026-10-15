import Image from "next/image";

const triangleColors = [
  "#c6f10e", "#2563eb", "#34d399", "#c6f10e", "#2563eb",
  "#34d399", "#c6f10e", "#2563eb", "#34d399", "#2563eb",
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      {/* Background photo */}
      <Image
        src="/background.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Dark overlay that fades into the page color */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/50 via-brand-navy/75 to-brand-navy" />

      <div className="mx-auto flex min-h-420px max-w-7xl flex-col justify-center px-4 py-16 md:min-h-520px md:px-6">
        {/* Triangle row */}
        <svg
          width="84"
          height="10"
          viewBox="0 0 84 10"
          aria-hidden="true"
          className="mb-4"
        >
          {triangleColors.map((color, i) => (
            <polygon
              key={i}
              points={`${i * 8.4},10 ${i * 8.4 + 4},1 ${i * 8.4 + 8},10`}
              fill={color}
            />
          ))}
        </svg>

        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
          Rising above the{" "}
          <span className="bg-linear-to-r from-sky-200 to-indigo-300 bg-clip-text text-transparent">
            Crags &amp;
          </span>
          <br />
          <span className="bg-linear-to-r from-brand-lime to-emerald-400 bg-clip-text text-transparent">
            Volcanoes
          </span>{" "}
          of Rubavu
        </h1>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
      Founded in 2005, Benediction Banafrica Team is a cycling development programme based in Rubavu, Rwanda, on the shores of Lake Kivu. Our mission is to develop young cycling talent, create opportunities for men and women in sport, and connect Rwandan and African riders with national and international competition.
      Through cycling, we promote discipline, education, teamwork and personal development. We aim to help young athletes build strong futures both on and off the bike while contributing to the growth of cycling in Rwanda and across Africa.
      Partner with us. Support our riders. Help build the future of African cycling.

        </p>
      </div>
    </section>
  );
}