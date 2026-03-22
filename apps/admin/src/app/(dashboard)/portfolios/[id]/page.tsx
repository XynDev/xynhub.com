"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { MediaPicker } from "@/components/ui/media-picker";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { ArrayField } from "@/components/ui/array-field";

interface TechItem { icon: string; lang: string; role: string }
interface MetricItem { value: string; label: string }
interface FeatureItem { id: string; icon: string; title: string; description: string }
interface GalleryItem { id: string; label: string; image: string }
interface ButtonItem { label: string; url: string }

interface DetailData {
  hero: { label?: string; title?: string; description?: string; image?: string };
  stats: { icon?: string; label?: string; value?: string; valueLabel?: string; tags?: string[] };
  narrative: { title?: string; paragraphs?: string[]; buttons?: ButtonItem[] };
  features: FeatureItem[];
  gallery: GalleryItem[];
  cta: { label?: string; title?: string; description?: string; buttons?: ButtonItem[] };
  tags: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>;

export default function EditPortfolioPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-portfolio", id],
    queryFn: () => apiFetch<{ data: AnyData }>(`/api/v1/admin/portfolios/${id}`),
  });

  const [form, setForm] = useState({
    slug: "", title: "", tag: "", description: "", short_description: "", image_url: "",
    sort_order: 0, is_active: true, is_featured: false,
  });
  const [techItems, setTechItems] = useState<TechItem[]>([]);
  const [metricItems, setMetricItems] = useState<MetricItem[]>([]);
  const [detail, setDetail] = useState<DetailData>({
    hero: {}, stats: {}, narrative: {}, features: [], gallery: [], cta: {}, tags: [],
  });
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data?.data) {
      const d = data.data;
      setForm({
        slug: (d.slug as string) || "",
        title: (d.title as string) || "",
        tag: (d.tag as string) || "",
        description: (d.description as string) || "",
        short_description: (d.short_description as string) || "",
        image_url: (d.image_url as string) || "",
        sort_order: (d.sort_order as number) || 0,
        is_active: (d.is_active as boolean) ?? true,
        is_featured: (d.is_featured as boolean) ?? false,
      });

      // Parse tech_stack
      const ts = d.tech_stack || {};
      if (ts.tech1 || ts.tech2) {
        const items: TechItem[] = [];
        if (ts.tech1) items.push(ts.tech1);
        if (ts.tech2) items.push(ts.tech2);
        setTechItems(items);
      } else if (ts.stack) {
        setTechItems(ts.stack.map((s: string) => ({ icon: "", lang: s, role: "" })));
      }

      // Parse metrics
      const m = d.metrics || {};
      if (Array.isArray(m)) {
        setMetricItems(m);
      } else if (m.items) {
        setMetricItems(m.items);
      } else if (m.value) {
        setMetricItems([{ value: m.value, label: m.label || "" }]);
      }

      // Parse detail
      const det = d.detail || {};
      setDetail({
        hero: det.hero || {},
        stats: det.stats || {},
        narrative: det.narrative || {},
        features: det.features || [],
        gallery: det.gallery || [],
        cta: det.cta || {},
        tags: det.tags || [],
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (body: AnyData) =>
      apiFetch(`/api/v1/admin/portfolios/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolios"] });
      toast.success("Updated");
      router.push("/portfolios");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build tech_stack
    const tech_stack: AnyData = {};
    techItems.forEach((t, i) => { tech_stack[`tech${i + 1}`] = t; });
    if (techItems.some(t => !t.icon && !t.role)) {
      tech_stack.stack = techItems.map(t => t.lang).filter(Boolean);
      techItems.forEach(t => { if (t.role) tech_stack.memory = t.role; });
    }

    // Build metrics
    const metrics = metricItems.length === 1 && !metricItems[0].label
      ? metricItems[0]
      : metricItems.length > 1
        ? { items: metricItems }
        : metricItems.length === 1
          ? metricItems[0]
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

  if (isLoading) return <div className="animate-pulse h-96 bg-[var(--muted)] rounded-lg" />;

  const inputClass = "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Edit Portfolio</h1>
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
              <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tag *</label>
              <input required value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className={inputClass} placeholder="e.g. Core Protocol, Frontend Engineering" />
            </div>
            <div>
              <MediaPicker label="Cover Image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description (for home page)</label>
            <input value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} className={inputClass} placeholder="Brief summary shown on home page featured works" />
          </div>
          <div>
            <MarkdownEditor label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} minHeight="80px" placeholder="Project description (supports markdown)..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
            </div>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4" />
                Featured
              </label>
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" id="is_active" />
              <label htmlFor="is_active" className="text-sm font-medium">Active</label>
            </div>
          </div>
        </fieldset>

        {/* Tech Stack */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold px-2">Tech Stack</legend>
          <p className="text-xs text-[var(--muted-foreground)]">Technologies used in this project. Icon uses Material Symbols name.</p>
          {techItems.map((tech, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-end">
              <div>
                <label className="block text-xs mb-1">Icon</label>
                <input value={tech.icon} onChange={e => { const n = [...techItems]; n[i] = { ...n[i], icon: e.target.value }; setTechItems(n); }} className={inputClass} placeholder="terminal" />
              </div>
              <div>
                <label className="block text-xs mb-1">Language/Name</label>
                <input value={tech.lang} onChange={e => { const n = [...techItems]; n[i] = { ...n[i], lang: e.target.value }; setTechItems(n); }} className={inputClass} placeholder="Rust" />
              </div>
              <div>
                <label className="block text-xs mb-1">Role</label>
                <input value={tech.role} onChange={e => { const n = [...techItems]; n[i] = { ...n[i], role: e.target.value }; setTechItems(n); }} className={inputClass} placeholder="Engine" />
              </div>
              <button type="button" onClick={() => setTechItems(techItems.filter((_, j) => j !== i))} className="p-2 text-[var(--destructive)] hover:bg-red-50 dark:hover:bg-red-950 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setTechItems([...techItems, { icon: "", lang: "", role: "" }])} className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline">
            <Plus className="w-3 h-3" /> Add Technology
          </button>
        </fieldset>

        {/* Metrics */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold px-2">Metrics</legend>
          <p className="text-xs text-[var(--muted-foreground)]">Key performance metrics displayed on the portfolio card.</p>
          {metricItems.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="block text-xs mb-1">Value</label>
                <input value={m.value} onChange={e => { const n = [...metricItems]; n[i] = { ...n[i], value: e.target.value }; setMetricItems(n); }} className={inputClass} placeholder="0.02ms" />
              </div>
              <div>
                <label className="block text-xs mb-1">Label</label>
                <input value={m.label} onChange={e => { const n = [...metricItems]; n[i] = { ...n[i], label: e.target.value }; setMetricItems(n); }} className={inputClass} placeholder="P99 Latency" />
              </div>
              <button type="button" onClick={() => setMetricItems(metricItems.filter((_, j) => j !== i))} className="p-2 text-[var(--destructive)] hover:bg-red-50 dark:hover:bg-red-950 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setMetricItems([...metricItems, { value: "", label: "" }])} className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline">
            <Plus className="w-3 h-3" /> Add Metric
          </button>
        </fieldset>

        {/* Detail Sections (collapsible) */}
        <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold px-2">Detail Page Content</legend>
          <p className="text-xs text-[var(--muted-foreground)]">Content shown on the portfolio detail page. Click each section to expand.</p>

          {/* Hero */}
          <CollapsibleSection title="Hero" isOpen={openSections.has("hero")} onToggle={() => toggleSection("hero")}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs mb-1">Label</label><input value={detail.hero.label || ""} onChange={e => setDetail({ ...detail, hero: { ...detail.hero, label: e.target.value } })} className={inputClass} placeholder="Case Study / 2024" /></div>
              <div><label className="block text-xs mb-1">Title</label><input value={detail.hero.title || ""} onChange={e => setDetail({ ...detail, hero: { ...detail.hero, title: e.target.value } })} className={inputClass} /></div>
            </div>
            <div><label className="block text-xs mb-1">Description</label><textarea value={detail.hero.description || ""} onChange={e => setDetail({ ...detail, hero: { ...detail.hero, description: e.target.value } })} className={`${inputClass} h-16`} /></div>
            <MediaPicker label="Hero Image" value={detail.hero.image || ""} onChange={(v) => setDetail({ ...detail, hero: { ...detail.hero, image: v } })} />
          </CollapsibleSection>

          {/* Stats */}
          <CollapsibleSection title="Stats" isOpen={openSections.has("stats")} onToggle={() => toggleSection("stats")}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs mb-1">Icon</label><input value={detail.stats.icon || ""} onChange={e => setDetail({ ...detail, stats: { ...detail.stats, icon: e.target.value } })} className={inputClass} placeholder="hub" /></div>
              <div><label className="block text-xs mb-1">Label</label><input value={detail.stats.label || ""} onChange={e => setDetail({ ...detail, stats: { ...detail.stats, label: e.target.value } })} className={inputClass} /></div>
              <div><label className="block text-xs mb-1">Value</label><input value={detail.stats.value || ""} onChange={e => setDetail({ ...detail, stats: { ...detail.stats, value: e.target.value } })} className={inputClass} placeholder="0.4ms" /></div>
              <div><label className="block text-xs mb-1">Value Label</label><input value={detail.stats.valueLabel || ""} onChange={e => setDetail({ ...detail, stats: { ...detail.stats, valueLabel: e.target.value } })} className={inputClass} /></div>
            </div>
            <div>
              <label className="block text-xs mb-1">Tags (comma separated)</label>
              <input value={(detail.stats.tags || []).join(", ")} onChange={e => setDetail({ ...detail, stats: { ...detail.stats, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })} className={inputClass} placeholder="Rust, gRPC, Protocol Buffers" />
            </div>
          </CollapsibleSection>

          {/* Narrative */}
          <CollapsibleSection title="Narrative" isOpen={openSections.has("narrative")} onToggle={() => toggleSection("narrative")}>
            <div><label className="block text-xs mb-1">Title</label><input value={detail.narrative.title || ""} onChange={e => setDetail({ ...detail, narrative: { ...detail.narrative, title: e.target.value } })} className={inputClass} /></div>
            <div>
              <label className="block text-xs mb-1">Paragraphs (one per line)</label>
              <textarea value={(detail.narrative.paragraphs || []).join("\n\n")} onChange={e => setDetail({ ...detail, narrative: { ...detail.narrative, paragraphs: e.target.value.split("\n\n").filter(Boolean) } })} className={`${inputClass} h-32`} />
            </div>
          </CollapsibleSection>

          {/* Features */}
          <CollapsibleSection title="Features" isOpen={openSections.has("features")} onToggle={() => toggleSection("features")}>
            {detail.features.map((f, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-end border-b border-[var(--border)] pb-2 mb-2">
                <div><label className="block text-xs mb-1">Icon</label><input value={f.icon} onChange={e => { const n = [...detail.features]; n[i] = { ...n[i], icon: e.target.value }; setDetail({ ...detail, features: n }); }} className={inputClass} /></div>
                <div className="col-span-2"><label className="block text-xs mb-1">Title</label><input value={f.title} onChange={e => { const n = [...detail.features]; n[i] = { ...n[i], title: e.target.value }; setDetail({ ...detail, features: n }); }} className={inputClass} /></div>
                <div><label className="block text-xs mb-1">Description</label><input value={f.description} onChange={e => { const n = [...detail.features]; n[i] = { ...n[i], description: e.target.value }; setDetail({ ...detail, features: n }); }} className={inputClass} /></div>
                <button type="button" onClick={() => setDetail({ ...detail, features: detail.features.filter((_, j) => j !== i) })} className="p-2 text-[var(--destructive)] rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setDetail({ ...detail, features: [...detail.features, { id: crypto.randomUUID(), icon: "", title: "", description: "" }] })} className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline">
              <Plus className="w-3 h-3" /> Add Feature
            </button>
          </CollapsibleSection>

          {/* Gallery */}
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

          {/* CTA */}
          <CollapsibleSection title="Call to Action" isOpen={openSections.has("cta")} onToggle={() => toggleSection("cta")}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs mb-1">Label</label><input value={detail.cta.label || ""} onChange={e => setDetail({ ...detail, cta: { ...detail.cta, label: e.target.value } })} className={inputClass} /></div>
              <div><label className="block text-xs mb-1">Title</label><input value={detail.cta.title || ""} onChange={e => setDetail({ ...detail, cta: { ...detail.cta, title: e.target.value } })} className={inputClass} /></div>
            </div>
            <div><label className="block text-xs mb-1">Description</label><textarea value={detail.cta.description || ""} onChange={e => setDetail({ ...detail, cta: { ...detail.cta, description: e.target.value } })} className={`${inputClass} h-16`} /></div>
          </CollapsibleSection>

          {/* Tags */}
          <CollapsibleSection title="Tags" isOpen={openSections.has("tags")} onToggle={() => toggleSection("tags")}>
            <div>
              <label className="block text-xs mb-1">Tags (comma separated)</label>
              <input value={detail.tags.join(", ")} onChange={e => setDetail({ ...detail, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className={inputClass} placeholder="Low-Latency, Rust, gRPC" />
            </div>
          </CollapsibleSection>
        </fieldset>

        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
          <Save className="w-4 h-4" />{mutation.isPending ? "Saving..." : "Update Portfolio"}
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
