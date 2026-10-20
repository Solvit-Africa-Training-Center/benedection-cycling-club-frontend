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

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
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

export function mapNews(article: NewsArticleApi, local?: NewsArticle, index = 0): NewsArticle {
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
    category: local?.category || "News",
    title: article.title,
    excerpt: body ? excerptFromBody(body) : local?.excerpt || "",
    date: article.published_at ? formatDate(article.published_at) : local?.date || "",
    image: resolveMediaUrl(article.cover_image) || local?.image || NEWS_PLACEHOLDERS[index % NEWS_PLACEHOLDERS.length],
    position: local?.position,
    content: paragraphs.length ? paragraphs : local?.content,
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
  const website = filled(sponsor.website_url) || local?.website;
  return {
    name: sponsor.name,
    specialization: lead || local?.specialization || "Club partner",
    description: summary || local?.description || "",
    website,
    websiteLabel: website ? local?.websiteLabel || `Visit ${sponsor.name}` : undefined,
    mark: local?.mark || initials || "P",
    logo: resolveMediaUrl(sponsor.logo) || local?.logo,
    featured: local?.featured,
  };
}

function raceTeam(raceType?: string): Team {
  const value = (raceType ?? "").toLowerCase();
  if (value.includes("women")) return "women";
  if (value.includes("junior") || value.includes("kid") || value.includes("u-19") || value.includes("u19")) {
    return "junior";
  }
  if (value.includes("men")) return "men";
  return "all";
}

export function mapRace(race: ClubRace): Race {
  return {
    id: String(race.id),
    name: race.name,
    startDate: filled(race.start_date),
    endDate: filled(race.end_date),
    seasonYear: race.season_year ?? undefined,
    location: filled(race.location) || "TBC",
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
    tag: milestone.is_confirmed ? "Confirmed" : "Milestone",
    year: String(milestone.year),
    title: milestone.event_name,
    text: milestone.summary,
    achievement: milestone.is_confirmed ? "Confirmed result" : "Pending confirmation",
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

export function mapStaff(member: ClubStaffApi, local?: StaffMember): StaffMember {
  const role = STAFF_LABELS[member.staff_role] ?? member.staff_role;
  const about = filled(member.about);
  const aboutRestatesRole = about ? personKey(about.replace(/\.+$/, "")) === personKey(role) : false;
  return {
    name: member.name,
    role,
    country: filled(member.nationality) || local?.country || "",
    image: resolveMediaUrl(member.photo) || local?.image,
    description: about && !aboutRestatesRole ? about : local?.description,
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

function usableLocalRole(role: string | undefined, cyclist: CyclistApi): string | undefined {
  if (!role) return undefined;
  const embeddedAge = role.match(/age\s*(\d+)/i);
  if (embeddedAge && cyclist.age != null && Number(embeddedAge[1]) !== cyclist.age) return undefined;
  if (/junior/i.test(role) && cyclist.category !== "kids") return undefined;
  return role;
}

function formatMeasure(value?: string | null, unit?: string): string | undefined {
  if (!value) return undefined;
  const number = Number(value);
  if (Number.isNaN(number)) return `${value}${unit ?? ""}`;
  return unit ? `${number}${unit}` : String(number);
}

function qaFromCyclist(cyclist: CyclistApi, local?: RiderQA[]): RiderQA[] | undefined {
  const favoriteFood = filled(cyclist.favorite_food);
  const extras = (local ?? []).filter((item) => !/favorite food/i.test(item.question));
  const food = favoriteFood
    ? [{ question: "What is your favorite food?", answer: favoriteFood }]
    : [];
  const qa = [...food, ...extras];
  return qa.length ? qa : undefined;
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
    const heading = line.match(/^top results:\s*(.*)$/i);
    if (heading) {
      inHighlights = true;
      if (heading[1]) highlights.push(heading[1].replace(/\.$/, ""));
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

export function mapCyclist(cyclist: CyclistApi, detail?: CyclistDetailApi, local?: Cyclist): Cyclist {
  const source = detail ?? cyclist;
  const photo = resolveMediaUrl(source.photo) || local?.image;
  const about = filled(source.about);
  const { narrative, highlights } = splitAbout(about);
  const position = filled(source.position);
  const role = position || usableLocalRole(local?.role, source) || CATEGORY_LABEL[mapCategory(source.category)];
  const detailResults = resultsFromDetail(detail);
  const topResults = highlights.length
    ? highlights
    : detailResults ?? (about ? undefined : local?.topResults);
  const bio = narrative ?? (about ? undefined : local?.bio);
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
    discipline: filled(source.bps) || local?.discipline || "Road Cycling",
    team: local?.team || "Benediction Cycling Club",
    title: position || usableLocalRole(local?.title, source),
    bio,
    description: bio ?? (about ? undefined : local?.description),
    topResults,
    image: photo,
    gallery: local?.gallery?.length ? local.gallery : photo ? [photo] : undefined,
    qa: qaFromCyclist(source, local?.qa),
    quote: local?.quote,
  };
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

const SHOP_IMAGES: { match: string; image: string }[] = [
  { match: "jersey", image: "/jersey.png" },
  { match: "short", image: "/short.png" },
  { match: "glass", image: "/glasses.jpg" },
  { match: "glove", image: "/gloves.jpg" },
  { match: "sock", image: "/socks.jpg" },
  { match: "helmet", image: "/helmet.jpg" },
];

function localShopImage(name: string, category: string): string {
  const haystack = `${name} ${category}`.toLowerCase();
  return SHOP_IMAGES.find((item) => haystack.includes(item.match))?.image || "/jersey.png";
}

export function mapShopProduct(product: ShopProductApi): ShopProductView {
  const photos = Array.isArray(product.photos) ? product.photos : [];
  const photo = [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
  const categoryName = product.category?.name || "Kit";
  return {
    id: product.id,
    slug: product.slug || slugify(product.name) || String(product.id),
    name: product.name,
    price: Number(product.price),
    currency: product.currency || "USD",
    category: categoryName,
    categorySlug: product.category?.slug || slugify(categoryName),
    image: resolveMediaUrl(photo?.image) || localShopImage(product.name, categoryName),
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
