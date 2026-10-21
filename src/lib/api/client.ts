import { DEFAULT_LANG, type AppLang } from "@/lib/i18n/config";
import { API_FETCH_TIMEOUT_MS, API_REVALIDATE_SECONDS, getApiBaseUrl } from "./config";
import type { Paginated } from "./types";

async function requestLang(): Promise<AppLang> {
  try {
    const { getRequestLang } = await import("@/lib/i18n/server");
    return await getRequestLang();
  } catch {
    return DEFAULT_LANG;
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  if ("detail" in payload) return String((payload as { detail: unknown }).detail);
  const parts = Object.entries(payload as Record<string, unknown>).flatMap(([key, value]) => {
    if (key === "non_field_errors" || key === "error") {
      return [Array.isArray(value) ? value.join(" ") : String(value)];
    }
    const text = Array.isArray(value) ? value.join(" ") : String(value);
    return [`${key}: ${text}`];
  });
  return parts.filter(Boolean).join(" ") || fallback;
}

function joinUrl(base: string, path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const prefix = path.startsWith("/") ? "" : "/";
  return `${base}${prefix}${path}`;
}

function withQuery(url: string, query?: Record<string, string | number | undefined>): string {
  if (!query) return url;
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    parsed.searchParams.set(key, String(value));
  }
  return parsed.toString();
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "TimeoutError" || error.name === "AbortError" || error instanceof TypeError;
}

async function request(url: string, init: RequestInit): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
      });
      if (attempt === 0 && (response.status === 502 || response.status === 503 || response.status === 504)) {
        await response.arrayBuffer().catch(() => undefined);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt === 0 && isRetryableError(error)) continue;
      throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("API request failed");
}

export async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError("API_BASE_URL is not set", 503, path);
  }

  const lang = await requestLang();
  const url = withQuery(joinUrl(base, path), { ...query, lang });
  const response = await request(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
    next: { revalidate: API_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new ApiError(`GET ${url} failed with ${response.status}`, response.status, url);
  }

  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError("API_BASE_URL is not set", 503, path);
  }

  const lang = await requestLang();
  const url = withQuery(joinUrl(base, path), { lang });
  const response = await request(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(messageFromPayload(payload, `POST ${url} failed with ${response.status}`), response.status, url);
  }

  return payload as T;
}

function isPaginated<T>(value: unknown): value is Paginated<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "results" in value &&
    Array.isArray((value as Paginated<T>).results)
  );
}

export async function apiGetAllPages<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<T[]> {
  const first = await apiGet<Paginated<T> | T[]>(path, { page_size: 100, page: 1, ...query });
  if (Array.isArray(first)) return first;
  if (!isPaginated<T>(first)) return [];

  const items = [...first.results];
  let next = first.next;
  let guard = 0;
  while (next && guard < 50) {
    const page = await apiGet<Paginated<T>>(next);
    items.push(...page.results);
    next = page.next;
    guard += 1;
  }
  return items;
}
