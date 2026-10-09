import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    image: "/news1.jpg",
    zoom: "",
    badge: "Stage Recap",
    badgeClass: "text-brand-lime",
    date: "Oct 24, 2025",
    category: "Tour du Rwanda",
    title:
      "Tactical mastery in the northern crags: how Benediction secured the breakaway",
    excerpt:
      "A minute-by-minute breakdown of the strategic crosswind attack deployed at kilometer 92 on the descent towards Rubavu.",
    readTime: "4 min read",
    href: "/news",
  },
  {
    image: "/news2.png",
    zoom: "scale-[1.15]",
    badge: "Academy",
    badgeClass: "text-emerald-300",
    date: "Oct 18, 2025",
    category: "Development Squad",
    title:
      "Next-gen climbers: six junior athletes promoted to the Continental roster",
    excerpt:
      "Discover the breakthrough riders stepping up from the Rubavu Youth Academy into the UCI Continental peloton for 2026.",
    readTime: "3 min read",
    href: "/news",
  },
  {
    image: "/news3.png",
    zoom: "scale-[1.15]",
    badge: "Engineering",
    badgeClass: "text-sky-300",
    date: "Oct 10, 2025",
    category: "Tech Insights",
    title:
      "Aero tuning for 12% incline: custom gearing for the Virunga volcano stages",
    excerpt:
      "Head mechanic Emmanuel Bizimana reveals the gear ratios and tubeless pressures optimized for cobblestone and volcanic ash tarmac.",
    readTime: "6 min read",
    href: "/news",
  },
];

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function News() {
  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Latest news &amp; race reports
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-brand-lime"
          >
            Read all field dispatches
            <Arrow />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group flex flex-col overflow-hidden rounded-2xl bg-[#1a2030]"
            >
              <Link href={post.href} className="flex h-full flex-col">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* Wrapper = hover zoom */}
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {/* Image = fixed zoom to hide dark borders */}
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={`object-cover ${post.zoom}`}
                    />
                  </div>
                  <span
                    className={`absolute bottom-2 left-2 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${post.badgeClass}`}
                  >
                    {post.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {post.date} &bull; {post.category}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight tracking-wide">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 text-xs text-gray-500">
                    <span>{post.readTime}</span>
                    <Arrow />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}