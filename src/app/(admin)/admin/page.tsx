"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAuth } from "@/components/admin/AuthProvider";
import { getDashboardCounts, listActivity } from "@/lib/admin/api";
import type { DashboardCounts } from "@/lib/admin/api";
import { errorMessage } from "@/lib/admin/errors";
import type { ActivityEntry } from "@/lib/admin/types";
import { relativeTime } from "@/lib/admin/utils";

type CountTileProps = {
  label: string;
  total: number;
  detail: string;
  href: string;
};

function CountTile({ label, total, detail, href }: CountTileProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-brand-lime/40 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
    >
      <span className="font-display text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="font-display text-4xl font-extrabold leading-none text-white">{total}</span>
      <span className="font-sans text-xs text-slate-400">{detail}</span>
    </Link>
  );
}

function SkeletonTile() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-9 w-14 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-3 w-24 animate-pulse rounded bg-white/10" />
    </div>
  );
}

const ACTION_LABELS: Record<ActivityEntry["action"], string> = {
  created: "created",
  updated: "edited",
  deleted: "deleted",
  restored: "restored",
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  // Starts true so the first paint shows the skeleton tiles.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  /**
   * Loads the dashboard. Deliberately free of synchronous setState: this
   * function *is* the effect callback, and setting state during the effect body
   * cascades renders. Every update happens in a promise callback instead.
   *
   * `loading` starts as true, so the first paint already shows the skeleton
   * tiles, and `active` guards against a late response after unmount.
   */
  const load = useCallback(() => {
    let active = true;

    Promise.all([getDashboardCounts(), listActivity(8)])
      .then(([nextCounts, nextActivity]) => {
        if (!active) return;
        setCounts(nextCounts);
        setActivity(nextActivity);
        setError(undefined);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(errorMessage(caught, "The dashboard could not be loaded."));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(load, [load]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome back, ${user.name}. Everything here is demo data stored in this browser.`
            : undefined
        }
      />

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
        >
          {error}{" "}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              load();
            }}
            className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          >
            Try again
          </button>
        </p>
      ) : null}

      <section aria-labelledby="counts-heading" className="flex flex-col gap-3">
        <h2
          id="counts-heading"
          className="font-display text-sm font-bold uppercase tracking-widest text-brand-teal"
        >
          Content overview
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading || !counts ? (
            <>
              <SkeletonTile />
              <SkeletonTile />
              <SkeletonTile />
            </>
          ) : (
            <>
              <CountTile
                label="Cyclists"
                total={counts.cyclists.total}
                detail={`${counts.cyclists.published} published`}
                href="/admin/cyclists"
              />
              <CountTile
                label="Staff"
                total={counts.staff.total}
                detail={`${counts.staff.published} published`}
                href="/admin/staff"
              />
              <CountTile
                label="News"
                total={counts.news.total}
                detail={`${counts.news.published} published, ${counts.news.drafts} drafts`}
                href="/admin/news"
              />
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="activity-heading" className="flex flex-col gap-3">
        <h2
          id="activity-heading"
          className="font-display text-sm font-bold uppercase tracking-widest text-brand-teal"
        >
          Recent edits
        </h2>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          {loading ? (
            <ul className="divide-y divide-white/5">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={index} className="px-4 py-3">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                </li>
              ))}
            </ul>
          ) : activity.length === 0 ? (
            <p className="px-4 py-8 text-center font-sans text-sm text-slate-400">
              No edits recorded yet. Changes you save will show up here.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {activity.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3">
                  <StatusBadge
                    status={entry.action === "deleted" ? "deleted" : "published"}
                    className="hidden sm:inline-flex"
                  />
                  <span className="font-sans text-sm text-white">{entry.entityLabel}</span>
                  <span className="font-sans text-sm text-slate-400">
                    was {ACTION_LABELS[entry.action]}
                  </span>
                  <span className="font-sans text-xs text-slate-500">({entry.entity})</span>
                  <span className="ml-auto font-sans text-xs text-slate-500">
                    {entry.actor} &middot; {relativeTime(entry.at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
