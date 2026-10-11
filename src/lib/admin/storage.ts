import { cyclists as seedCyclists } from "@/data/cyclists";
import { staff as seedStaff } from "@/data/staff";
import type { ActivityEntry, Cyclist, NewsArticle, StaffMember } from "./types";
import { createId, nowIso } from "./utils";

/**
 * Every localStorage read/write in the admin prototype goes through this file.
 *
 * Demo only. When Django arrives, `api.ts` swaps these calls for `fetch`, and
 * this module (plus the seed data below) can be deleted.
 */

/** Bump when the stored shape changes: old data is discarded instead of crashing the UI. */
export const STORAGE_VERSION = 1;
export const STORAGE_KEY = `bcc.admin.v${STORAGE_VERSION}`;

export const DEFAULT_PAGE_SIZE = 10;

/** Keeps the activity log from growing without bound. */
export const ACTIVITY_LIMIT = 40;

export type AdminStore = {
  version: number;
  cyclists: Cyclist[];
  staff: StaffMember[];
  news: NewsArticle[];
  activity: ActivityEntry[];
};

const QUOTA_MESSAGE =
  "This browser is out of local storage space, so the change could not be saved. " +
  "Delete a few photos or records and try again.";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * `true` when the browser is telling us the ~5 MB localStorage quota is full.
 * Older Safari throws a legacy DOMException with code 22 instead.
 */
function isQuotaError(error: unknown): boolean {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22
    );
  }
  return error instanceof Error && error.name === "QuotaExceededError";
}

function storageError(error: unknown): Error {
  if (isQuotaError(error)) return new Error(QUOTA_MESSAGE);
  return new Error("This browser blocked access to local storage, so nothing can be saved.");
}

/** Seeds the public roster data into admin records. */
function seedCyclistRecords(): Cyclist[] {
  return seedCyclists.map((rider, index) => ({
    id: rider.id,
    slug: rider.slug,
    name: rider.name,
    role: rider.role,
    category: rider.category,
    // Deliberately left empty: the club has not verified any birth dates and the
    // public data file only stores a pre-computed `age`, which we must not turn
    // into an invented date of birth. `hometown` is also not carried over as
    // `birthplace` for the same reason.
    dateOfBirth: undefined,
    birthplace: undefined,
    nationality: rider.country,
    heightCm: rider.heightCm,
    weightKg: rider.weightKg,
    bio: rider.bio ?? rider.description,
    photo: rider.image,
    gallery: (rider.gallery ?? []).slice(0, 4),
    achievements: (rider.highlights ?? [])
      // Skip placeholders such as "Year TBC" rather than inventing a year.
      .filter((highlight) => Number.isFinite(Number(highlight.year)))
      .map((highlight) => ({
        id: createId("ach"),
        year: Number(highlight.year),
        event: highlight.event,
        result: highlight.result,
      })),
    guardianConsent: false,
    published: true,
    order: index + 1,
    updatedAt: nowIso(),
    deletedAt: null,
  }));
}

function seedStaffRecords(): StaffMember[] {
  return seedStaff.map((member, index) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.description,
    photo: member.image,
    order: index + 1,
    published: true,
    updatedAt: nowIso(),
    deletedAt: null,
  }));
}

/** Three sample articles so the news list is not empty on first run. */
function seedNewsRecords(): NewsArticle[] {
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const samples: Array<Omit<NewsArticle, "id" | "updatedAt">> = [
    {
      title: "Season opener: Rubavu circuit race",
      slug: "season-opener-rubavu-circuit-race",
      excerpt:
        "The club opens its season with a closed-circuit race on the Rubavu lakeside road, open to club members and invited guests.",
      body: [
        "Benediction Cycling Club opens the season with a closed-circuit race on the Rubavu lakeside road.",
        "",
        "Racing starts at 07:30 with the junior category, followed by the women's and men's fields. Spectators are welcome along the main straight, where the club will run a water point and a mechanical support tent.",
        "",
        "Registration closes 48 hours before the start. Members should bring their licence and a spare tube.",
      ].join("\n"),
      tags: ["racing", "club"],
      status: "published",
      publishDate: daysAgo(6),
      coverImage: undefined,
      deletedAt: null,
    },
    {
      title: "Junior squad: new training block begins",
      slug: "junior-squad-new-training-block-begins",
      excerpt:
        "Our under-18 riders start a twelve-week block focused on bike handling, group riding and recovery habits.",
      body: [
        "The junior squad begins a twelve-week training block built around bike handling, group riding and recovery.",
        "",
        "Sessions run twice a week with a coach-led skills clinic on Saturday mornings. Parents and guardians are invited to the first session, where the coaching team will also collect written guardian consent forms for every under-18 rider.",
      ].join("\n"),
      tags: ["junior", "training"],
      status: "published",
      publishDate: daysAgo(12),
      coverImage: undefined,
      deletedAt: null,
    },
    {
      title: "Volunteer call-out: race day marshals",
      slug: "volunteer-call-out-race-day-marshals",
      excerpt: "Draft note. We are looking for marshals and a photo team for the coming race weekends.",
      body: [
        "Draft: race weekends need marshals at each corner, a photo team, and two people on the feed station.",
        "",
        "Still to confirm with the organising committee: the number of corners, the meeting point, and whether lunch is provided.",
      ].join("\n"),
      tags: ["volunteers"],
      status: "draft",
      publishDate: undefined,
      coverImage: undefined,
      deletedAt: null,
    },
  ];

  return samples.map((sample) => ({
    ...sample,
    id: createId("news"),
    updatedAt: sample.publishDate ?? nowIso(),
  }));
}

/** A couple of activity rows so the dashboard "recent edits" panel is not empty. */
function seedActivity(): ActivityEntry[] {
  const riders = seedCyclistRecords();
  const staffMembers = seedStaffRecords();
  const at = new Date();
  at.setDate(at.getDate() - 1);

  return [
    {
      id: createId("act"),
      entity: "cyclists",
      entityId: riders[0]?.id ?? "",
      entityLabel: riders[0]?.name ?? "Rider",
      action: "updated",
      actor: "Club secretary",
      at: at.toISOString(),
    },
    {
      id: createId("act"),
      entity: "staff",
      entityId: staffMembers[0]?.id ?? "",
      entityLabel: staffMembers[0]?.name ?? "Staff member",
      action: "updated",
      actor: "Club secretary",
      at: at.toISOString(),
    },
  ];
}

export function createSeedStore(): AdminStore {
  return {
    version: STORAGE_VERSION,
    cyclists: seedCyclistRecords(),
    staff: seedStaffRecords(),
    news: seedNewsRecords(),
    activity: seedActivity(),
  };
}

/** Returns the store, seeding it on first use. Falls back to an in-memory seed if storage is blocked. */
export function readStore(): AdminStore {
  if (!isBrowser()) return createSeedStore();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createSeedStore();
      writeStore(seeded);
      return seeded;
    }

    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.cyclists)) {
      const seeded = createSeedStore();
      writeStore(seeded);
      return seeded;
    }

    return {
      version: STORAGE_VERSION,
      cyclists: parsed.cyclists ?? [],
      staff: parsed.staff ?? [],
      news: parsed.news ?? [],
      activity: parsed.activity ?? [],
    };
  } catch (error) {
    // Corrupt JSON: start over rather than showing a broken dashboard.
    if (error instanceof SyntaxError) {
      const seeded = createSeedStore();
      writeStore(seeded);
      return seeded;
    }
    return createSeedStore();
  }
}

/** Persists the whole store. Throws a friendly error when the quota is exceeded. */
export function writeStore(store: AdminStore): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    throw storageError(error);
  }
}

/**
 * Read-modify-write helper: every mutation in `api.ts` runs inside this so the
 * store is never written from a stale copy.
 */
export function mutateStore<T>(mutator: (store: AdminStore) => T): T {
  const store = readStore();
  const result = mutator(store);
  writeStore(store);
  return result;
}

/** Wipes the demo data (used by "reset demo data" in user settings). */
export function resetStore(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing useful to do if the browser refuses; the seeded fallback still works.
  }
}

export function pushActivity(entry: Omit<ActivityEntry, "id" | "at">): void {
  mutateStore((store) => {
    appendActivity(store, entry);
  });
}

/**
 * Appends to the activity log of a store you already hold.
 *
 * The api layer uses this instead of `pushActivity`, because calling
 * `pushActivity` inside another `mutateStore` would re-read the store from
 * localStorage (still missing the change being made), write it back, and then be
 * overwritten by the outer write - losing the log entry.
 */
export function appendActivity(store: AdminStore, entry: Omit<ActivityEntry, "id" | "at">): void {
  store.activity = [{ ...entry, id: createId("act"), at: nowIso() }, ...store.activity].slice(
    0,
    ACTIVITY_LIMIT,
  );
}
