"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { MediaPicker } from "@/components/ui/media-picker";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronUp, X } from "lucide-react";

interface MetricItem {
  value: string;
  label: string;
}

interface ToolingItem {
  name: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  image_url: string;
  number: string;
  metrics: MetricItem[];
  tooling: ToolingItem[];
  features: FeatureItem[];
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceFormData {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  image_url: string;
  number: string;
  metrics: MetricItem[];
  tooling: ToolingItem[];
  features: FeatureItem[];
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

const defaultFormData: ServiceFormData = {
  slug: "",
  title: "",
  short_description: "",
  description: "",
  icon: "",
  image_url: "",
  number: "",
  metrics: [],
  tooling: [],
  features: [],
  is_featured: false,
  sort_order: 0,
  is_active: true,
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormData>(defaultFormData);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () =>
      apiFetch<{ data: Service[] }>("/api/v1/admin/services"),
  });

  const services = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: ServiceFormData) =>
      apiFetch("/api/v1/admin/services", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Service created");
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) =>
      apiFetch(`/api/v1/admin/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Service updated");
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/admin/services/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Service deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetForm = () => {
    setForm(defaultFormData);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (service: Service) => {
    setForm({
      slug: service.slug || "",
      title: service.title || "",
      short_description: service.short_description || "",
      description: service.description || "",
      icon: service.icon || "",
      image_url: service.image_url || "",
      number: service.number || "",
      metrics: Array.isArray(service.metrics) ? service.metrics : [],
      tooling: Array.isArray(service.tooling) ? service.tooling : [],
      features: Array.isArray(service.features) ? service.features : [],
      is_featured: service.is_featured ?? false,
      sort_order: service.sort_order ?? 0,
      is_active: service.is_active ?? true,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setForm({ ...form, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Array field helpers
  const addMetric = () =>
    setForm({ ...form, metrics: [...form.metrics, { value: "", label: "" }] });
  const removeMetric = (idx: number) =>
    setForm({ ...form, metrics: form.metrics.filter((_, i) => i !== idx) });
  const updateMetric = (idx: number, field: keyof MetricItem, value: string) => {
    const updated = [...form.metrics];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, metrics: updated });
  };

  const addTooling = () =>
    setForm({ ...form, tooling: [...form.tooling, { name: "" }] });
  const removeTooling = (idx: number) =>
    setForm({ ...form, tooling: form.tooling.filter((_, i) => i !== idx) });
  const updateTooling = (idx: number, value: string) => {
    const updated = [...form.tooling];
    updated[idx] = { name: value };
    setForm({ ...form, tooling: updated });
  };

  const addFeature = () =>
    setForm({ ...form, features: [...form.features, { title: "", description: "" }] });
  const removeFeature = (idx: number) =>
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  const updateFeature = (idx: number, field: keyof FeatureItem, value: string) => {
    const updated = [...form.features];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, features: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage services displayed on the website
          </p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Service"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-[var(--border)] rounded-lg space-y-6 p-6"
        >
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Service" : "New Service"}
          </h3>

          {/* Basic Information */}
          <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
            <legend className="text-sm font-semibold px-2">
              Basic Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onBlur={() => {
                    if (!form.slug) generateSlug();
                  }}
                  className={inputClass}
                  placeholder="e.g. Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slug *
                  {!editingId && form.title && !form.slug && (
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="ml-2 text-xs text-blue-500 hover:underline"
                    >
                      Generate from title
                    </button>
                  )}
                </label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={`${inputClass} font-mono`}
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  placeholder="web-development"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  URL: /services/{form.slug || "..."}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number
                </label>
                <input
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className={inputClass}
                  placeholder='e.g. "01", "02"'
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Material Icon
                </label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. code, cloud, devices"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Google Material Symbols icon name
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  value={form.short_description}
                  onChange={(e) =>
                    setForm({ ...form, short_description: e.target.value })
                  }
                  className={`${inputClass} h-20 resize-y`}
                  placeholder="Brief description shown on home page cards..."
                />
              </div>
            </div>
          </fieldset>

          {/* Media & Display */}
          <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
            <legend className="text-sm font-semibold px-2">
              Media & Display
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <MediaPicker
                  label="Service Image"
                  value={form.image_url}
                  onChange={(v) => setForm({ ...form, image_url: v })}
                  placeholder="Service image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex items-end gap-6 pb-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm({ ...form, is_featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  Featured
                </label>
              </div>
            </div>
          </fieldset>

          {/* Full Description (Markdown) */}
          <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
            <legend className="text-sm font-semibold px-2">
              Full Description (Markdown)
            </legend>
            <MarkdownEditor
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              minHeight="250px"
              placeholder="Write the full service description using Markdown..."
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              Supports full Markdown: headings, bold, italic, lists, code
              blocks, tables, links, images, and more.
            </p>
          </fieldset>

          {/* Metrics */}
          <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
            <legend className="text-sm font-semibold px-2">Metrics</legend>
            <p className="text-xs text-[var(--muted-foreground)]">
              Key statistics for this service (e.g. &quot;99.9%&quot; -
              &quot;Uptime&quot;)
            </p>
            {form.metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={metric.value}
                  onChange={(e) => updateMetric(idx, "value", e.target.value)}
                  className={inputClass}
                  placeholder="Value (e.g. 99.9%)"
                />
                <input
                  value={metric.label}
                  onChange={(e) => updateMetric(idx, "label", e.target.value)}
                  className={inputClass}
                  placeholder="Label (e.g. Uptime)"
                />
                <button
                  type="button"
                  onClick={() => removeMetric(idx)}
                  className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMetric}
              className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </fieldset>

          {/* Tooling */}
          <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
            <legend className="text-sm font-semibold px-2">Tooling</legend>
            <p className="text-xs text-[var(--muted-foreground)]">
              Tools and technologies used for this service
            </p>
            {form.tooling.map((tool, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={tool.name}
                  onChange={(e) => updateTooling(idx, e.target.value)}
                  className={inputClass}
                  placeholder="Tool name (e.g. React, Docker)"
                />
                <button
                  type="button"
                  onClick={() => removeTooling(idx)}
                  className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTooling}
              className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tool
            </button>
          </fieldset>

          {/* Features */}
          <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
            <legend className="text-sm font-semibold px-2">Features</legend>
            <p className="text-xs text-[var(--muted-foreground)]">
              Key features of this service
            </p>
            {form.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 border border-[var(--border)] rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <input
                    value={feature.title}
                    onChange={(e) =>
                      updateFeature(idx, "title", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Feature title"
                  />
                  <textarea
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(idx, "description", e.target.value)
                    }
                    className={`${inputClass} h-16 resize-y`}
                    placeholder="Feature description"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Feature
            </button>
          </fieldset>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Create Service"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[var(--muted)] rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          <p>No services yet. Click &quot;Add Service&quot; to create one.</p>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)]">
                <th className="w-8 px-2 py-3"></th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Icon</th>
                <th className="text-left px-4 py-3 font-medium">Featured</th>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Active</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-2 py-3 text-[var(--muted-foreground)]">
                    <GripVertical className="w-4 h-4" />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{service.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        /{service.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {service.icon ? (
                      <span className="material-symbols-outlined text-base">
                        {service.icon}
                      </span>
                    ) : (
                      <span className="text-[var(--muted-foreground)]">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${service.is_featured ? "bg-yellow-500" : "bg-[var(--muted)]"}`}
                    />
                  </td>
                  <td className="px-4 py-3">{service.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${service.is_active ? "bg-green-500" : "bg-red-500"}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(service)}
                        className="p-2 rounded hover:bg-[var(--muted)]"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this service?"))
                            deleteMutation.mutate(service.id);
                        }}
                        className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
