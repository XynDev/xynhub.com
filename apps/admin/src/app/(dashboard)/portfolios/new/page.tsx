"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function NewPortfolioPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    slug: "", title: "", tag: "", description: "", image_url: "",
    tech_stack: "{}", metrics: "{}", sort_order: 0, is_active: true,
    detail: JSON.stringify({ hero: {}, stats: {}, narrative: {}, features: [], gallery: [], cta: {}, tags: [] }, null, 2),
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch("/api/v1/admin/portfolios", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-portfolios"] }); toast.success("Created"); router.push("/portfolios"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mutation.mutate({
        slug: form.slug, title: form.title, tag: form.tag,
        description: form.description || null, image_url: form.image_url || null,
        tech_stack: JSON.parse(form.tech_stack), metrics: JSON.parse(form.metrics),
        sort_order: form.sort_order, is_active: form.is_active,
        detail: JSON.parse(form.detail),
      });
    } catch { toast.error("Invalid JSON"); }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">New Portfolio</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Title *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Slug *</label><input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className={inputClass} pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" /></div>
          <div><label className="block text-sm font-medium mb-1">Tag *</label><input required value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className={inputClass} /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputClass} h-20`} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Tech Stack (JSON)</label><textarea value={form.tech_stack} onChange={e => setForm({...form, tech_stack: e.target.value})} className={`${inputClass} h-24 font-mono`} /></div>
          <div><label className="block text-sm font-medium mb-1">Metrics (JSON)</label><textarea value={form.metrics} onChange={e => setForm({...form, metrics: e.target.value})} className={`${inputClass} h-24 font-mono`} /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Detail (JSON)</label><textarea value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} className={`${inputClass} h-64 font-mono`} spellCheck={false} /></div>
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"><Save className="w-4 h-4" />{mutation.isPending ? "Saving..." : "Create"}</button>
      </form>
    </div>
  );
}
