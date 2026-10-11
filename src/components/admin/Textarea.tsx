"use client";

import { forwardRef, useId } from "react";
import type { ReactNode, TextareaHTMLAttributes } from "react";
import FormField, { inputClasses, useFieldContext } from "./FormField";

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Rendered at the right of the label row, e.g. a character count. */
  trailing?: ReactNode;
  className?: string;
};

/** Multi-line text input with the same label/error wiring as TextInput. */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, hint, error, trailing, className, required, rows = 4, ...rest },
  ref,
) {
  const field = useFieldContext();
  const generatedId = useId();
  const inputId = id ?? field?.id ?? generatedId;
  const invalid = Boolean(error ?? field?.invalid);

  const input = (
    <textarea
      ref={ref}
      id={inputId}
      rows={rows}
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

export default Textarea;
