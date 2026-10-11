"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import Button from "./Button";
import type { SelectOption } from "./Select";
import { cx } from "@/lib/admin/utils";

export type Column<T> = {
  /** Stable key, also used as the `sort` value sent to the api. */
  key: string;
  header: string;
  /** Renders the cell. */
  render: (row: T) => ReactNode;
  /** Shows the sort control in the header. */
  sortable?: boolean;
  /** Extra classes for the cell, e.g. to hide a column on small screens. */
  className?: string;
  headerClassName?: string;
};

export type TableFilter = {
  key: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Shown instead of the table body while the first request is in flight. */
  loading?: boolean;
  /** Row actions, e.g. Edit / Delete links. */
  actions?: (row: T) => ReactNode;
  /** Toolbar above the table. */
  toolbar?: ReactNode;
  /** Text under the toolbar, e.g. "3 of 12 shown". */
  summary?: ReactNode;
  /** Heading for screen readers, since the table has no visible caption. */
  caption: string;
  emptyMessage?: string;
  className?: string;
  /** Active sort column key. */
  sort?: string;
  dir?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
};

/** Column header with an accessible sort control. */
function SortableHeader<T>({
  column,
  sort,
  dir,
  onSort,
}: {
  column: Column<T>;
  sort?: string;
  dir: "asc" | "desc";
  onSort: (key: string) => void;
}) {
  const active = sort === column.key;
  const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cx(
        "px-3 py-3 text-left font-display text-xs font-bold uppercase tracking-widest text-slate-400",
        column.headerClassName,
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column.key)}
        className={cx(
          "inline-flex min-h-8 items-center gap-1 rounded hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
          active && "text-brand-lime",
        )}
      >
        {column.header}
        <span aria-hidden="true" className="text-[0.6rem]">
          {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

/** Loading placeholder rows that keep the table height stable. */
function SkeletonRows({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} aria-hidden="true">
          {Array.from({ length: columns }).map((__, cellIndex) => (
            <td key={`skeleton-${rowIndex}-${cellIndex}`} className="px-3 py-4">
              <div className="h-4 animate-pulse rounded bg-white/10" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Search box + filter selects that sit above a DataTable.
 * Extracted so every list screen gets the same controls with the same markup.
 */
export function TableToolbar({
  search,
  onSearchChange,
  searchLabel,
  searchPlaceholder,
  filters = [],
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  filters?: TableFilter[];
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex w-full flex-col gap-1.5 sm:w-72">
          <label htmlFor="admin-search" className="font-sans text-xs font-medium text-slate-300">
            {searchLabel}
          </label>
          <input
            id="admin-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="min-h-11 w-full rounded-lg border border-white/15 bg-brand-navy/60 px-3 py-2 font-sans text-sm text-white placeholder:text-slate-500 hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="flex w-full flex-col gap-1.5 sm:w-44">
            <label
              htmlFor={`admin-filter-${filter.key}`}
              className="font-sans text-xs font-medium text-slate-300"
            >
              {filter.label}
            </label>
            <select
              id={`admin-filter-${filter.key}`}
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-white/15 bg-brand-navy/60 px-3 py-2 font-sans text-sm text-white hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value} className="bg-brand-navy text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}



/**
 * The list table used by every admin resource: search box, filter selects,
 * sortable columns, pagination, loading skeleton and empty state.
 *
 * It is deliberately presentational - the owning screen owns the query state and
 * calls the api, exactly as it would with a real backend.
 */
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  actions,
  toolbar,
  summary,
  caption,
  emptyMessage = "Nothing to show yet.",
  className,
  sort,
  dir = "asc",
  onSortChange,
  pagination,
}: DataTableProps<T>) {
  const captionId = useId();
  const columnCount = columns.length + (actions ? 1 : 0);
  const pageCount = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize)) : 1;

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    onSortChange(key);
  };

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {toolbar}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <caption id={captionId} className="sr-only">
            {caption}
          </caption>
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr>
              {columns.map((column) =>
                column.sortable && onSortChange ? (
                  <SortableHeader
                    key={column.key}
                    column={column}
                    sort={sort}
                    dir={dir}
                    onSort={handleSort}
                  />
                ) : (
                  <th
                    key={column.key}
                    scope="col"
                    className={cx(
                      "px-3 py-3 font-display text-xs font-bold uppercase tracking-widest text-slate-400",
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </th>
                ),
              )}
              {actions ? (
                <th
                  scope="col"
                  className="px-3 py-3 text-right font-display text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  <span className="sr-only">Row actions</span>
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {loading ? (
              <SkeletonRows columns={columnCount} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-12 text-center">
                  <p className="font-sans text-sm text-slate-400">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="transition-colors hover:bg-white/[0.03]">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cx(
                        "px-3 py-3 align-middle font-sans text-sm text-slate-200",
                        column.className,
                      )}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                  {actions ? (
                    <td className="px-3 py-3 text-right align-middle">
                      <div className="flex justify-end gap-1">{actions(row)}</div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        {summary ? <p className="font-sans text-xs text-slate-400">{summary}</p> : <span />}

        {pagination && pageCount > 1 ? (
          <nav aria-label="Pagination" className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              aria-label="Go to the previous page"
            >
              <span aria-hidden="true">&larr;</span> Previous
            </Button>
            <p className="font-sans text-xs text-slate-400" aria-live="polite">
              Page {pagination.page} of {pageCount}
            </p>
            <Button
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pageCount}
              aria-label="Go to the next page"
            >
              Next <span aria-hidden="true">&rarr;</span>
            </Button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
