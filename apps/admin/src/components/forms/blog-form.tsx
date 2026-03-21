"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { Blog } from "@xynhub/shared";

interface BlogFormProps {
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!blog;

  const [form, setForm] = useState({
    slug: blog?.slug || "",
    title: blog?.title || "",
    category: blog?.category || "Latest",
    tag: blog?.tag || "",
    description: blog?.description || "",
    content: JSON.stringify(blog?.content || {}, null, 2),
    author_name: blog?.author_name || "",
    author_role: blog?.author_role || "",
    author_image: blog?.author_image || "",
    image_url: blog?.image_url || "",
    icon: blog?.icon || "",
    is_featured: blog?.is_featured || false,
    read_time: blog?.read_time || "",
    published_at: blog?.published_at?.slice(0, 16) || "",
    is_active: blog?.is_active ?? true,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch(
        isEdit ? `/api/v1/admin/blogs/${blog!.id}` : "/api/v1/admin/blogs",
        {
          method: isEdit ? "PUT" : "POST",
          body: JSON.stringify(data),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success(isEdit ? "Blog updated" : "Blog created");
      router.push("/blogs");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let content;
    try {
      content = JSON.parse(form.content);
    } catch {
      toast.error("Invalid JSON in content field");
      return;
    }

    mutation.mutate({
      ...form,
      content,
      tag: form.tag || null,
      author_image: form.author_image || null,
      image_url: form.image_url || null,
      icon: form.icon || null,
      read_time: form.read_time || null,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
    });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={inputClass}
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            placeholder="my-blog-post"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Category *</label>
          <input
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Tag</label>
          <input
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Author Name *</label>
          <input
            required
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Author Role</label>
          <input
            value={form.author_role}
            onChange={(e) => setForm({ ...form, author_role: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Author Image URL</label>
          <input
            value={form.author_image}
            onChange={(e) => setForm({ ...form, author_image: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Cover Image URL</label>
          <input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Icon</label>
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className={inputClass}
            placeholder="terminal, memory, science..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Read Time</label>
          <input
            value={form.read_time}
            onChange={(e) => setForm({ ...form, read_time: e.target.value })}
            className={inputClass}
            placeholder="10 Min Read"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Published At</label>
          <input
            type="datetime-local"
            value={form.published_at}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="w-4 h-4"
            />
            Featured
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description *</label>
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} h-24 resize-y`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          Content (JSON)
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={`${inputClass} h-64 font-mono resize-y`}
          spellCheck={false}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending
            ? "Saving..."
            : isEdit
            ? "Update Blog"
            : "Create Blog"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/blogs")}
          className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
