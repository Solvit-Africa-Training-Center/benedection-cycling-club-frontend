/**
 * Shared domain types for the admin prototype.
 *
 * These mirror the shape we expect from the Django API. When the backend lands,
 * only `api.ts` changes - screens and forms keep importing these types.
 */

export type UserRole = "admin" | "editor";

export type CyclistCategory = "men" | "women" | "junior";

export type NewsStatus = "draft" | "published";

/** Value used by the "status" filter in list screens. */
export type EntityStatus = "all" | "published" | "draft" | "deleted";

export type Achievement = {
  id: string;
  year: number;
  event: string;
  result: string;
};

export type Cyclist = {
  id: string;
  slug: string;
  name: string;
  /** Free text on purpose: the club uses titles like "Climber", "Directeur Sportif". */
  role: string;
  category: CyclistCategory;
  /** ISO date (yyyy-mm-dd). Optional: the club has not verified birth dates yet. */
  dateOfBirth?: string;
  birthplace?: string;
  nationality: string;
  heightCm?: number;
  weightKg?: number;
  bio?: string;
  /** URL or data URL returned by `uploadImage`. */
  photo?: string;
  /** Max 4 images. */
  gallery: string[];
  achievements: Achievement[];
  /** Required before an under-18 rider can be published. */
  guardianConsent: boolean;
  published: boolean;
  order: number;
  updatedAt: string;
  /** Soft delete: set instead of removing the record, so an admin can restore it. */
  deletedAt?: string | null;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  order: number;
  published: boolean;
  updatedAt: string;
  deletedAt?: string | null;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags: string[];
  status: NewsStatus;
  /** ISO date. Never set while the article is a draft. */
  publishDate?: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

/** Query accepted by every `list()` call. */
export type ListQuery = {
  search?: string;
  status?: EntityStatus;
  category?: CyclistCategory | "all";
  page?: number;
  pageSize?: number;
  /** Column key understood by the resource's `sortValues` (e.g. "name", "updated"). */
  sort?: string;
  dir?: "asc" | "desc";
};

export type Paged<T> = {
  items: T[];
  total: number;
};

export type ActivityAction = "created" | "updated" | "deleted" | "restored";

export type ActivityEntry = {
  id: string;
  entity: "cyclists" | "staff" | "news";
  entityId: string;
  entityLabel: string;
  action: ActivityAction;
  actor: string;
  at: string;
};

/** Field-level validation messages, keyed by field name. */
export type FieldErrors = Record<string, string>;

/** Payload for create/update calls. */
export type Draft<T> = Partial<Omit<T, "id" | "updatedAt" | "deletedAt">>;

/** Generic resource contract: identical for cyclists, staff, news and future resources. */
export type AdminResource<T> = {
  list: (query?: ListQuery) => Promise<Paged<T>>;
  get: (id: string) => Promise<T>;
  create: (draft: Draft<T>) => Promise<T>;
  update: (id: string, draft: Draft<T>) => Promise<T>;
  /** Soft delete. */
  remove: (id: string) => Promise<{ id: string }>;
  /** Admin only: clears `deletedAt`. */
  restore: (id: string) => Promise<T>;
};
