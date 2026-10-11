import type { ReactNode } from "react";
import { cx } from "@/lib/admin/utils";

/**
 * Page title + optional actions. Uses the display font, uppercase, like the rest
 * of the club's headings.
 */
export default function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-extrabold uppercase leading-none tracking-wide text-white md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl font-sans text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Titled panel used to group form sections. */
export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx("rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-5", className)}
    >
      <h2 className="font-display text-lg font-bold uppercase tracking-widest text-brand-lime">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 font-sans text-sm text-slate-400">{description}</p>
      ) : null}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}
