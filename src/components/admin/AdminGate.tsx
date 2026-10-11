"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import AdminShell from "./AdminShell";
import DemoBanner from "./DemoBanner";
import { useAuth } from "./AuthProvider";
import Button from "./Button";

/**
 * Route protection for the admin area.
 *
 * The session lives in sessionStorage, which is only readable in the browser, so
 * the guard has to run client-side. Rows are checked like this:
 *   - /admin/login and /admin/register are public, so they render without the
 *     shell (otherwise signing in would redirect in a loop);
 *   - everywhere else, no session -> redirect to /admin/login, remembering where
 *     you were via `?next=`;
 *   - editors can create and edit, but never delete, restore or open user
 *     settings (also enforced in the api layer, not just in the UI);
 *   - admins get everything.
 *
 * The `ready` flag stops the first render from bouncing a signed-in user before
 * the session has been read.
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const router = useRouter();

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register";

  useEffect(() => {
    if (!ready || user || isAuthPage) return;
    const target = `${pathname}${window.location.search}`;
    router.replace(`/admin/login?next=${encodeURIComponent(target)}`);
  }, [ready, user, isAuthPage, pathname, router]);

  // Sign-in screens sit outside the shell: they have their own full-screen layout.
  if (isAuthPage) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-brand-navy font-sans text-white">
        <DemoBanner />
        {children}
      </div>
    );
  }

  if (!ready || !user) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 overflow-y-auto bg-brand-navy font-sans text-white">
        <DemoBanner />
        <p className="font-sans text-sm text-slate-300">Checking your session&hellip;</p>
        <Button onClick={() => router.replace("/admin/login")}>Go to sign in</Button>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
