"use client";

import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "media";
  placeholder?: string;
  colSpan?: number;
}

interface ArrayFieldProps {
  label?: string;
  items: AnyRecord[];
  onChange: (items: AnyRecord[]) => void;
  fields: FieldDef[];
  defaultItem: AnyRecord;
  maxItems?: number;
  /** Render media picker for 'media' type fields. Passed to avoid circular deps. */
  renderMediaPicker?: (value: string, onChangeVal: (v: string) => void) => React.ReactNode;
}

export function ArrayField({
  label,
  items,
  onChange,
  fields,
  defaultItem,
  maxItems,
  renderMediaPicker,
}: ArrayFieldProps) {
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  const add = () => {
    if (maxItems && items.length >= maxItems) return;
    onChange([...items, { ...defaultItem, id: `item-${Date.now()}` }]);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const update = (index: number, key: string, value: unknown) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.id || i}
            className="border border-[var(--border)] rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <GripVertical className="w-3.5 h-3.5" />
                <span>#{i + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="p-1 rounded hover:bg-[var(--muted)] disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={i === items.length - 1}
                  className="p-1 rounded hover:bg-[var(--muted)] disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 rounded text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.key} className={f.colSpan === 2 ? "md:col-span-2" : ""}>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1">
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={item[f.key] ?? ""}
                      onChange={(e) => update(i, f.key, e.target.value)}
                      className={`${inputClass} h-16 resize-y`}
                      placeholder={f.placeholder}
                    />
                  ) : f.type === "media" && renderMediaPicker ? (
                    renderMediaPicker(
                      item[f.key] ?? "",
                      (v) => update(i, f.key, v)
                    )
                  ) : (
                    <input
                      value={item[f.key] ?? ""}
                      onChange={(e) => update(i, f.key, e.target.value)}
                      className={inputClass}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        disabled={maxItems ? items.length >= maxItems : false}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline disabled:opacity-50"
      >
        <Plus className="w-3.5 h-3.5" /> Add Item
      </button>
    </div>
  );
}
