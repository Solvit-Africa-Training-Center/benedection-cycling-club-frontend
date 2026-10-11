"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  subscribeToSession,
} from "@/lib/admin/auth";
import type { RegisterInput } from "@/lib/admin/auth";
import type { User } from "@/lib/admin/types";

type AuthContextValue = {
  user: User | null;
  /** True once the session has been read, so guards avoid a redirect flash. */
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Holds the current session for the whole admin area.
 *
 * The session itself lives in sessionStorage (see `auth.ts`). It is read through
 * `useSyncExternalStore`, which is the correct hook for browser-only storage: it
 * returns null on the server, so the HTML stays hydration-safe, and it picks the
 * real session up right after the first client render.
 */
/** No-op subscribe: this store never changes, it only reports SSR vs client. */
function subscribeToNever(): () => void {
  return () => {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // `true` during SSR and the first client render, `false` once hydration
  // finishes. That flip is the signal the route guard needs: until it happens,
  // sessionStorage has not been read, so redirecting would be premature.
  const isServerRender = useSyncExternalStore(
    subscribeToNever,
    () => false,
    () => true,
  );

  const user = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  const login = useCallback(async (email: string, password: string) => {
    return loginRequest(email, password);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    return registerRequest(input);
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
  }, []);

  const value = useMemo(
    // `ready` means "the browser has had a chance to read the session".
    () => ({
      user,
      ready: !isServerRender,
      login,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, isServerRender, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return context;
}

