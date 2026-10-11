"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import Button from "./Button";
import { cx } from "@/lib/admin/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  /** What will happen, e.g. which record is affected. */
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button, for destructive actions. */
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Selector for everything the user can Tab to inside the dialog. */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal confirmation dialog.
 *
 * Accessibility: rendered with `role="dialog"` + `aria-modal`, focus moves in on
 * open and is trapped while it is up, Escape and the backdrop cancel, and focus
 * returns to whatever opened it.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      // Focus trap: wrap around at both ends of the dialog.
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [busy, onCancel],
  );

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);
    // Stop the page behind the dialog from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={busy ? undefined : onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cx(
          "relative w-full max-w-md rounded-xl border border-white/15 bg-brand-navy p-5 shadow-2xl",
        )}
      >
        <h2
          id={titleId}
          className="font-display text-xl font-bold uppercase tracking-wide text-white"
        >
          {title}
        </h2>

        {description ? (
          <p id={descriptionId} className="mt-2 font-sans text-sm text-slate-300">
            {description}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={destructive ? "danger" : "primary"}
            onClick={onConfirm}
            busy={busy}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
