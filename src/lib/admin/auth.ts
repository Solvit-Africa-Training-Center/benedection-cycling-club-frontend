import { ApiError } from "./errors";
import type { FieldErrors, User, UserRole } from "./types";
import { createId, sleep } from "./utils";

/**
 * Demo only. Real login must come from the backend (hashed passwords server-side,
 * secure cookies or tokens, 2FA).
 *
 * Everything here runs in the browser because this is a front-end prototype:
 * accounts live in localStorage and the session in sessionStorage. It is enough
 * to exercise the screens, and it must be deleted once Django ships auth.
 */

const ACCOUNTS_KEY = "bcc.admin.accounts.v1";
const SESSION_KEY = "bcc.admin.session.v1";

/** Seeded demo administrator. */
export const DEMO_ADMIN = {
  email: "admin@demo.local",
  password: "Demo@12345",
  name: "Demo Admin",
  role: "admin" as UserRole,
};

type StoredAccount = User & { passwordHash: string };

type Session = { userId: string };

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** SHA-256 hex digest of a string, using the Web Crypto API. */
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new ApiError(
      500,
      "This browser cannot hash passwords (Web Crypto is unavailable). Please use a modern browser over HTTPS or localhost.",
    );
  }
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readAccounts(): StoredAccount[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    throw new ApiError(
      507,
      "This browser is out of local storage space, so the account could not be saved.",
    );
  }
}

/** Creates the demo admin the first time anyone signs in. */
async function ensureDemoAccount(): Promise<StoredAccount[]> {
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === DEMO_ADMIN.email)) return accounts;

  const seeded: StoredAccount[] = [
    {
      id: createId("user"),
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: DEMO_ADMIN.role,
      passwordHash: await hashPassword(DEMO_ADMIN.password),
    },
    ...accounts,
  ];
  writeAccounts(seeded);
  return seeded;
}

function publicUser(account: StoredAccount): User {
  return { id: account.id, email: account.email, name: account.name, role: account.role };
}

function readSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * A tiny external store so React can subscribe to the session.
 *
 * `useSyncExternalStore` needs getSnapshot to return a cached value, otherwise
 * it re-renders forever. The cache is invalidated by `emitSessionChange()`,
 * which login, register and logout all call.
 * ------------------------------------------------------------------ */

type SessionListener = () => void;

const listeners = new Set<SessionListener>();
let snapshot: User | null | undefined;

function computeUser(): User | null {
  const session = readSession();
  if (!session) return null;
  const account = readAccounts().find((candidate) => candidate.id === session.userId);
  return account ? publicUser(account) : null;
}

/** Cached read used by useSyncExternalStore. */
export function getSessionSnapshot(): User | null {
  if (snapshot === undefined) snapshot = computeUser();
  return snapshot;
}

/** Server render has no session, so this keeps hydration stable. */
export function getServerSessionSnapshot(): User | null {
  return null;
}

export function subscribeToSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Called after every write so subscribed components see the new session. */
function emitSessionChange(): void {
  snapshot = computeUser();
  listeners.forEach((listener) => listener());
}

/** The signed-in user, or null. Synchronous so guards can use it during render. */
export function getCurrentUser(): User | null {
  return getSessionSnapshot();
}

function writeSession(userId: string): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId } satisfies Session));
  } catch {
    throw new ApiError(500, "This browser blocked session storage, so you cannot stay signed in.");
  }
  emitSessionChange();
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export async function login(email: string, password: string): Promise<User> {
  await sleep(200);

  const fieldErrors: FieldErrors = {};
  if (!email.trim()) fieldErrors.email = "Enter your email address.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length > 0) {
    throw new ApiError(422, "Please check the highlighted fields.", fieldErrors);
  }

  const accounts = await ensureDemoAccount();
  const account = accounts.find(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!account) {
    throw new ApiError(401, "We could not find an account with that email address.", {
      email: "No account uses this email address.",
    });
  }

  const hash = await hashPassword(password);
  if (hash !== account.passwordHash) {
    throw new ApiError(401, "That password is incorrect.", {
      password: "That password is incorrect.",
    });
  }

  writeSession(account.id);
  return publicUser(account);
}

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** Always creates an "editor": admins are promoted by an existing admin, never by self-sign-up. */
export async function register(input: RegisterInput): Promise<User> {
  await sleep(200);

  const fieldErrors: FieldErrors = {};
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (name.length < 2) fieldErrors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (input.password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  if (input.confirmPassword !== input.password) {
    fieldErrors.confirmPassword = "Both passwords must match.";
  }

  const accounts = await ensureDemoAccount();
  if (!fieldErrors.email && accounts.some((account) => account.email === email)) {
    fieldErrors.email = "An account with this email address already exists.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ApiError(422, "Please check the highlighted fields.", fieldErrors);
  }

  const account: StoredAccount = {
    id: createId("user"),
    name,
    email,
    role: "editor",
    passwordHash: await hashPassword(input.password),
  };

  writeAccounts([...accounts, account]);
  writeSession(account.id);
  return publicUser(account);
}

export function logout(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // If sessionStorage is blocked the session dies with the tab anyway.
  }
  emitSessionChange();
}
