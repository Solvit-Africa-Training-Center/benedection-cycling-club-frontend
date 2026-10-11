"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import FormField, { inputClasses, useFieldContext } from "./FormField";

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  /** Omit when the input already sits inside a FormField. */
  id?: string;
  /** Pass this to let the input wrap itself in a FormField. */
  label?: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
  className?: string;
};

/**
 * Text input. Inherits the surrounding FormField's label/error wiring through
 * context, or wraps itself in one when given a `label`.
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { id, label, hint, error, trailing, className, required, ...rest },
  ref,
) {
  const field = useFieldContext();
  const generatedId = useId();
  const inputId = id ?? field?.id ?? generatedId;
  const invalid = Boolean(error ?? field?.invalid);

  const input = (
    <input
      ref={ref}
      id={inputId}
      required={required ?? field?.required}
      aria-invalid={invalid || undefined}
      aria-describedby={field?.describedBy}
      className={inputClasses(invalid, className)}
      {...rest}
    />
  );

  if (!label) return input;

  return (
    <FormField id={inputId} label={label} hint={hint} error={error} required={required} trailing={trailing}>
      {input}
    </FormField>
  );
});

export default TextInput;
