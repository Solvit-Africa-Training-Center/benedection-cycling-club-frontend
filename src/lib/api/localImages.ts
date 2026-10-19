import fs from "fs";
import path from "path";
import { personKey } from "./mappers";

type IndexedPhoto = { key: string; src: string };

let riderPhotos: IndexedPhoto[] | undefined;
let staffPhotos: IndexedPhoto[] | undefined;

function token(value: string): string {
  return value === "daddy" ? "dady" : value;
}

function indexFolder(folder: string, urlPrefix: string): IndexedPhoto[] {
  const directory = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).flatMap((name) => {
    const fullPath = path.join(directory, name);
    if (!fs.statSync(fullPath).isFile()) return [];
    const stem = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
    return [{ key: personKey(stem).split(" ").map(token).join(" "), src: `${urlPrefix}/${encodeURIComponent(name)}` }];
  });
}

function photosFor(kind: "riders" | "staff"): IndexedPhoto[] {
  if (kind === "riders") {
    riderPhotos ??= indexFolder("images/team/riders", "/images/team/riders");
    return riderPhotos;
  }
  staffPhotos ??= indexFolder("images/team/staff", "/images/team/staff");
  return staffPhotos;
}

export function existingPublicImage(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const relative = value.startsWith("/") ? value.slice(1) : value;
  const decoded = relative.split("/").map((part) => decodeURIComponent(part)).join("/");
  return fs.existsSync(path.join(process.cwd(), "public", decoded)) ? value : undefined;
}

export function localPhotoFor(name: string, kind: "riders" | "staff", preferred?: string | null): string | undefined {
  const preferredImage = existingPublicImage(preferred);
  if (preferredImage) return preferredImage;

  const wanted = personKey(name).split(" ").map(token);
  return photosFor(kind).find((photo) => {
    const fileTokens = photo.key.split(" ").filter(Boolean);
    if (!fileTokens.length || fileTokens.some((part) => part === "team" || part === "hero" || part === "jersey")) {
      return false;
    }
    if (fileTokens.join(" ") === wanted.join(" ")) return true;
    if (fileTokens.length >= 2 && fileTokens.every((part) => wanted.includes(part))) return true;
    return fileTokens.length === 1 && wanted.includes(fileTokens[0]);
  })?.src;
}
