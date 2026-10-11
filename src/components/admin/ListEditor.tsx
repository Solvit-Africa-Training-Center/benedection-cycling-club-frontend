"use client";

import type { ReactNode } from "react";
import Button from "./Button";
import { cx } from "@/lib/admin/utils";

type ListEditorProps<T> = {
  label: string;
  hint?: string;
  items: T[];
  onChange: (items: T[]) => void;
  /** Returns a blank row. */
  createItem: () => T;
  /** Renders the controls for one row. */
  renderItem: (args: {
    item: T;
    index: number;
    update: (patch: Partial<T>) => void;
  }) => ReactNode;
  /** Accessible name for one row, used in the remove button label. */
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
  emptyMessage?: string;
  error?: string;
  /** Error text for a single row, keyed by index. */
  rowErrors?: Record<number, string>;
  className?: string;
};

/**
 * Repeatable-row editor with add, remove and reorder.
 * Used for cyclist achievements, and reusable for any future list field.
 */
export default function ListEditor<T extends { id: string }>({
  label,
  hint,
  items,
  onChange,
  createItem,
  renderItem,
  itemLabel,
  addLabel = "Add row",
  emptyMessage = "Nothing added yet.",
  error,
  rowErrors,
  className,
}: ListEditorProps<T>) {
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    onChange(next);
  };

  const update = (index: number, patch: Partial<T>) => {
    onChange(items.map((item, position) => (position === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, position) => position !== index));
  };

  return (
    <fieldset className={cx("flex flex-col gap-3", className)}>
      <legend className="font-sans text-sm font-medium text-slate-200">{label}</legend>
      {hint ? <p className="font-sans text-xs text-slate-400">{hint}</p> : null}

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 px-3 py-4 text-center font-sans text-sm text-slate-400">
          {emptyMessage}
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-slate-400">
                  Row {index + 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${itemLabel(item, index)} up`}
                  >
                    <span aria-hidden="true">&uarr;</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${itemLabel(item, index)} down`}
                  >
                    <span aria-hidden="true">&darr;</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${itemLabel(item, index)}`}
                    className="text-red-300 hover:bg-red-500/15 hover:text-red-200"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {renderItem({ item, index, update: (patch) => update(index, patch) })}

              {rowErrors?.[index] ? (
                <p role="alert" className="mt-2 font-sans text-xs font-medium text-red-300">
                  {rowErrors[index]}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      {error ? (
        <p role="alert" className="font-sans text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}

      <div>
        <Button size="sm" onClick={() => onChange([...items, createItem()])}>
          <span aria-hidden="true">+</span> {addLabel}
        </Button>
      </div>
    </fieldset>
  );
}
