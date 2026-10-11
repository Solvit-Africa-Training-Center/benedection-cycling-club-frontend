"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import CyclistForm from "@/components/admin/CyclistForm";
import PageHeader from "@/components/admin/PageHeader";
import { cyclistsApi } from "@/lib/admin/api";
import { errorMessage } from "@/lib/admin/errors";
import type { Cyclist } from "@/lib/admin/types";

/**
 * Edit an existing rider.
 *
 * `params` is a Promise in Next.js 15+, so a client component unwraps it with
 * `use(params)` rather than `await`.
 */
export default function EditCyclistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [cyclist, setCyclist] = useState<Cyclist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let active = true;

    cyclistsApi
      .get(id)
      .then((found) => {
        if (active) setCyclist(found);
      })
      .catch((caught: unknown) => {
        if (active) setError(errorMessage(caught, "That rider could not be loaded."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  let content: ReactNode;
  if (loading) {
    content = (
      <p className="font-sans text-sm text-slate-400" aria-busy="true">
        Loading rider&hellip;
      </p>
    );
  } else if (error || !cyclist) {
    content = (
      <div className="flex flex-col items-start gap-3">
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
        >
          {error ?? "That rider could not be found."}
        </p>
        <Link
          href="/admin/cyclists"
          className="inline-flex min-h-11 items-center rounded-lg border border-white/20 bg-white/5 px-4 font-sans text-sm text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          Back to cyclists
        </Link>
      </div>
    );
  } else {
    content = <CyclistForm cyclist={cyclist} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <nav aria-label="Breadcrumb" className="font-sans text-xs text-slate-500">
        <Link
          href="/admin/cyclists"
          className="underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          Cyclists
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-slate-300">{cyclist?.name ?? "Rider"}</span>
      </nav>

      <PageHeader
        title={cyclist?.name ?? "Rider"}
        description={
          cyclist?.deletedAt
            ? "This rider is deleted. Only an administrator can restore them from the cyclists list."
            : "Update the rider's details and save."
        }
      />

      {content}
    </div>
  );
}
