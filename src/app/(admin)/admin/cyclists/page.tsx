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
import { cyclistsApi } from "@/lib/admin/api";
import { errorMessage } from "@/lib/admin/errors";
import type { Cyclist, CyclistCategory, EntityStatus } from "@/lib/admin/types";
import { calculateAge, formatDate, relativeTime } from "@/lib/admin/utils";

const CATEGORY_LABELS: Record<CyclistCategory, string> = {
  men: "Men",
  women: "Women",
  junior: "Junior",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "deleted", label: "Deleted" },
];

const CATEGORY_FILTERS = [
  { value: "all", label: "All categories" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "junior", label: "Junior" },
];

/** Small thumbnail that falls back to initials when a rider has no photo. */
function Thumb({ cyclist }: { cyclist: Cyclist }) {
  const initials = cyclist.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (!cyclist.photo) {
    return (
      <span
        role="img"
        aria-label={`No photo for ${cyclist.name}`}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-display text-xs font-bold uppercase text-slate-300"
      >
        {initials}
      </span>
    );
  }

  return (
    // Stored images are local data URLs, so next/image cannot optimise them.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cyclist.photo}
      alt={cyclist.name}
      className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
    />
  );
}

export default function AdminCyclistsPage() {
  const { notify } = useToast();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EntityStatus>("all");
  const [category, setCategory] = useState<CyclistCategory | "all">("all");
  const [sort, setSort] = useState<string | undefined>();
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<Cyclist[]>([]);
  const [total, setTotal] = useState(0);
  // Starts true so the first paint shows the skeleton instead of "no riders".
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

    cyclistsApi
      .list({ search, status, category, page, pageSize, sort, dir })
      .then((result) => {
        if (!active) return;
        setRows(result.items);
        setTotal(result.total);
        setError(undefined);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(errorMessage(caught, "The rider list could not be loaded."));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, status, category, page, sort, dir]);

  useEffect(load, [load]);

  // Filter changes reset to page 1 here rather than in an effect, so the new
  // query is what actually gets requested.
  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value: string) => {
    setStatus(value as EntityStatus);
    setPage(1);
  };

  const changeCategory = (value: string) => {
    setCategory(value as CyclistCategory | "all");
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

  const handleRestore = async (cyclist: Cyclist) => {
    setBusyId(cyclist.id);
    try {
      await cyclistsApi.restore(cyclist.id);
      notify(`${cyclist.name} restored.`);
      // Show the skeleton, then re-run the current query so the row moves out of
      // the "deleted" filter. This is an event handler, so setState is fine here.
      setLoading(true);
      load();
    } catch (caught) {
      notify(errorMessage(caught, "That rider could not be restored."), "error");
    } finally {
      setBusyId(undefined);
    }
  };

  const columns: Column<Cyclist>[] = [
    {
      key: "name",
      header: "Rider",
      sortable: true,
      render: (cyclist) => (
        <div className="flex items-center gap-3">
          <Thumb cyclist={cyclist} />
          <div className="min-w-0">
            <Link
              href={`/admin/cyclists/${cyclist.id}`}
              className="block truncate font-medium text-white underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              {cyclist.name}
            </Link>
            <span className="block truncate font-sans text-xs text-slate-500">
              {cyclist.deletedAt
                ? `Deleted ${relativeTime(cyclist.deletedAt)}`
                : `/${cyclist.slug}`}
            </span>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", sortable: true, render: (cyclist) => cyclist.role || "-" },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (cyclist) => CATEGORY_LABELS[cyclist.category],
    },
    {
      key: "age",
      header: "Age",
      render: (cyclist) => {
        const age = calculateAge(cyclist.dateOfBirth);
        return age === null ? (
          <span className="text-slate-500">Not recorded</span>
        ) : (
          age
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (cyclist) => (
        <StatusBadge
          status={cyclist.deletedAt ? "deleted" : cyclist.published ? "published" : "draft"}
        />
      ),
    },
    {
      key: "updated",
      header: "Last updated",
      sortable: true,
      render: (cyclist) => (
        <span title={formatDate(cyclist.updatedAt)}>{relativeTime(cyclist.updatedAt)}</span>
      ),
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
    {
      key: "category",
      label: "Category",
      value: category,
      options: CATEGORY_FILTERS,
      onChange: changeCategory,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <PageHeader
        title="Cyclists"
        description="Riders shown on the public team page."
        actions={
          <Link
            href="/admin/cyclists/new"
            className="inline-flex min-h-11 items-center rounded-lg bg-brand-lime px-4 font-sans text-sm font-semibold text-brand-navy transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime"
          >
            New rider
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
        caption="Cyclists"
        columns={columns}
        rows={rows}
        rowKey={(cyclist) => cyclist.id}
        loading={loading}
        sort={sort}
        dir={dir}
        onSortChange={handleSort}
        emptyMessage={
          search || status !== "all" || category !== "all"
            ? "No riders match these filters."
            : "No riders yet. Create the first one."
        }
        summary={`${rows.length} of ${total} shown`}
        pagination={{ page, pageSize, total, onPageChange: setPage }}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={changeSearch}
            searchLabel="Search riders"
            searchPlaceholder="Name, role, nationality"
            filters={filters}
          />
        }
        actions={(cyclist) =>
          cyclist.deletedAt ? (
            // Only admins get Restore; the api layer refuses it for editors too.
            isAdmin ? (
              <Button
                size="sm"
                variant="ghost"
                busy={busyId === cyclist.id}
                onClick={() => void handleRestore(cyclist)}
              >
                Restore
              </Button>
            ) : null
          ) : (
            <Link
              href={`/admin/cyclists/${cyclist.id}`}
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
