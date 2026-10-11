"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/admin/Button";
import DataTable, { TableToolbar } from "@/components/admin/DataTable";
import type { Column, TableFilter } from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { useAuth } from "@/components/admin/AuthProvider";
import { newsApi } from "@/lib/admin/api";
import { errorMessage } from "@/lib/admin/errors";
import type { EntityStatus, NewsArticle } from "@/lib/admin/types";
import { formatDate, relativeTime } from "@/lib/admin/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "deleted", label: "Deleted" },
];

export default function AdminNewsPage() {
  const { notify } = useToast();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EntityStatus>("all");
  const [sort, setSort] = useState<string | undefined>("updated");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  // Starts true so the first paint shows the skeleton instead of "no articles".
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [busyId, setBusyId] = useState<string | undefined>();

  const pageSize = 10;

  /**
   * Loads the current page. Deliberately free of synchronous setState: this
   * function *is* the effect callback, and setting state during the effect body
   * cascades renders. Every update happens in a promise callback instead.
   *
   * `loading` starts as true and only turns false when a response lands, so the
   * first paint already shows the skeleton. `active` guards against a response
   * arriving after the query changed or the component unmounted.
   */
  const load = useCallback(() => {
    let active = true;

    newsApi
      .list({ search, status, page, pageSize, sort, dir })
      .then((result) => {
        if (!active) return;
        setRows(result.items);
        setTotal(result.total);
        setError(undefined);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(errorMessage(caught, "The news list could not be loaded."));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, status, page, sort, dir]);

  useEffect(load, [load]);

  // Filter changes reset to page 1 here rather than in an effect.
  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value: string) => {
    setStatus(value as EntityStatus);
    setPage(1);
  };

  const handleSort = (key: string) => {
    if (sort === key) {
      setDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(key);
    setDir("asc");
  };

  const handleRestore = async (article: NewsArticle) => {
    setBusyId(article.id);
    try {
      await newsApi.restore(article.id);
      notify(`${article.title} restored.`);
      // Show the skeleton, then re-run the current query so the row moves out of
      // the "deleted" filter. This is an event handler, so setState is fine here.
      setLoading(true);
      load();
    } catch (caught) {
      notify(errorMessage(caught, "That article could not be restored."), "error");
    } finally {
      setBusyId(undefined);
    }
  };

  const columns: Column<NewsArticle>[] = [
    {
      key: "title",
      header: "Headline",
      sortable: true,
      render: (article) => (
        <div className="min-w-0">
          <Link
            href={`/admin/news/${article.id}`}
            className="block truncate font-medium text-white underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          >
            {article.title}
          </Link>
          <span className="block truncate font-sans text-xs text-slate-500">
            {article.deletedAt
              ? `Deleted ${relativeTime(article.deletedAt)}`
              : `/${article.slug}`}
          </span>
        </div>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (article) =>
        article.tags.length === 0 ? (
          <span className="text-slate-500">-</span>
        ) : (
          <span className="flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 py-0.5 font-sans text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </span>
        ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (article) => (
        <StatusBadge
          status={article.deletedAt ? "deleted" : article.status === "published" ? "published" : "draft"}
        />
      ),
    },
    {
      key: "publishDate",
      header: "Publish date",
      // A draft has no publish date, so it never looks published.
      render: (article) =>
        article.status === "draft" ? (
          <span className="text-slate-500">Not scheduled</span>
        ) : (
          formatDate(article.publishDate)
        ),
    },
    {
      key: "updated",
      header: "Last updated",
      sortable: true,
      render: (article) => relativeTime(article.updatedAt),
    },
  ];

  const filters: TableFilter[] = [
    {
      key: "status",
      label: "Status",
      value: status,
      options: STATUS_OPTIONS,
      onChange: changeStatus,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <PageHeader
        title="News"
        description="Articles shown on the public news page."
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex min-h-11 items-center rounded-lg bg-brand-lime px-4 font-sans text-sm font-semibold text-brand-navy transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime"
          >
            New article
          </Link>
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

      <DataTable
        caption="News articles"
        columns={columns}
        rows={rows}
        rowKey={(article) => article.id}
        loading={loading}
        sort={sort}
        dir={dir}
        onSortChange={handleSort}
        emptyMessage={
          search || status !== "all"
            ? "No articles match these filters."
            : "No articles yet. Write the first one."
        }
        summary={`${rows.length} of ${total} shown`}
        pagination={{ page, pageSize, total, onPageChange: setPage }}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={changeSearch}
            searchLabel="Search articles"
            searchPlaceholder="Headline or tag"
            filters={filters}
          />
        }
        actions={(article) =>
          article.deletedAt ? (
            isAdmin ? (
              <Button
                size="sm"
                variant="ghost"
                busy={busyId === article.id}
                onClick={() => void handleRestore(article)}
              >
                Restore
              </Button>
            ) : null
          ) : (
            <Link
              href={`/admin/news/${article.id}`}
              className="inline-flex min-h-10 items-center rounded-lg px-3 font-sans text-sm text-brand-teal hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              Edit
            </Link>
          )
        }
      />
    </div>
  );
}
