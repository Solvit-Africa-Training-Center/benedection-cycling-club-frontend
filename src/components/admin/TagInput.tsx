"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import Button from "./Button";
import FormField from "./FormField";
import { cx } from "@/lib/admin/utils";

type TagInputProps = {
  id?: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  max?: number;
  className?: string;
};

/** Chip-style list input: type and press Enter, or use "Add tag". */
export default function TagInput({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  placeholder = "Add a tag and press Enter",
  max = 8,
  className,
}: TagInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim().replace(/\s+/g, " ");
    if (!tag) return;
    // Case-insensitive duplicate check, so "Racing" and "racing" are one tag.
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    if (value.length >= max) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, position) => position !== index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      // Stop the form from submitting when a tag is added with Enter.
      event.preventDefault();
      addTag();
      return;
    }
    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const full = value.length >= max;

  return (
    <FormField id={inputId} label={label} hint={hint} error={error} className={className}>
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <li key={`${tag}-${index}`}>
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-brand-teal/15 py-1 pl-3 pr-1 font-sans text-xs text-brand-teal ring-1 ring-brand-teal/30 ring-inset">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  aria-label={`Remove tag ${tag}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-brand-teal/80 hover:bg-brand-teal/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-teal"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={full}
          placeholder={full ? `Maximum of ${max} tags reached` : placeholder}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cx(
            "min-h-11 flex-1 rounded-lg border bg-brand-navy/60 px-3 py-2 font-sans text-sm text-white",
            "placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-red-400/70" : "border-white/15 hover:border-white/25",
          )}
        />
        <Button type="button" size="sm" onClick={addTag} disabled={full || !draft.trim()}>
          Add tag
        </Button>
      </div>
    </FormField>
  );
}
