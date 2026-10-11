"use client";

import { forwardRef, useId } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import FormField, { inputClasses, useFieldContext } from "./FormField";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "children"> & {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
  options: SelectOption[];
  /** Shown as the first, empty option. */
  placeholder?: string;
  className?: string;
};

/** Native select: reliable on mobile and readable by assistive technology. */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, hint, error, trailing, options, placeholder, className, required, ...rest },
  ref,
) {
  const field = useFieldContext();
  const generatedId = useId();
  const inputId = id ?? field?.id ?? generatedId;
  const invalid = Boolean(error ?? field?.invalid);

  const input = (
    <select
      ref={ref}
      id={inputId}
      required={required ?? field?.required}
      aria-invalid={invalid || undefined}
      aria-describedby={field?.describedBy}
      className={inputClasses(invalid, className)}
      {...rest}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-brand-navy text-white">
          {option.label}
        </option>
      ))}
    </select>
  );

  if (!label) return input;

  return (
    <FormField id={inputId} label={label} hint={hint} error={error} required={required} trailing={trailing}>
      {input}
    </FormField>
  );
});

export default Select;
