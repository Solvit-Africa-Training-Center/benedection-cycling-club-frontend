"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const locales = ["en", "nl"] as const;
type ToggleLocale = (typeof locales)[number];

const labels: Record<ToggleLocale, string> = { en: "EN", nl: "NL" };

export default function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();

  const setLocale = (next: ToggleLocale) => {
    // Cookie write + refresh on user click (event handler, not render).
    // eslint-disable-next-line react-hooks/purity
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${next}; path=/; expires=${expires}; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex shrink-0 rounded-full border border-white/15 bg-white/5 p-1"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          title={code === "en" ? t("english") : t("dutch")}
          className={`inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full px-2.5 py-1 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy focus-visible:outline-none min-[400px]:px-4 ${
            locale === code
              ? "bg-linear-to-r from-brand-teal to-emerald-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
