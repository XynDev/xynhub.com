"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dbCreate, dbUpdate, dbDelete } from "@/lib/db";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { MediaPicker } from "@/components/ui/media-picker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface CrudListProps<T extends { id: string }> {
  title: string;
  description: string;
  queryKey: string;
  table: string;
  items: T[];
  isLoading: boolean;
  columns: { key: keyof T | string; label: string; render?: (item: T) => React.ReactNode }[];
  formFields: {
    key: string;
    label: string;
    type?: "text" | "textarea" | "number" | "checkbox" | "json" | "select" | "media";
    required?: boolean;
    placeholder?: string;
    options?: { label: string; value: string }[];
  }[];
  defaultValues: Record<string, unknown>;
}

export function CrudList<T extends { id: string }>({
  title,
  description,
  queryKey,
  table,
  items,
  isLoading,
  columns,
  formFields,
  defaultValues,
}: CrudListProps<T>) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaultValues);

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => dbCreate(table, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Created");
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      dbUpdate(table, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Updated");
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dbDelete(table, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetForm = () => {
    setForm(defaultValues);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (item: T) => {
    const values: Record<string, unknown> = {};
    const rec = item as AnyRecord;
    formFields.forEach((f) => {
      if (f.type === "json") {
        values[f.key] = JSON.stringify(rec[f.key] || {}, null, 2);
      } else {
        values[f.key] = rec[f.key] ?? defaultValues[f.key];
      }
    });
    setForm(values);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    // Parse JSON fields
    formFields.forEach((f) => {
      if (f.type === "json" && typeof data[f.key] === "string") {
        try {
          data[f.key] = JSON.parse(data[f.key] as string);
        } catch {
          toast.error(`Invalid JSON in ${f.label}`);
          return;
        }
      }
    });

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-[var(--muted-foreground)] mt-1">{description}</p>
        </div>
        <button
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : `Add ${title.replace(/s$/, "")}`}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 border border-[var(--border)] rounded-lg space-y-4"
        >
          <h3 className="font-medium">{editingId ? "Edit" : "New"} {title.replace(/s$/, "")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.key} className={field.type === "textarea" || field.type === "json" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium mb-1">{field.label}{field.required && " *"}</label>
                {field.type === "media" ? (
                  <MediaPicker
                    label={field.label}
                    value={(form[field.key] as string) || ""}
                    onChange={(v) => setForm({ ...form, [field.key]: v })}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={!!form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                    className="w-4 h-4"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={inputClass}
                  >
                    {field.options ? field.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    )) : (
                      <>
                        <option value="col-span-12 md:col-span-6">Half Width (Default)</option>
                        <option value="col-span-12 md:col-span-7">Wide (7/12)</option>
                        <option value="col-span-12 md:col-span-5">Narrow (5/12)</option>
                        <option value="col-span-12">Full Width</option>
                        <option value="col-span-12 md:col-span-4">Third (4/12)</option>
                        <option value="col-span-12 md:col-span-8">Two Thirds (8/12)</option>
                      </>
                    )}
                  </select>
                ) : field.type === "textarea" || field.type === "json" ? (
                  <textarea
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={`${inputClass} ${field.type === "json" ? "h-32 font-mono" : "h-24"} resize-y`}
                    required={field.required}
                    spellCheck={field.type === "json" ? false : undefined}
                  />
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    value={(form[field.key] as number) || 0}
                    onChange={(e) => setForm({ ...form, [field.key]: parseInt(e.target.value) || 0 })}
                    className={inputClass}
                    required={field.required}
                  />
                ) : (
                  <input
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className={inputClass}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-[var(--muted)] rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)]">
                <th className="w-8 px-2 py-3"></th>
                {columns.map((col) => (
                  <th key={col.key as string} className="text-left px-4 py-3 font-medium">{col.label}</th>
                ))}
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-2 py-3 text-[var(--muted-foreground)]"><GripVertical className="w-4 h-4" /></td>
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-4 py-3">
                      {col.render ? col.render(item) : String((item as AnyRecord)[col.key as string] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(item)} className="p-2 rounded hover:bg-[var(--muted)]"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if(confirm("Delete?")) deleteMutation.mutate(item.id); }} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
