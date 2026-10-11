"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { cx } from "@/lib/admin/utils";

type FieldContextValue = {
  /** id the input should use, so `label[for]` and `aria-describedby` line up. */
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/** Lets TextInput/Textarea/Select wire themselves up from inside a FormField. */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

type FormFieldProps = {
  /** Required: the `for`/`id` pair is what makes the label real for screen readers. */
  id: string;
  label: string;
  /** Short guidance shown under the label. */
  hint?: string;
  /** Validation message. Also switches the input into its invalid styling. */
  error?: string;
  required?: boolean;
  className?: string;
  /** Rendered on the right of the label row, e.g. a live character count. */
  trailing?: ReactNode;
  children: ReactNode;
};

/**
 * Label + hint + error wrapper. Every field in the admin uses this, so no input
 * is ever unlabelled.
 */
export default function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  trailing,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required }}>
      <div className={cx("flex flex-col gap-1.5", className)}>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="font-sans text-sm font-medium text-slate-200">
            {label}
            {required ? (
              <span className="ml-1 text-brand-lime" aria-hidden="true">
                *
              </span>
            ) : null}
            {required ? <span className="sr-only"> (required)</span> : null}
          </label>
          {trailing ? <span className="font-sans text-xs text-slate-400">{trailing}</span> : null}
        </div>

        {hint ? (
          <p id={hintId} className="font-sans text-xs text-slate-400">
            {hint}
          </p>
        ) : null}

        {children}

        {/* role="alert" so the message is announced as soon as it appears. */}
        {error ? (
          <p id={errorId} role="alert" className="font-sans text-xs font-medium text-red-300">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/** Shared input styling so every control looks and focuses the same way. */
export const inputClasses = (
  invalid: boolean,
  extra?: string,
): string =>
  cx(
    "min-h-11 w-full rounded-lg border bg-brand-navy/60 px-3 py-2 font-sans text-sm text-white",
    "placeholder:text-slate-500 transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
    "disabled:cursor-not-allowed disabled:opacity-60",
    invalid ? "border-red-400/70" : "border-white/15 hover:border-white/25",
    extra,
  );
