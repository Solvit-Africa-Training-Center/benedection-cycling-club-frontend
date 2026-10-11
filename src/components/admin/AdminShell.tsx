"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import Button from "./Button";
import DemoBanner from "./DemoBanner";
import { useAuth } from "./AuthProvider";
import { cx, initials } from "@/lib/admin/utils";

type NavItem = {
  href: string;
  label: string;
  /** Only shown to administrators. */
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/cyclists", label: "Cyclists" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/settings", label: "User settings", adminOnly: true },
];

function isActive(pathname: string, href: string): boolean {
  // "/admin" must only match itself, not every child route.
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sidebar contents, shared by the desktop rail and the mobile drawer. */
function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const navId = useId();

  return (
    <nav aria-label="Admin sections" id={navId} className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-11 items-center rounded-lg px-3 font-display text-sm font-bold uppercase tracking-widest transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
              active
                ? "bg-brand-lime text-brand-navy"
                : "text-slate-300 hover:bg-white/10 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** User menu in the header: who is signed in, plus sign out. */
function UserMenu() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click and on Escape, standard menu behaviour.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal/20 font-display text-xs font-bold uppercase text-brand-teal"
        >
          {initials(user.name)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block font-sans text-sm text-white">{user.name}</span>
          <span className="block font-sans text-xs capitalize text-slate-400">{user.role}</span>
        </span>
        <span aria-hidden="true" className="text-xs text-slate-400">
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-white/15 bg-brand-navy p-1 shadow-2xl"
        >
          <div className="border-b border-white/10 px-3 py-2">
            <p className="font-sans text-sm text-white">{user.name}</p>
            <p className="font-sans text-xs text-slate-400">{user.email}</p>
            <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-widest text-brand-teal">
              {isAdmin ? "Administrator" : "Editor"}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              setOpen(false);
              router.replace("/admin/login");
            }}
            className="mt-1 flex min-h-11 w-full items-center rounded px-3 text-left font-sans text-sm text-red-300 hover:bg-red-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Sidebar + header + content area for the whole admin.
 *
 * WORKAROUND - please read before "fixing" this:
 * The root layout (`src/app/layout.tsx`) renders the public <Navbar/> and
 * <Footer/> around every route, and that file must not be edited. Rather than
 * patching it, the admin renders a single fixed, full-screen container
 * (`fixed inset-0 z-[100]`) that paints over both of them and scrolls
 * independently. The DOM order is therefore Navbar -> admin shell -> Footer,
 * with the shell covering the first and last. The alternative would have been
 * editing the root layout, which was out of scope for this task.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // The drawer is closed by SidebarNav's onNavigate (a real user action), not by
  // an effect watching the route: setting state in an effect cascades renders.
  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-brand-navy font-sans text-white">
      <DemoBanner className="sticky top-0 z-40" />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-brand-navy/80 lg:flex">
          <div className="border-b border-white/10 px-4 py-4">
            <p className="font-display text-lg font-extrabold uppercase leading-none tracking-wide text-white">
              Benediction CC
            </p>
            <p className="mt-1 font-display text-xs font-bold uppercase tracking-widest text-brand-lime">
              Admin dashboard
            </p>
          </div>
          <SidebarNav />
        </aside>

        {/* Mobile drawer */}
        {menuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/70"
            />
            <aside
              aria-label="Admin navigation"
              className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-brand-navy"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <p className="font-display text-sm font-extrabold uppercase tracking-widest text-brand-lime">
                  Menu
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <span aria-hidden="true">&times;</span>
                </Button>
              </div>
              <SidebarNav onNavigate={() => setMenuOpen(false)} />
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-9 z-30 flex items-center gap-3 border-b border-white/10 bg-brand-navy/95 px-4 py-3 backdrop-blur">
            <Button
              size="sm"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
            >
              <span aria-hidden="true" className="text-base leading-none">
                ☰
              </span>
              <span className="sr-only sm:not-sr-only">Menu</span>
            </Button>

            <p className="min-w-0 flex-1 truncate font-display text-sm font-bold uppercase tracking-widest text-slate-400">
              Admin dashboard
            </p>

            <UserMenu />
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
