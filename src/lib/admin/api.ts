import { ApiError } from "./errors";
import { DEFAULT_PAGE_SIZE, mutateStore, pushActivity, readStore } from "./storage";
import type {
  ActivityAction,
  ActivityEntry,
  AdminResource,
  Cyclist,
  Draft,
  EntityStatus,
  FieldErrors,
  ListQuery,
  NewsArticle,
  Paged,
  StaffMember,
} from "./types";
import { createId, nowIso, readFileAsDataUrl, sleep } from "./utils";
import { getCurrentUser, isAdmin } from "./auth";

/**
 * The single API layer for the admin prototype.
 *
 * Every function is async and shaped like the REST call it will become, so the
 * screens already handle loading and error states exactly as they will against
 * Django. Nothing below this file touches localStorage: that lives in
 * `storage.ts`, so swapping this file for `fetch` calls is the only step needed
 * to go live.
 */

/** Replace with fetch calls to the Django API. */
export const API_ENDPOINTS = {
  cyclists: "/api/v1/admin/cyclists/",
  staff: "/api/v1/admin/staff/",
  news: "/api/v1/admin/news/",
  uploads: "/api/v1/admin/uploads/",
  activity: "/api/v1/admin/activity/",
} as const;

/** Simulated network latency, so loading states are real. */
export const LATENCY_MS = 200;

/** Longest side, in pixels, of an uploaded image after browser-side resizing. */
export const IMAGE_MAX_WIDTH = 1200;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_JPEG_QUALITY = 0.8;

type EntityName = "cyclists" | "staff" | "news";

/** Validation hook for one resource. Returns field errors; an empty object means valid. */
type Validator<T> = (draft: Draft<T>, existing?: T) => FieldErrors;

type ResourceConfig<T> = {
  entity: EntityName;
  /** Human label used in messages and activity entries, e.g. "cyclist". */
  label: string;
  validate: Validator<T>;
  /** Free-text fields searched by `list()`. */
  searchFields: (item: T) => Array<string | undefined>;
  /** Sortable column keys exposed to the UI. */
  sortValues: (item: T) => Record<string, string | number>;
  /** Publish state, used by the status filter. */
  statusOf: (item: T) => "published" | "draft";
  categoryOf?: (item: T) => string;
  /** Column used when the caller passes no `sort`. Defaults to display order. */
  defaultSort?: string;
};

function requireActor(): string {
  return getCurrentUser()?.name ?? "Someone";
}

/** Soft delete and restore are admin-only. */
function requireAdmin(action: string): void {
  const user = getCurrentUser();
  if (!user) throw new ApiError(401, "Your session has expired. Please sign in again.");
  if (!isAdmin(user)) {
    throw new ApiError(403, `Only an administrator can ${action}.`);
  }
}

function applyQuery<T extends { id: string; order?: number; deletedAt?: string | null }>(
  items: T[],
  query: ListQuery,
  config: ResourceConfig<T>,
): Paged<T> {
  const search = query.search?.trim().toLowerCase() ?? "";
  const status: EntityStatus = query.status ?? "all";
  const category = query.category ?? "all";

  const filtered = items.filter((item) => {
    const isDeleted = Boolean(item.deletedAt);

    // Soft-deleted rows stay hidden from every normal list.
    if (status === "deleted") {
      if (!isDeleted) return false;
    } else if (isDeleted) {
      return false;
    }

    if (status === "published" && config.statusOf(item) !== "published") return false;
    if (status === "draft" && config.statusOf(item) !== "draft") return false;
    if (category !== "all" && config.categoryOf?.(item) !== category) return false;

    if (search) {
      const haystack = config
        .searchFields(item)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  const sortKey = query.sort ?? config.defaultSort;
  const direction = query.dir === "desc" ? -1 : 1;
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey && sortKey !== "order") {
      const left = config.sortValues(a)[sortKey];
      const right = config.sortValues(b)[sortKey];
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * direction;
      }
      return String(left ?? "").localeCompare(String(right ?? "")) * direction;
    }

    // Default order: the explicit display order, then the primary label.
    const leftLabel = config.searchFields(a)[0] ?? "";
    const rightLabel = config.searchFields(b)[0] ?? "";
    return ((a.order ?? 0) - (b.order ?? 0)) * direction || leftLabel.localeCompare(rightLabel);
  });

  const total = sorted.length;
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;

  return { items: sorted.slice(start, start + pageSize), total };
}


/**
 * Builds the six REST-shaped functions shared by every resource. Adding a new
 * resource later means calling this once - see the bottom of the file.
 */
function createResource<T extends { id: string; order?: number; deletedAt?: string | null }>(
  config: ResourceConfig<T>,
): AdminResource<T> {
  const { entity, label, validate } = config;

  return {
    async list(query: ListQuery = {}): Promise<Paged<T>> {
      await sleep(LATENCY_MS);
      return applyQuery(readStore()[entity] as unknown as T[], query, config);
    },

    async get(id: string): Promise<T> {
      await sleep(LATENCY_MS);
      const found = (readStore()[entity] as unknown as T[]).find((item) => item.id === id);
      if (!found) throw new ApiError(404, `That ${label} no longer exists.`);
      return found;
    },

    async create(draft: Draft<T>): Promise<T> {
      await sleep(LATENCY_MS);
      const fieldErrors = validate(draft);
      if (Object.keys(fieldErrors).length > 0) {
        throw new ApiError(422, "Please fix the highlighted fields and save again.", fieldErrors);
      }

      return mutateStore((store) => {
        const rows = store[entity] as unknown as T[];
        const record = {
          ...draft,
          id: createId(entity.slice(0, 3)),
          updatedAt: nowIso(),
          deletedAt: null,
        } as unknown as T;
        rows.push(record);

        pushActivity({
          entity,
          entityId: record.id,
          entityLabel: config.searchFields(record)[0] ?? label,
          action: "created" satisfies ActivityAction,
          actor: requireActor(),
        });

        return record;
      });
    },

    async update(id: string, draft: Draft<T>): Promise<T> {
      await sleep(LATENCY_MS);
      const existing = (readStore()[entity] as unknown as T[]).find((item) => item.id === id);
      if (!existing) throw new ApiError(404, `That ${label} no longer exists.`);

      // Validate the merged record, not just the patch: a PATCH that only sends
      // `{ published: true }` must still be checked against the fields it did not
      // touch, exactly like a Django serializer would.
      const merged = { ...existing, ...draft };
      const fieldErrors = validate(merged, existing);
      if (Object.keys(fieldErrors).length > 0) {
        throw new ApiError(422, "Please fix the highlighted fields and save again.", fieldErrors);
      }

      return mutateStore((current) => {
        const rows = current[entity] as unknown as T[];
        const index = rows.findIndex((item) => item.id === id);
        if (index === -1) throw new ApiError(404, `That ${label} no longer exists.`);

        const record = { ...rows[index], ...draft, id, updatedAt: nowIso() } as T;
        rows[index] = record;

        pushActivity({
          entity,
          entityId: record.id,
          entityLabel: config.searchFields(record)[0] ?? label,
          action: "updated" satisfies ActivityAction,
          actor: requireActor(),
        });

        return record;
      });
    },

    /** Soft delete: the row stays in storage so an admin can restore it. */
    async remove(id: string): Promise<{ id: string }> {
      await sleep(LATENCY_MS);
      requireAdmin(`delete this ${label}`);

      return mutateStore((store) => {
        const rows = store[entity] as unknown as T[];
        const index = rows.findIndex((item) => item.id === id);
        if (index === -1) throw new ApiError(404, `That ${label} no longer exists.`);
        if (rows[index].deletedAt) throw new ApiError(409, `That ${label} is already deleted.`);

        const updated = { ...rows[index], deletedAt: nowIso(), updatedAt: nowIso() };
        rows[index] = updated;

        pushActivity({
          entity,
          entityId: id,
          entityLabel: config.searchFields(updated)[0] ?? label,
          action: "deleted" satisfies ActivityAction,
          actor: requireActor(),
        });

        return { id };
      });
    },

    async restore(id: string): Promise<T> {
      await sleep(LATENCY_MS);
      requireAdmin(`restore this ${label}`);

      return mutateStore((store) => {
        const rows = store[entity] as unknown as T[];
        const index = rows.findIndex((item) => item.id === id);
        if (index === -1) throw new ApiError(404, `That ${label} no longer exists.`);

        const updated = { ...rows[index], deletedAt: null, updatedAt: nowIso() };
        rows[index] = updated;

        pushActivity({
          entity,
          entityId: id,
          entityLabel: config.searchFields(updated)[0] ?? label,
          action: "restored" satisfies ActivityAction,
          actor: requireActor(),
        });

        return updated;
      });
    },
  };
}


/** The current calendar year, so achievement validation never goes stale. */
const CURRENT_YEAR = new Date().getFullYear();
const MIN_ACHIEVEMENT_YEAR = 1990;

/** Slug rules shared by cyclists and staff: format first, then uniqueness. */
function slugErrors(rows: Array<{ id: string; slug: string }>, slug: string, existingId?: string) {
  const value = slug.trim();
  if (!value) return "A slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return "Use lowercase letters, numbers and single hyphens only.";
  }
  if (rows.some((row) => row.slug === value && row.id !== existingId)) {
    return "This slug is already used by another record.";
  }
  return undefined;
}

function validateCyclist(draft: Draft<Cyclist>, existing?: Cyclist): FieldErrors {
  const errors: FieldErrors = {};

  if (!draft.name?.trim()) errors.name = "Enter the rider's full name.";

  const slugError = slugErrors(
    readStore().cyclists,
    draft.slug ?? existing?.slug ?? "",
    existing?.id,
  );
  if (slugError) errors.slug = slugError;

  if (!draft.nationality?.trim()) errors.nationality = "Enter a nationality.";

  if (draft.heightCm !== undefined && draft.heightCm !== null) {
    if (Number.isNaN(draft.heightCm) || draft.heightCm < 100 || draft.heightCm > 250) {
      errors.heightCm = "Height must be between 100 and 250 cm.";
    }
  }

  if (draft.weightKg !== undefined && draft.weightKg !== null) {
    if (Number.isNaN(draft.weightKg) || draft.weightKg < 30 || draft.weightKg > 150) {
      errors.weightKg = "Weight must be between 30 and 150 kg.";
    }
  }

  if (draft.dateOfBirth) {
    const dob = new Date(draft.dateOfBirth);
    if (Number.isNaN(dob.getTime()) || dob.getTime() > Date.now()) {
      errors.dateOfBirth = "Enter a valid date of birth that is not in the future.";
    }
  }

  if ((draft.gallery?.length ?? 0) > 4) {
    errors.gallery = "A rider can have at most 4 gallery photos.";
  }

  (draft.achievements ?? []).forEach((achievement, index) => {
    if (!achievement.event.trim() || !achievement.result.trim()) {
      errors[`achievements.${index}`] = "Add both an event and a result.";
    }
    const year = Number(achievement.year);
    if (!Number.isFinite(year) || year < MIN_ACHIEVEMENT_YEAR || year > CURRENT_YEAR) {
      errors[`achievements.${index}.year`] =
        `Year must be between ${MIN_ACHIEVEMENT_YEAR} and ${CURRENT_YEAR}.`;
    }
  });

  // Under-18 riders may not go live without written guardian consent.
  const isJunior = (draft.category ?? existing?.category) === "junior";
  const wantsPublish = draft.published ?? existing?.published ?? false;
  const consent = draft.guardianConsent ?? existing?.guardianConsent ?? false;
  if (isJunior && wantsPublish && !consent) {
    errors.guardianConsent =
      "Under-18 rider: written guardian consent is required before publishing.";
  }

  return errors;
}

function validateStaff(draft: Draft<StaffMember>): FieldErrors {
  const errors: FieldErrors = {};
  if (!draft.name?.trim()) errors.name = "Enter the staff member's name.";
  if (!draft.role?.trim()) errors.role = "Enter a role or job title.";
  return errors;
}

function validateNews(draft: Draft<NewsArticle>, existing?: NewsArticle): FieldErrors {
  const errors: FieldErrors = {};

  if (!draft.title?.trim()) errors.title = "Enter a headline.";

  const slug = (draft.slug ?? existing?.slug ?? "").trim();
  if (!slug) {
    errors.slug = "A slug is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Use lowercase letters, numbers and single hyphens only.";
  } else if (
    readStore().news.some((article) => article.slug === slug && article.id !== existing?.id)
  ) {
    errors.slug = "Another article already uses this slug.";
  }

  if (!draft.excerpt?.trim()) errors.excerpt = "Write a short excerpt.";
  if (!draft.body?.trim()) errors.body = "Write the article body.";

  // A draft must never look published: no publish date until the status changes.
  const status = draft.status ?? existing?.status ?? "draft";
  if (status === "published" && !(draft.publishDate ?? existing?.publishDate)) {
    errors.publishDate = "Choose a publish date before publishing.";
  }

  return errors;
}

export const cyclistsApi = createResource<Cyclist>({
  entity: "cyclists",
  label: "cyclist",
  validate: validateCyclist,
  searchFields: (item) => [item.name, item.role, item.nationality, item.bio],
  sortValues: (item) => ({
    name: item.name,
    role: item.role,
    category: item.category,
    updated: item.updatedAt,
    order: item.order,
  }),
  statusOf: (item) => (item.published ? "published" : "draft"),
  categoryOf: (item) => item.category,
});

export const staffApi = createResource<StaffMember>({
  entity: "staff",
  label: "staff member",
  validate: validateStaff,
  searchFields: (item) => [item.name, item.role, item.bio],
  sortValues: (item) => ({
    name: item.name,
    role: item.role,
    updated: item.updatedAt,
    order: item.order,
  }),
  statusOf: (item) => (item.published ? "published" : "draft"),
});

export const newsApi = createResource<NewsArticle>({
  entity: "news",
  label: "news article",
  validate: validateNews,
  searchFields: (item) => [item.title, item.excerpt, item.tags.join(" ")],
  sortValues: (item) => ({
    title: item.title,
    status: item.status,
    updated: item.updatedAt,
  }),
  statusOf: (item) => item.status,
  // News has no display order, so newest publish date first by default.
  defaultSort: "updated",
});


/**
 * Uploads one image and returns the URL to store on the record.
 *
 * The prototype keeps the data URL, which is what makes "saved only in this
 * browser" true. A real deployment POSTs to `API_ENDPOINTS.uploads` and stores
 * the CDN URL Django returns. Validation lives here so a bad file is rejected
 * the same way whether it is checked locally or server-side.
 */
export async function uploadImage(file: File): Promise<string> {
  await sleep(LATENCY_MS);

  if (!IMAGE_ACCEPTED_TYPES.includes(file.type as (typeof IMAGE_ACCEPTED_TYPES)[number])) {
    throw new ApiError(415, "Use a JPG, PNG or WebP image.", {
      image: "Use a JPG, PNG or WebP image.",
    });
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new ApiError(413, "That image is larger than 5 MB. Please choose a smaller file.", {
      image: "That image is larger than 5 MB.",
    });
  }

  const dataUrl = await readFileAsDataUrl(file);
  // Demo only: a real upload returns the storage URL from the backend.
  return dataUrl;
}

/** Recent edits for the dashboard, newest first. */
export async function listActivity(limit = 8): Promise<ActivityEntry[]> {
  await sleep(LATENCY_MS);
  return readStore()
    .activity.slice(0, limit)
    .map((entry) => ({ ...entry }));
}

/** Counts for the dashboard tiles. Published/total, excluding soft-deleted rows. */
export type DashboardCounts = {
  cyclists: { total: number; published: number };
  staff: { total: number; published: number };
  news: { total: number; published: number; drafts: number };
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  await sleep(LATENCY_MS);
  const store = readStore();

  const live = store.cyclists.filter((item) => !item.deletedAt);
  const liveStaff = store.staff.filter((item) => !item.deletedAt);
  const liveNews = store.news.filter((item) => !item.deletedAt);

  return {
    cyclists: {
      total: live.length,
      published: live.filter((item) => item.published).length,
    },
    staff: {
      total: liveStaff.length,
      published: liveStaff.filter((item) => item.published).length,
    },
    news: {
      total: liveNews.length,
      published: liveNews.filter((item) => item.status === "published").length,
      drafts: liveNews.filter((item) => item.status === "draft").length,
    },
  };
}

/**
 * To add a resource (products, partners, races...):
 *   1. add its type to `types.ts`;
 *   2. add an endpoint to `API_ENDPOINTS` above;
 *   3. call `createResource` here, exactly like `cyclistsApi`;
 *   4. build a list screen with `DataTable` and a form with the field components.
 * No other file needs to change.
 */
export const adminApi = {
  cyclists: cyclistsApi,
  staff: staffApi,
  news: newsApi,
  uploadImage,
  listActivity,
  getDashboardCounts,
};

