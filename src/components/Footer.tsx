import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Race Reports", href: "/race" },
  { label: "Partners", href: "/partners" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

const clubHub = [
  { label: "Pro Team Kit", href: "/shop" },
  { label: "Sponsors", href: "/partners" },
  { label: "Join The Academy", href: "/contact" },
  { label: "HQ & Press", href: "/contact" },
];

const zigzag =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24' viewBox='0 0 48 24'%3E%3Cpath d='M0 24 L12 4 L24 24 L36 4 L48 24' fill='none' stroke='%23ffffff' stroke-opacity='0.06' stroke-width='1.5'/%3E%3C/svg%3E\")";

function LinkColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-xs text-gray-400 transition-colors hover:text-brand-lime"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* Decorative strip */}
      <div
        className="border-t border-white/10 bg-black/30"
        style={{ backgroundImage: zigzag }}
      >
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-end px-4 md:px-6">
          <svg width="52" height="12" viewBox="0 0 52 12" aria-hidden="true">
            <polygon points="0,12 5,2 10,12" fill="#c6f10e" />
            <polygon points="10,12 15,2 20,12" fill="#2563eb" />
            <polygon points="20,12 25,2 30,12" fill="#34d399" />
            <polygon points="30,12 35,2 40,12" fill="#c6f10e" />
            <polygon points="40,12 45,2 50,12" fill="#2563eb" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">
              Benediction CC
            </h2>
            <span className="rounded-sm bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              Banafrica
            </span>
          </div>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-gray-400">
            Forging elite African cyclists from the high-altitude shores of
            Lake Kivu in Rubavu. Racing with Rwandan grit, aerodynamic
            precision, and uncompromising discipline on the global stage.
          </p>
        </div>

        <LinkColumn title="Navigation" items={navigation} />
        <LinkColumn title="Club Hub" items={clubHub} />

        {/* Newsletter (visual only for now) */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Peloton Dispatch
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">
            Receive direct live race splits, training telemetry breakdowns, and
            official jersey drop notifications.
          </p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="rider@cycling.rw"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-lime"
            />
            <button
              type="button"
              className="bg-blue-600 px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors hover:bg-blue-500"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-5 md:px-6">
        <p className="text-[11px] text-gray-400">
          © 2025 Benediction Cycling Club Rubavu (Banafrica). All rights
          reserved. Registered Rwandan Sporting Entity.
        </p>
      </div>
    </footer>
  );
}