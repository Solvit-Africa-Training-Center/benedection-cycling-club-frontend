export const LANG_COOKIE = "bcc-lang";
export const DEFAULT_LANG = "en" as const;

export type AppLang = "en" | "nl-BE";

export function parseLang(value?: string | null): AppLang {
  const raw = value?.trim().toLowerCase() ?? "";
  if (!raw) return DEFAULT_LANG;
  if (raw === "nl" || raw === "nl-be" || raw === "nl-nl" || raw.startsWith("nl")) {
    return "nl-BE";
  }
  return "en";
}

export function htmlLang(lang: AppLang): string {
  return lang === "nl-BE" ? "nl-BE" : "en";
}

export function switcherLabel(code: string): string {
  return parseLang(code) === "nl-BE" ? "NL" : "EN";
}

export function persistLangCookie(lang: AppLang) {
  document.cookie = `${LANG_COOKIE}=${encodeURIComponent(lang)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
