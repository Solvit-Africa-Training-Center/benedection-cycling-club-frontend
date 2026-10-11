"use client";

import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StaffForm from "@/components/admin/StaffForm";

/** Create a new staff member. */
export default function NewStaffPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <nav aria-label="Breadcrumb" className="font-sans text-xs text-slate-500">
        <Link
          href="/admin/staff"
          className="underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          Staff
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-slate-300">New staff member</span>
      </nav>

      <PageHeader title="New staff member" description="Add a coach, physio or support staff." />

      <StaffForm />
    </div>
  );
}
