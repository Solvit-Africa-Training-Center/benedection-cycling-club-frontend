/** Django API origin on Render. No trailing slash. */
const DEFAULT_API_BASE_URL = "https://benediction-api.onrender.com";

export function getApiBaseUrl(): string {
  const raw =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return raw.trim().replace(/\/+$/, "");
}

/**
 * Turn an API file field into a URL the browser can load.
 * Django may return an absolute URL, `/media/...`, or `media/...`.
 * Local `/public` paths are left unchanged.
 */
export function resolveMediaUrl(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  if (value.startsWith("//")) return `https:${value}`;

  const pathname = value.startsWith("/") ? value : `/${value}`;
  const fromApi = pathname.startsWith("/media/") || pathname.startsWith("/static/");
  if (fromApi) {
    const base = getApiBaseUrl();
    return base ? `${base}${pathname}` : undefined;
  }

  return value.startsWith("/") ? value : undefined;
}

export const API_REVALIDATE_SECONDS = 60;

/** Free Render instances can take ~60s to wake. The client retries once. */
export const API_FETCH_TIMEOUT_MS = 90_000;
