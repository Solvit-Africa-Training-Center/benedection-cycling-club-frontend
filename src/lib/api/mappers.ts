import type { NewsArticle } from "@/data/news";
import type { Cyclist, RiderCategory, RiderQA } from "@/data/cyclists";
import type { Partner } from "@/data/partners";
import type { Race, RaceResult, Team } from "@/data/races";
import type { StaffMember } from "@/data/staff";
import { resolveMediaUrl } from "./config";
import type {
  ClubStaffApi,
  CyclistApi,
  CyclistCategoryApi,
  CyclistDetailApi,
  ClubRace,
  ClubSponsor,
  NewsArticleApi,
  LanguageLabels,
  ShopCategory,
  ShopProductApi,
  StaffRoleApi,
  TeamMilestone,
  Trophy,
} from "./types";

export type ShopProductView = {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  categorySlug: string;
  image: string;
  sizes: string[];
  description: string;
  stock?: number;
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cyclistHref(cyclist: Pick<CyclistApi, "id" | "name">): string {
  const nameSlug = slugify(cyclist.name);
  return nameSlug ? `${cyclist.id}-${nameSlug}` : String(cyclist.id);
}

export function parseCyclistParam(param: string): { id?: number; slug: string } {
  const match = param.match(/^(\d+)(?:-.*)?$/);
  if (match) return { id: Number(match[1]), slug: param };
  return { slug: param };
}

function excerptFromBody(body: string, max = 180): string {
  const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function formatDate(iso?: string | null, locale = "en-GB"): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const NEWS_PLACEHOLDERS = ["/news1.jpeg", "/news2.jpeg", "/news3.jpeg", "/news4.jpeg", "/news5.jpeg"];

export function personKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

function filled(value?: string | null): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

export function mapNews(
  article: NewsArticleApi,
  local?: NewsArticle,
  index = 0,
  locale = "en-GB",
): NewsArticle {
  const slug = article.slug || slugify(article.title) || String(article.id);
  const body = filled(article.body);
  const paragraphs = body
    ? body
        .split(/\n{2,}/)
        .map((part) => part.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
        .filter(Boolean)
    : [];
  return {
    slug,
    category: "",
    title: article.title,
    excerpt: body ? excerptFromBody(body) : "",
    date: article.published_at ? formatDate(article.published_at, locale) : "",
    image: resolveMediaUrl(article.cover_image) || local?.image || NEWS_PLACEHOLDERS[(article.id || index) % NEWS_PLACEHOLDERS.length],
    position: local?.position,
    content: paragraphs,
  };
}

export function mapPartner(sponsor: ClubSponsor, local?: Partner): Partner {
  const initials = sponsor.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  const summary = filled(sponsor.short_description);
  const lead = summary?.split(". ")[0];
  const website = filled(sponsor.website_url);
  return {
    name: sponsor.name,
    specialization: lead || "",
    description: summary || "",
    website,
    websiteLabel: undefined,
    mark: local?.mark || initials || "P",
    logo: resolveMediaUrl(sponsor.logo) || local?.logo,
    featured: local?.featured,
  };
}

function raceTeam(raceType?: string): Team {
  const value = (raceType ?? "").toLowerCase();
  if (/(women|vrouwen|dames)/.test(value)) return "women";
  if (/(junior|jeugd|kids|u-19|u19)/.test(value)) return "junior";
  if (/(mannen|heren|\bmen\b)/.test(value)) return "men";
  return "all";
}

export function mapRace(race: ClubRace): Race {
  return {
    id: String(race.id),
    name: race.name,
    startDate: filled(race.start_date),
    endDate: filled(race.end_date),
    seasonYear: race.season_year ?? undefined,
    location: filled(race.location) || "",
    team: raceTeam(race.race_type),
  };
}

export function mapTrophy(trophy: Trophy): RaceResult {
  return {
    place: trophy.finishing_position ?? 0,
    riderSlug: `${trophy.cyclist}-${slugify(trophy.cyclist_name)}`,
    riderName: trophy.cyclist_name,
    cyclistId: trophy.cyclist,
    race: trophy.race_name,
    time: trophy.result_time || trophy.award || trophy.classification || "—",
  };
}

export function mapMilestone(milestone: TeamMilestone) {
  return {
    tag: milestone.is_confirmed ? "confirmed" : "milestone",
    year: String(milestone.year),
    title: milestone.event_name,
    text: milestone.summary,
    achievement: milestone.is_confirmed ? "confirmed" : "pending",
    yearClass: "text-brand-lime",
    achievementClass: "text-gray-400",
    current: milestone.year >= new Date().getFullYear() - 1,
  };
}

const STAFF_LABELS: Record<StaffRoleApi, string> = {
  mechanic: "Mechanic",
  logistic: "Logistics",
  coach: "Coach",
  representative: "Representative",
  team_manager: "Team manager",
  sports_director: "Sports director",
  assistant_sports_director: "Assistant sports director",
  soigneur: "Soigneur",
};

export function mapStaff(
  member: ClubStaffApi,
  local?: StaffMember,
  roleLabels?: Record<string, string>,
): StaffMember {
  const role = roleLabels?.[member.staff_role] || STAFF_LABELS[member.staff_role] || member.staff_role;
  const about = filled(member.about);
  const aboutKey = about ? personKey(about.replace(/\.+$/, "")) : "";
  const aboutRestatesRole = Boolean(
    aboutKey &&
      [
        role,
        STAFF_LABELS[member.staff_role],
        member.staff_role.replaceAll("_", " "),
      ].some((value) => value && personKey(value) === aboutKey),
  );
  return {
    name: member.name,
    role,
    country: filled(member.nationality) || local?.country || "",
    image: resolveMediaUrl(member.photo) || local?.image,
    description: about && !aboutRestatesRole ? about : undefined,
  };
}

function mapCategory(category: CyclistCategoryApi): RiderCategory {
  return category === "kids" ? "junior" : category;
}

const CATEGORY_LABEL: Record<RiderCategory, string> = {
  men: "Men",
  women: "Women",
  junior: "Junior",
  "ALL PERSONNEL": "Cyclist",
};

function formatMeasure(value?: string | null, unit?: string): string | undefined {
  if (!value) return undefined;
  const number = Number(value);
  if (Number.isNaN(number)) return `${value}${unit ?? ""}`;
  return unit ? `${number}${unit}` : String(number);
}

function qaFromCyclist(cyclist: CyclistApi): RiderQA[] | undefined {
  const favoriteFood = filled(cyclist.favorite_food);
  return favoriteFood ? [{ question: "favorite_food", answer: favoriteFood }] : undefined;
}

function looksLikeResultLine(line: string): boolean {
  return /^(winner\b|stage winner\b|two stage wins\b|three \d|rwanda national champion\b|\d+(st|nd|rd|th)\b)/i.test(line);
}

/** The API stores a "Top results:" list inside `about`. Pull it out so the bio and career highlights are not the same block. */
function splitAbout(about?: string): { narrative?: string; highlights: string[] } {
  if (!about) return { highlights: [] };
  const narrative: string[] = [];
  const highlights: string[] = [];
  let inHighlights = false;

  for (const line of about.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    const heading = line.match(/^(top results|topresultaten|beste resultaten):\s*(.*)$/i);
    if (heading) {
      inHighlights = true;
      if (heading[2]) highlights.push(heading[2].replace(/\.$/, ""));
      continue;
    }
    if (inHighlights || looksLikeResultLine(line)) {
      highlights.push(line.replace(/\.$/, ""));
      continue;
    }
    narrative.push(line);
  }

  const text = narrative.join("\n\n");
  return { narrative: text || undefined, highlights };
}

function resultsFromDetail(detail?: CyclistDetailApi): string[] | undefined {
  if (!detail?.results?.length) return undefined;
  return detail.results.map((result) => {
    const place = result.award
      || (result.finishing_position ? `${result.finishing_position}` : "")
      || result.classification
      || "";
    const classification = result.classification && result.classification !== result.award
      ? result.classification
      : "";
    const time = result.result_time ? result.result_time : "";
    const bits = [place, result.race_name, classification, result.start_date, time].filter(Boolean);
    return bits.join(", ");
  });
}

function isThinBio(text?: string): boolean {
  const value = text?.trim();
  if (!value) return true;
  if (/^born in\b/i.test(value) && value.length < 80) return true;
  if (/^listed in\b/i.test(value)) return true;
  return looksLikeResultLine(value) && value.length < 120;
}

function localParagraph(local?: Cyclist): string | undefined {
  const bio = filled(local?.bio);
  if (bio && !isThinBio(bio)) return bio;
  const description = filled(local?.description);
  if (description && /cyclist from/i.test(description)) return description;
  if (description && description.length > 80 && /[.!?]/.test(description)) return description;
  return undefined;
}

function usableLocalTitle(title?: string): string | undefined {
  if (!title) return undefined;
  if (/[•]|first team|academy|development|junior\s*•/i.test(title)) return undefined;
  return title;
}

export function mapCyclist(
  cyclist: CyclistApi,
  detail?: CyclistDetailApi,
  local?: Cyclist,
  labels?: LanguageLabels,
): Cyclist {
  const source = detail ?? cyclist;
  const photo = resolveMediaUrl(source.photo) || local?.image;
  const about = filled(source.about);
  const { narrative, highlights } = splitAbout(about);
  const position = filled(source.position);
  const categoryLabel =
    labels?.cyclist_category[source.category] || CATEGORY_LABEL[mapCategory(source.category)];
  const role = position || categoryLabel;
  const detailResults = resultsFromDetail(detail);
  const topResults = highlights.length ? highlights : detailResults;
  const bio = !isThinBio(narrative) ? narrative : localParagraph(local);
  return {
    id: String(source.id),
    slug: cyclistHref(source),
    name: source.name,
    role,
    category: mapCategory(source.category),
    country: filled(source.nationality) || local?.country,
    age: source.age ?? local?.age,
    birthplace: filled(source.birth_place) || local?.birthplace,
    height: formatMeasure(source.height_cm, "cm") || local?.height,
    weight: formatMeasure(source.weight_kg, "kg") || local?.weight,
    discipline: filled(source.bps),
    team: "Benediction Cycling Club",
    title: position || usableLocalTitle(local?.title),
    bio,
    description: bio,
    topResults,
    image: photo,
    gallery: local?.gallery?.length ? local.gallery : photo ? [photo] : undefined,
    qa: qaFromCyclist(source),
  };
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

const SHOP_IMAGES: { match: string; image: string }[] = [
  { match: "jersey", image: "/jersey.png" },
  { match: "trui", image: "/jersey.png" },
  { match: "bib-short", image: "/short.png" },
  { match: "short", image: "/short.png" },
  { match: "broek", image: "/short.png" },
  { match: "sunglass", image: "/glasses.jpg" },
  { match: "cycling-glass", image: "/glasses.jpg" },
  { match: "glass", image: "/glasses.jpg" },
  { match: "bril", image: "/glasses.jpg" },
  { match: "glove", image: "/gloves.jpg" },
  { match: "handschoen", image: "/gloves.jpg" },
  { match: "sock", image: "/socks.jpg" },
  { match: "sok", image: "/socks.jpg" },
  { match: "helmet", image: "/helmet.jpg" },
  { match: "helm", image: "/helmet.jpg" },
];

function localShopImage(product: ShopProductApi): string {
  const haystack = [product.slug, product.category?.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return SHOP_IMAGES.find((item) => haystack.includes(item.match))?.image || "/jersey.png";
}

export function mapShopProduct(product: ShopProductApi): ShopProductView {
  const photos = Array.isArray(product.photos) ? product.photos : [];
  const photo = [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
  const categoryName = product.category?.name || "";
  const categorySlug = product.category?.slug || slugify(categoryName);
  return {
    id: product.id,
    slug: product.slug || `product-${product.id}`,
    name: product.name,
    price: Number(product.price),
    currency: product.currency || "USD",
    category: categoryName,
    categorySlug,
    image: resolveMediaUrl(photo?.image) || localShopImage(product),
    sizes: DEFAULT_SIZES,
    description: filled(product.description) || "",
    stock: product.stock,
  };
}

export function mapShopCategory(category: ShopCategory): { name: string; slug: string } {
  return {
    name: category.name,
    slug: category.slug || slugify(category.name),
  };
}
