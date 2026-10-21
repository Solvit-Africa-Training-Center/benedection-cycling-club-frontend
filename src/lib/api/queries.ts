import { cache } from "react";
import { cyclists as staticCyclists } from "@/data/cyclists";
import { news as staticNews } from "@/data/news";
import { partners as staticPartners } from "@/data/partners";
import { mergeRaceCalendar, raceResults as staticResults, races as staticRaces } from "@/data/races";
import { staff as staticStaff } from "@/data/staff";
import { getRequestLang } from "@/lib/i18n/server";
import { apiGet, apiGetAllPages } from "./client";
import { getApiBaseUrl, resolveMediaUrl } from "./config";
import { existingPublicImage, localPhotoFor } from "./localImages";
import {
  mapCyclist,
  mapMilestone,
  mapNews,
  mapPartner,
  mapRace,
  mapShopCategory,
  mapShopProduct,
  mapStaff,
  mapTrophy,
  parseCyclistParam,
  personKey,
  type ShopProductView,
} from "./mappers";
import type {
  ClubOverview,
  ClubRaceDetail,
  ClubSponsor,
  ClubStaffApi,
  CyclistApi,
  CyclistDetailApi,
  ClubRace,
  NewsArticleApi,
  ShopCategory,
  ShopProductApi,
  LanguageCatalog,
  TeamMilestone,
  Trophy,
} from "./types";

export const FALLBACK_LANGUAGE_CATALOG: LanguageCatalog = {
  default: "en",
  active: "en",
  available: [
    { code: "en", name: "English", native_name: "English" },
    { code: "nl-BE", name: "Belgian Dutch", native_name: "Nederlands" },
  ],
  labels: {
    cyclist_category: { men: "Men", women: "Women", kids: "Kids" },
    staff_role: {
      mechanic: "Mechanic",
      logistic: "Logistic",
      coach: "Coach",
      representative: "Representative",
      team_manager: "Team manager",
      sports_director: "Sports director",
      assistant_sports_director: "Assistant sports director",
      soigneur: "Soigneur",
    },
    contact_kind: { phone: "Phone", email: "Email" },
  },
};

export const getLanguages = cache(async function getLanguages(): Promise<LanguageCatalog> {
  const catalog = await withFallback(
    "languages",
    () => apiGet<LanguageCatalog>("/api/club/languages/"),
    FALLBACK_LANGUAGE_CATALOG,
  );
  if (!catalog.available?.length || !catalog.labels) return FALLBACK_LANGUAGE_CATALOG;
  return catalog;
});

async function withFallback<T>(
  label: string,
  load: () => Promise<T>,
  fallback: T,
  isEmpty?: (value: T) => boolean,
): Promise<T> {
  if (!getApiBaseUrl()) return fallback;
  try {
    const value = await load();
    if (isEmpty?.(value)) return fallback;
    return value;
  } catch (error) {
    console.error(`[api] ${label} failed; using local sample data`, error);
    return fallback;
  }
}

function withRiderPhotos<T extends { name: string; image?: string; gallery?: string[] }>(
  rider: T,
  apiPhoto?: string | null,
): T {
  const apiImage = resolveMediaUrl(apiPhoto);
  const gallery = (rider.gallery ?? [])
    .map((src) => resolveMediaUrl(src) ?? existingPublicImage(src))
    .filter((src): src is string => Boolean(src));
  const image = apiImage || localPhotoFor(rider.name, "riders", rider.image);
  const tiles = apiImage ? [apiImage, ...gallery.filter((src) => src !== apiImage)] : gallery;
  return {
    ...rider,
    image,
    gallery: tiles.length ? tiles : image ? [image] : undefined,
  };
}

function byName<T extends { name: string }>(items: T[], name: string): T | undefined {
  const key = personKey(name);
  return items.find((item) => personKey(item.name) === key);
}

function localNewsFor(article: NewsArticleApi) {
  const slug = article.slug || "";
  const title = personKey(article.title);
  return staticNews.find((item) => (slug && item.slug === slug) || personKey(item.title) === title);
}

export const getClubOverview = cache(async function getClubOverview(): Promise<ClubOverview | null> {
  return withFallback("club", () => apiGet<ClubOverview>("/api/club/"), null);
});

export function findClubSection(
  sections: { slug: string; title: string; body: string }[] | undefined,
  keys: string[],
) {
  return sections?.find((section) =>
    keys.some((key) => {
      const needle = key.toLowerCase();
      return section.slug.toLowerCase().includes(needle) || section.title.toLowerCase().includes(needle);
    }),
  );
}

export async function getNewsArticles() {
  return withFallback(
    "news",
    async () => {
      const [rows, lang] = await Promise.all([
        apiGetAllPages<NewsArticleApi>("/api/news/"),
        getRequestLang(),
      ]);
      const locale = lang === "nl-BE" ? "nl-BE" : "en-GB";
      return rows.map((row, index) => mapNews(row, localNewsFor(row), index, locale));
    },
    staticNews,
    (rows) => rows.length === 0,
  );
}

export async function getNewsArticle(slug: string) {
  const local = staticNews.find((article) => article.slug === slug) ?? null;
  if (!getApiBaseUrl()) return local;
  try {
    const [article, lang] = await Promise.all([
      apiGet<NewsArticleApi>(`/api/news/${slug}/`),
      getRequestLang(),
    ]);
    const locale = lang === "nl-BE" ? "nl-BE" : "en-GB";
    return mapNews(article, localNewsFor(article) ?? local ?? undefined, 0, locale);
  } catch (error) {
    console.error("[api] news detail failed", error);
    return local;
  }
}

export async function getPartners() {
  return withFallback(
    "partners",
    async () => {
      const rows = await apiGetAllPages<ClubSponsor>("/api/partners/");
      return rows.map((row) => mapPartner(row, byName(staticPartners, row.name)));
    },
    staticPartners,
    (rows) => rows.length === 0,
  );
}

export async function getRaces() {
  return withFallback(
    "races",
    async () => {
      const rows = await apiGetAllPages<ClubRace>("/api/races/", { page_size: 100 });
      return mergeRaceCalendar(rows.map(mapRace));
    },
    staticRaces,
    (rows) => rows.length === 0,
  );
}

export async function getRaceDetail(id: number) {
  if (!getApiBaseUrl()) return null;
  try {
    return await apiGet<ClubRaceDetail>(`/api/races/${id}/`);
  } catch (error) {
    console.error("[api] race detail failed", error);
    return null;
  }
}

export async function getMilestones() {
  return withFallback(
    "milestones",
    async () => {
      const rows = await apiGetAllPages<TeamMilestone>("/api/races/milestones/");
      return rows.map(mapMilestone);
    },
    [] as ReturnType<typeof mapMilestone>[],
  );
}

export async function getTrophies() {
  return withFallback(
    "trophies",
    async () => {
      const rows = await apiGetAllPages<Trophy>("/api/races/trophies/");
      return rows.map(mapTrophy);
    },
    staticResults,
    (rows) => rows.length === 0,
  );
}

export async function getCyclists() {
  return withFallback(
    "cyclists",
    async () => {
      const rows = await apiGetAllPages<CyclistApi>("/api/team/cyclists/");
      const languages = await getLanguages();
      return rows.map((row) =>
        withRiderPhotos(
          mapCyclist(row, undefined, byName(staticCyclists, row.name), languages.labels),
          row.photo,
        ),
      );
    },
    staticCyclists,
    (rows) => rows.length === 0,
  );
}

export async function getCyclist(param: string) {
  const { id, slug } = parseCyclistParam(param);
  const wanted = personKey(param.replace(/^\d+-/, "").replace(/-/g, " "));
  if (getApiBaseUrl() && id !== undefined) {
    try {
      const [detail, languages] = await Promise.all([
        apiGet<CyclistDetailApi>(`/api/team/cyclists/${id}/`),
        getLanguages(),
      ]);
      return withRiderPhotos(
        mapCyclist(detail, detail, byName(staticCyclists, detail.name), languages.labels),
        detail.photo,
      );
    } catch (error) {
      console.error("[api] cyclist detail failed", error);
    }
  }
  const list = await getCyclists();
  return (
    list.find(
      (cyclist) =>
        cyclist.slug === slug ||
        cyclist.slug === param ||
        personKey(cyclist.name) === wanted,
    ) ?? null
  );
}

export async function getStaff() {
  return withFallback(
    "staff",
    async () => {
      const [rows, languages] = await Promise.all([
        apiGetAllPages<ClubStaffApi>("/api/team/staff/"),
        getLanguages(),
      ]);
      return rows.map((row) => {
        const member = mapStaff(row, byName(staticStaff, row.name), languages.labels.staff_role);
        return {
          ...member,
          image: resolveMediaUrl(row.photo) || localPhotoFor(member.name, "staff", member.image),
        };
      });
    },
    staticStaff,
    (rows) => rows.length === 0,
  );
}

export function winsByRoster(
  trophies: { cyclistId?: number; place: number }[],
  cyclists: { id?: string; category: "men" | "women" | "junior" | "ALL PERSONNEL" }[],
) {
  const categoryById = new Map(
    cyclists
      .filter((cyclist) => cyclist.id)
      .map((cyclist) => [Number(cyclist.id), cyclist.category] as const),
  );
  const wins = { men: 0, women: 0, junior: 0 };
  for (const trophy of trophies) {
    if (trophy.place !== 1 || trophy.cyclistId === undefined) continue;
    const category = categoryById.get(trophy.cyclistId);
    if (category === "men" || category === "women" || category === "junior") {
      wins[category] += 1;
    }
  }
  return [
    { value: wins.men, label: "Wins by Benediction Club Men team", roster: "men" as const },
    { value: wins.women, label: "Wins by Benediction Club Women team", roster: "women" as const },
    { value: wins.junior, label: "Wins by Benediction Club Junior team", roster: "junior" as const },
  ];
}

export async function getShopCatalog(): Promise<{
  products: ShopProductView[];
  categories: { name: string; slug: string }[];
}> {
  return withFallback(
    "shop",
    async () => {
      const [products, categories] = await Promise.all([
        apiGetAllPages<ShopProductApi>("/api/shop/products/"),
        apiGetAllPages<ShopCategory>("/api/shop/categories/"),
      ]);
      return {
        products: products.map(mapShopProduct),
        categories: categories.map(mapShopCategory),
      };
    },
    { products: [], categories: [] },
  );
}
