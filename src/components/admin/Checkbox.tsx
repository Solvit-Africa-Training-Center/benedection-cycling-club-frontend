"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/admin/utils";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  id?: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  className?: string;
};

/**
 * Checkbox with a real label. The hit area is the whole row (min 40px) so it is
 * comfortable to tap, and focus stays visible on the box itself.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, hint, error, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <div className="flex min-h-11 items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-white/30 bg-brand-navy text-brand-lime accent-brand-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          {...rest}
        />
        <div className="flex flex-col gap-0.5">
          <label htmlFor={inputId} className="cursor-pointer font-sans text-sm text-slate-200">
            {label}
          </label>
          {hint ? (
            <p id={hintId} className="font-sans text-xs text-slate-400">
              {hint}
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="font-sans text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Checkbox;
