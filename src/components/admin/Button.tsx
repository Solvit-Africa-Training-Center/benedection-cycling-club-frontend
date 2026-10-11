"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/admin/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Shows a spinner and blocks clicks. */
  busy?: boolean;
  children?: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-lime text-brand-navy hover:bg-lime-300 focus-visible:outline-brand-lime font-semibold",
  secondary:
    "border border-white/20 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-brand-teal",
  ghost: "text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-brand-teal",
  danger: "bg-red-500 text-white hover:bg-red-400 focus-visible:outline-red-300 font-semibold",
};

const SIZES: Record<Size, string> = {
  // Every control stays at least 40px tall so it is easy to hit on a phone.
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
};

/** The single button used across the admin UI. */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", busy = false, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-sans transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {busy ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
});

export default Button;
