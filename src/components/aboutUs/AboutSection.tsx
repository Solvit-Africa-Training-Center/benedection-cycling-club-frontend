import Image from "next/image";

type AboutSectionProps = {
  title: string;
  text: string;
  quote?: string;
  /** Path in /public, for example "/about-story.jpg". When set, it replaces the title panel. */
  image?: string;
  /** Put the panel on the right and the text on the left (used for Mission). */
  reverse?: boolean;
  /** Lighter slate band, used to alternate the sections. */
  light?: boolean;
};

export default function AboutSection({
  title,
  text,
  quote,
  image,
  reverse = false,
  light = false,
}: AboutSectionProps) {
  const band = light ? "bg-[#1b212d]" : "bg-[#090d15]";

  return (
    <section className={`${band} text-white`}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        {/* Panel: image if given, otherwise the title on soft color blobs */}
        <div
          className={`relative aspect-4/3 w-full max-w-md overflow-hidden rounded-sm bg-[#1c2230] ${
            reverse ? "lg:order-2 lg:ml-auto" : ""
          }`}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 448px, 100vw"
              className="object-cover"
            />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute -left-6 -top-6 h-3/5 w-3/5 rounded-full bg-lime-300/20 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -right-8 h-3/5 w-3/5 rounded-full bg-slate-400/20 blur-2xl"
              />
              <h2 className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold uppercase tracking-wide text-[#6ee0c0] md:text-6xl">
                {title}
              </h2>
            </>
          )}
        </div>

        {/* Text + quote */}
        <div className={reverse ? "lg:order-1" : ""}>
          <p className="max-w-xl whitespace-pre-line text-xs leading-relaxed text-gray-400 md:text-sm">
            {text}
          </p>
          {quote ? (
            <blockquote className="mt-8 max-w-xs rounded-sm bg-[#141a26] p-4 text-xs italic leading-relaxed text-gray-300 lg:ml-10">
              &ldquo;{quote}&rdquo;
            </blockquote>
          ) : null}
        </div>
      </div>
    </section>
  );
}