import { cx } from "@/lib/admin/utils";

/**
 * Permanent reminder that this build is a prototype with browser-only storage.
 * Rendered by the admin layout on every screen, including login.
 */
export default function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      data-testid="demo-banner"
      className={cx(
        "flex items-center justify-center gap-2 border-b border-brand-lime/30 bg-brand-lime/10 px-4 py-2 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="hidden h-2 w-2 shrink-0 rounded-full bg-brand-lime sm:block"
      />
      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-lime">
        Demo mode: data is saved only in this browser
      </p>
    </div>
  );
}
