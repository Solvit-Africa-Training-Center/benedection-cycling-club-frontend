import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Race", href: "/race" },
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

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const contact = [
  {
    label: "benedictionbanafricateam@gmail.com",
    href: "mailto:benedictionbanafricateam@gmail.com",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "+250 788 652 921",
    href: "tel:+250788652921",
    icon: (
      <svg {...iconProps}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    ),
  },
  {
    label: "Rubavu, Western Province, Rwanda",
    href: "https://maps.google.com/?q=Rubavu,Rwanda",
    icon: (
      <svg {...iconProps}>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

/*
  Zigzag tile (94 x 53): a tall gray zigzag, a small gray chevron under each
  peak, every second valley drawn in blue, and a small green "V" inside it.
  To make the pattern stronger or fainter, change the stroke-opacity values.
*/
const zigzag = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='94' height='53' viewBox='0 0 94 53'%3E%3Cg fill='none' stroke-width='1.5'%3E%3Cpath d='M0 52 L23.5 2 L47 52 L70.5 2 L94 52' stroke='%23ffffff' stroke-opacity='.06'/%3E%3Cpath d='M11.5 52 L23.5 27 L35.5 52 M58.5 52 L70.5 27 L82.5 52' stroke='%23ffffff' stroke-opacity='.06'/%3E%3Cpath d='M23.5 2 L47 52 L70.5 2' stroke='%232563eb' stroke-opacity='.12'/%3E%3Cpath d='M34.5 2 L47 26 L59.5 2' stroke='%23c6f10e' stroke-opacity='.1'/%3E%3C/g%3E%3C/svg%3E")`;

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
        style={{
          backgroundImage: zigzag,
          backgroundSize: "92px 52px",
          backgroundPosition: "left center",
        }}
      >
        <div className="mx-auto flex h-[53px] max-w-7xl items-center justify-end px-4 md:px-6">
          {/* Six triangles: lime, blue, white, lime, blue, white */}
          <svg width="96" height="13" viewBox="0 0 96 13" aria-hidden="true">
            <polygon points="0,13 8,0 16,13" fill="#d7f20f" />
            <polygon points="16,13 24,0 32,13" fill="#2563eb" />
            <polygon points="32,13 40,0 48,13" fill="#f5f5f5" />
            <polygon points="48,13 56,0 64,13" fill="#d7f20f" />
            <polygon points="64,13 72,0 80,13" fill="#2563eb" />
            <polygon points="80,13 88,0 96,13" fill="#f5f5f5" />
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

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Get in touch
          </h3>

          <ul className="mt-3 space-y-3">
            {contact.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-start gap-3 text-xs text-gray-400 transition-colors hover:text-brand-lime"
                >
                  <span className="mt-0.5 shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-5 md:px-6">
        <p className="text-[11px] text-gray-400">
          © 2026 Benediction Cycling Club Rubavu (Banafrica). All rights
          reserved. Registered Rwandan Sporting Entity.
        </p>
      </div>
    </footer>
  );
}