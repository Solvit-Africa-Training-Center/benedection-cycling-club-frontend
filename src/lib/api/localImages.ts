import { personKey } from "./mappers";

type IndexedPhoto = { key: string; src: string };

/** Club image used when a rider has no portrait in the API or in /public. */
export const FALLBACK_RIDER_PHOTO = "/backgroundImage.jpeg";

const RIDER_FILES = [
  "/images/team/riders/diane-ingabire.jpg",
  "/images/team/riders/espoir-uhiriwe.jpg",
  "/images/team/riders/foeke-dubois.jpg",
  "/images/team/riders/glen-van-nuffelen.jpg",
  "/images/team/riders/jackson-nkurikiyinka.jpg",
  "/images/team/riders/jean-claude-niyomugabo.jpg",
  "/images/team/riders/jelle-roelandt.jpg",
  "/images/team/riders/noah-brits.jpg",
  "/images/team/riders/phocas-nshimiyimana.jpg",
  "/images/team/riders/sybren-nicolaides.jpg",
  "/images/team/gallery/foeke-dubois-1.jpg",
  "/images/team/gallery/jean-claude-niyomugabo-1.jpg",
  "/images/team/gallery/masengesho-vainqueur-4.jpg",
  "/images/team/gallery/mugisha-moise-4.jpg",
  "/images/team/gallery/phocas-nshimiyimana-1.jpg",
  "/images/team/gallery/sybren-nicolaides-1.jpg",
  "/images/team/gallery/uwiduhaye-mike-2.jpg",
  "/images/team/gallery/uwiduhaye-mike-4.jpg",
  "/images/team/gallery/valentine-nzayisenga-1.jpg",
];

const STAFF_FILES = [
  "/images/team/staff/benoit-munyakindi.jpg",
  "/images/team/staff/dady-bagabo.jpg",
  "/images/team/staff/innocent-uwamungu.jpg",
  "/images/team/staff/luc-van-nuffelen.jpg",
];

function token(value: string): string {
  return value === "daddy" ? "dady" : value;
}

function indexPaths(paths: string[]): IndexedPhoto[] {
  return paths.map((src) => {
    const stem = src.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") ?? "";
    return { key: personKey(stem).split(" ").map(token).join(" "), src };
  });
}

const riderPhotos = indexPaths(RIDER_FILES);
const staffPhotos = indexPaths(STAFF_FILES);

function photosFor(kind: "riders" | "staff"): IndexedPhoto[] {
  return kind === "riders" ? riderPhotos : staffPhotos;
}

/** Keep absolute URLs and site-root paths. Do not probe the filesystem — Vercel lambdas do not ship /public. */
export function existingPublicImage(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) return value;
  return `/${value}`;
}

export function localPhotoFor(name: string, kind: "riders" | "staff", preferred?: string | null): string | undefined {
  const known = photosFor(kind);
  const preferredImage = existingPublicImage(preferred);
  if (preferredImage && known.some((photo) => photo.src === preferredImage)) return preferredImage;

  const wanted = personKey(name).split(" ").map(token);
  return known.find((photo) => {
    const fileTokens = photo.key.split(" ").filter((part) => part && !/^\d+$/.test(part));
    if (!fileTokens.length || fileTokens.some((part) => part === "team" || part === "hero" || part === "jersey")) {
      return false;
    }
    if (fileTokens.join(" ") === wanted.join(" ")) return true;
    if (fileTokens.length >= 2 && fileTokens.every((part) => wanted.includes(part))) return true;
    return fileTokens.length === 1 && wanted.includes(fileTokens[0]);
  })?.src;
}
