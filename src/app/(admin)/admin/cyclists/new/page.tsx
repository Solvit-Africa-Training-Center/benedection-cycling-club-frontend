"use client";

import Link from "next/link";
import CyclistForm from "@/components/admin/CyclistForm";
import PageHeader from "@/components/admin/PageHeader";

/** Create a new rider. */
export default function NewCyclistPage() {
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
        <span className="text-slate-300">New rider</span>
      </nav>

      <PageHeader
        title="New rider"
        description="Fill in what the club has verified. Optional fields can stay empty."
      />

      <CyclistForm />
    </div>
  );
}
