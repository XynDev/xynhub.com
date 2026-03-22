"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Save, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { MediaPicker } from "@/components/ui/media-picker";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { ArrayField } from "@/components/ui/array-field";
import { inputClass } from "@/components/ui/form-field";

interface TechItem { icon: string; lang: string; role: string }
interface MetricItem { value: string; label: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>;

export default function NewPortfolioPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    slug: "", title: "", tag: "", description: "", image_url: "",
    sort_order: 0, is_active: true,
  });
  const [techItems, setTechItems] = useState<TechItem[]>([{ icon: "", lang: "", role: "" }]);
  const [metricItems, setMetricItems] = useState<MetricItem[]>([{ value: "", label: "" }]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState({
    hero: { label: "", title: "", description: "", image: "" },
    stats: { icon: "", label: "", value: "", valueLabel: "", tags: [] as string[] },
    narrative: { title: "", paragraphs: [] as string[] },
    features: [] as { id: string; icon: string; title: string; description: string }[],
    gallery: [] as { id: string; label: string; image: string }[],
    cta: { label: "", title: "", description: "" },
    tags: [] as string[],
  });

  const mutation = useMutation({
    mutationFn: (data: AnyData) =>
      apiFetch("/api/v1/admin/portfolios", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolios"] });
      toast.success("Created");
      router.push("/portfolios");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tech_stack: AnyData = {};
    techItems.filter(t => t.lang).forEach((t, i) => { tech_stack[`tech${i + 1}`] = t; });

    const filteredMetrics = metricItems.filter(m => m.value);
    const metrics = filteredMetrics.length === 1
      ? filteredMetrics[0]
      : filteredMetrics.length > 1
        ? { items: filteredMetrics }
        : {};

    mutation.mutate({
      ...form,
      description: form.description || null,
      image_url: form.image_url || null,
      tech_stack,
      metrics,
      detail,
    });
  };

  const toggleSection = (s: string) => {
    const next = new Set(openSections);
    next.has(s) ? next.delete(s) : next.add(s);
    setOpenSections(next);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">New Portfolio</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
          <legend className="text-sm font-semibold px-2">Basic Information</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tag *</label>
              <input required value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className={inputClass} placeholder="e.g. Core Protocol" />
            </div>
            <div>
              <MediaPicker label="Cover Image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
            </div>
          </div>
          <div>
            <MarkdownEditor label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} minHeight="80px" placeholder="Project description (supports markdown)..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" id="is_active" />
              <label htmlFor="is_active" className="text-sm font-medium">Active</label>
            </div>
          </div>
        </fieldset>

        {/* Tech Stack */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold px-2">Tech Stack</legend>
          {techItems.map((tech, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-end">
              <div><label className="block text-xs mb-1">Icon</label><input value={tech.icon} onChange={e => { const n = [...techItems]; n[i] = { ...n[i], icon: e.target.value }; setTechItems(n); }} className={inputClass} placeholder="terminal" /></div>
              <div><label className="block text-xs mb-1">Language</label><input value={tech.lang} onChange={e => { const n = [...techItems]; n[i] = { ...n[i], lang: e.target.value }; setTechItems(n); }} className={inputClass} placeholder="Rust" /></div>
              <div><label className="block text-xs mb-1">Role</label><input value={tech.role} onChange={e => { const n = [...techItems]; n[i] = { ...n[i], role: e.target.value }; setTechItems(n); }} className={inputClass} placeholder="Engine" /></div>
              <button type="button" onClick={() => setTechItems(techItems.filter((_, j) => j !== i))} className="p-2 text-[var(--destructive)] rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setTechItems([...techItems, { icon: "", lang: "", role: "" }])} className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"><Plus className="w-3 h-3" /> Add Technology</button>
        </fieldset>

        {/* Metrics */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold px-2">Metrics</legend>
          {metricItems.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <div><label className="block text-xs mb-1">Value</label><input value={m.value} onChange={e => { const n = [...metricItems]; n[i] = { ...n[i], value: e.target.value }; setMetricItems(n); }} className={inputClass} placeholder="0.02ms" /></div>
              <div><label className="block text-xs mb-1">Label</label><input value={m.label} onChange={e => { const n = [...metricItems]; n[i] = { ...n[i], label: e.target.value }; setMetricItems(n); }} className={inputClass} placeholder="P99 Latency" /></div>
              <button type="button" onClick={() => setMetricItems(metricItems.filter((_, j) => j !== i))} className="p-2 text-[var(--destructive)] rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setMetricItems([...metricItems, { value: "", label: "" }])} className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"><Plus className="w-3 h-3" /> Add Metric</button>
        </fieldset>

        {/* Detail Sections */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold px-2">Detail Page Content</legend>
          <p className="text-xs text-[var(--muted-foreground)]">Content for the portfolio detail page. Optional — expand each section to fill in.</p>

          <CollapsibleSection title="Hero" isOpen={openSections.has("hero")} onToggle={() => toggleSection("hero")}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs mb-1">Label</label><input value={detail.hero.label} onChange={e => setDetail({ ...detail, hero: { ...detail.hero, label: e.target.value } })} className={inputClass} placeholder="Case Study / 2024" /></div>
              <div><label className="block text-xs mb-1">Title</label><input value={detail.hero.title} onChange={e => setDetail({ ...detail, hero: { ...detail.hero, title: e.target.value } })} className={inputClass} /></div>
            </div>
            <div><label className="block text-xs mb-1">Description</label><textarea value={detail.hero.description} onChange={e => setDetail({ ...detail, hero: { ...detail.hero, description: e.target.value } })} className={`${inputClass} h-16`} /></div>
            <MediaPicker label="Hero Image" value={detail.hero.image} onChange={(v) => setDetail({ ...detail, hero: { ...detail.hero, image: v } })} />
          </CollapsibleSection>

          <CollapsibleSection title="Gallery" isOpen={openSections.has("gallery")} onToggle={() => toggleSection("gallery")}>
            <ArrayField
              items={detail.gallery}
              onChange={(gallery) => setDetail({ ...detail, gallery: gallery as typeof detail.gallery })}
              fields={[
                { key: "label", label: "Label", placeholder: "MODULE_ALPHA" },
                { key: "image", label: "Image", type: "media", colSpan: 2 },
              ]}
              defaultItem={{ id: "", label: "", image: "" }}
              renderMediaPicker={(val, onChangeVal) => <MediaPicker value={val} onChange={onChangeVal} />}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Tags" isOpen={openSections.has("tags")} onToggle={() => toggleSection("tags")}>
            <div>
              <label className="block text-xs mb-1">Tags (comma separated)</label>
              <input value={detail.tags.join(", ")} onChange={e => setDetail({ ...detail, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className={inputClass} placeholder="Low-Latency, Rust, gRPC" />
            </div>
          </CollapsibleSection>
        </fieldset>

        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
          <Save className="w-4 h-4" />{mutation.isPending ? "Saving..." : "Create Portfolio"}
        </button>
      </form>
    </div>
  );
}

function CollapsibleSection({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--muted)] hover:bg-[var(--muted)]/80 text-left text-sm font-medium">
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {title}
      </button>
      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}
