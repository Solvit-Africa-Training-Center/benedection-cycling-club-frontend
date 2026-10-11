import { cx } from "@/lib/admin/utils";

type StatusBadgeProps = {
  status: "published" | "draft" | "deleted";
  className?: string;
};

const LABELS: Record<StatusBadgeProps["status"], string> = {
  published: "Published",
  draft: "Draft",
  deleted: "Deleted",
};

const STYLES: Record<StatusBadgeProps["status"], string> = {
  published: "bg-brand-lime/15 text-brand-lime ring-brand-lime/40",
  draft: "bg-amber-400/15 text-amber-300 ring-amber-400/40",
  deleted: "bg-red-500/15 text-red-300 ring-red-400/40",
};

/** Colour-coded pill for published / draft / deleted rows. */
export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 font-sans text-xs font-semibold ring-1 ring-inset",
        STYLES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}
