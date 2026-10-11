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
import { staffApi } from "@/lib/admin/api";
import { errorMessage } from "@/lib/admin/errors";
import type { EntityStatus, StaffMember } from "@/lib/admin/types";
import { relativeTime } from "@/lib/admin/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "deleted", label: "Deleted" },
];

/** Thumbnail, falling back to initials when there is no photo. */
function Thumb({ member }: { member: StaffMember }) {
  const initials = member.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (!member.photo) {
    return (
      <span
        role="img"
        aria-label={`No photo for ${member.name}`}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-display text-xs font-bold uppercase text-slate-300"
      >
        {initials}
      </span>
    );
  }

  // Stored images are local data URLs, so next/image cannot optimise them.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={member.photo}
      alt={member.name}
      className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
    />
  );
}

export default function AdminStaffPage() {
  const { notify } = useToast();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EntityStatus>("all");
  const [sort, setSort] = useState<string | undefined>();
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<StaffMember[]>([]);
  const [total, setTotal] = useState(0);
  // Starts true so the first paint shows the skeleton instead of "no staff".
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

    staffApi
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
        setError(errorMessage(caught, "The staff list could not be loaded."));
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

  const handleRestore = async (member: StaffMember) => {
    setBusyId(member.id);
    try {
      await staffApi.restore(member.id);
      notify(`${member.name} restored.`);
      // Show the skeleton, then re-run the current query so the row moves out of
      // the "deleted" filter. This is an event handler, so setState is fine here.
      setLoading(true);
      load();
    } catch (caught) {
      notify(errorMessage(caught, "That staff member could not be restored."), "error");
    } finally {
      setBusyId(undefined);
    }
  };

  const columns: Column<StaffMember>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (member) => (
        <div className="flex items-center gap-3">
          <Thumb member={member} />
          <div className="min-w-0">
            <Link
              href={`/admin/staff/${member.id}`}
              className="block truncate font-medium text-white underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              {member.name}
            </Link>
            {member.deletedAt ? (
              <span className="block font-sans text-xs text-slate-500">
                Deleted {relativeTime(member.deletedAt)}
              </span>
            ) : null}
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", sortable: true, render: (member) => member.role || "-" },
    {
      key: "order",
      header: "Order",
      sortable: true,
      render: (member) => member.order,
    },
    {
      key: "status",
      header: "Status",
      render: (member) => (
        <StatusBadge
          status={member.deletedAt ? "deleted" : member.published ? "published" : "draft"}
        />
      ),
    },
    {
      key: "updated",
      header: "Last updated",
      sortable: true,
      render: (member) => relativeTime(member.updatedAt),
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
        title="Staff"
        description="Coaches, physios and support staff shown on the public team page."
        actions={
          <Link
            href="/admin/staff/new"
            className="inline-flex min-h-11 items-center rounded-lg bg-brand-lime px-4 font-sans text-sm font-semibold text-brand-navy transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime"
          >
            New staff member
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
        caption="Staff"
        columns={columns}
        rows={rows}
        rowKey={(member) => member.id}
        loading={loading}
        sort={sort}
        dir={dir}
        onSortChange={handleSort}
        emptyMessage={
          search || status !== "all"
            ? "No staff match these filters."
            : "No staff yet. Create the first one."
        }
        summary={`${rows.length} of ${total} shown`}
        pagination={{ page, pageSize, total, onPageChange: setPage }}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={changeSearch}
            searchLabel="Search staff"
            searchPlaceholder="Name or role"
            filters={filters}
          />
        }
        actions={(member) =>
          member.deletedAt ? (
            isAdmin ? (
              <Button
                size="sm"
                variant="ghost"
                busy={busyId === member.id}
                onClick={() => void handleRestore(member)}
              >
                Restore
              </Button>
            ) : null
          ) : (
            <Link
              href={`/admin/staff/${member.id}`}
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
