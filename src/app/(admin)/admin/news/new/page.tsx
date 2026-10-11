"use client";

import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import NewsForm from "@/components/admin/NewsForm";

/** Create a new article. Starts as a draft. */
export default function NewNewsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <nav aria-label="Breadcrumb" className="font-sans text-xs text-slate-500">
        <Link
          href="/admin/news"
          className="underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          News
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-slate-300">New article</span>
      </nav>

      <PageHeader
        title="New article"
        description="New articles start as a draft, so nothing is public until you publish."
      />

      <NewsForm />
    </div>
  );
}
