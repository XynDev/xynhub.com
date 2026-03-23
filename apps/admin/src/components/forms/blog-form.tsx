"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { dbCreate, dbUpdate } from "@/lib/db";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { Blog } from "@xynhub/shared";
import { MediaPicker } from "@/components/ui/media-picker";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

interface BlogFormProps {
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!blog;

  // Blog content is stored as JSONB with markdown in each section
  // We flatten it to a single markdown string for editing
  const existingMarkdown = blog?.content
    ? typeof (blog.content as Record<string, unknown>).body === "string"
      ? (blog.content as Record<string, string>).body
      : JSON.stringify(blog.content, null, 2)
    : "";

  const [form, setForm] = useState({
    slug: blog?.slug || "",
    title: blog?.title || "",
    category: blog?.category || "Latest",
    tag: blog?.tag || "",
    description: blog?.description || "",
    body: existingMarkdown,
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
      isEdit
        ? dbUpdate("blogs", blog!.id, data)
        : dbCreate("blogs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success(isEdit ? "Blog updated" : "Blog created");
      router.push("/blogs");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store content as { body: "markdown..." } for the FE to render
    const content = { body: form.body };

    mutation.mutate({
      slug: form.slug,
      title: form.title,
      category: form.category,
      description: form.description,
      content,
      tag: form.tag || null,
      author_name: form.author_name,
      author_role: form.author_role || null,
      author_image: form.author_image || null,
      image_url: form.image_url || null,
      icon: form.icon || null,
      is_featured: form.is_featured,
      read_time: form.read_time || null,
      published_at: form.published_at
        ? new Date(form.published_at).toISOString()
        : null,
      is_active: form.is_active,
    });
  };

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setForm({ ...form, slug });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
        <legend className="text-sm font-semibold px-2">Basic Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onBlur={() => { if (!form.slug) generateSlug(); }}
              className={inputClass}
              placeholder="My Blog Post Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug *
              {!isEdit && form.title && !form.slug && (
                <button type="button" onClick={generateSlug} className="ml-2 text-xs text-blue-500 hover:underline">
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
              placeholder="my-blog-post"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">URL: /blogs/{form.slug || "..."}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            >
              <option value="Latest">Latest</option>
              <option value="Research">Research</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tag</label>
            <input
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className={inputClass}
              placeholder="e.g. Engineering, Design"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Description *</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} h-20 resize-y`}
            placeholder="A brief summary shown in blog listings..."
          />
        </div>
      </fieldset>

      {/* Author & Media */}
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
        <legend className="text-sm font-semibold px-2">Author & Media</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Author Name *</label>
            <input
              required
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author Role</label>
            <input
              value={form.author_role}
              onChange={(e) => setForm({ ...form, author_role: e.target.value })}
              className={inputClass}
              placeholder="e.g. Lead Engineer"
            />
          </div>
          <div>
            <MediaPicker label="Author Image" value={form.author_image} onChange={(v) => setForm({ ...form, author_image: v })} placeholder="Author avatar URL" />
          </div>
          <div>
            <MediaPicker label="Cover Image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="Cover image URL" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material Icon</label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className={inputClass}
              placeholder="e.g. terminal, science, memory"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Google Material Symbols icon name</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Read Time</label>
            <input
              value={form.read_time}
              onChange={(e) => setForm({ ...form, read_time: e.target.value })}
              className={inputClass}
              placeholder="e.g. 10 Min Read"
            />
          </div>
        </div>
      </fieldset>

      {/* Publishing */}
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-4">
        <legend className="text-sm font-semibold px-2">Publishing</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Publish Date</label>
            <input
              type="datetime-local"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex items-end gap-6 pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              Featured
            </label>
          </div>
        </div>
      </fieldset>

      {/* Content - Markdown Editor */}
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-sm font-semibold px-2">Content (Markdown)</legend>
        <MarkdownEditor
          value={form.body}
          onChange={(v) => setForm({ ...form, body: v })}
          minHeight="400px"
          placeholder={`# Introduction\n\nWrite your blog content here using **Markdown**.\n\n## Subheading\n\n- Bullet points\n- Are supported\n\n> Blockquotes too\n\n\`\`\`javascript\nconst code = "highlighted";\n\`\`\``}
        />
        <p className="text-xs text-[var(--muted-foreground)]">
          Supports full Markdown: headings, bold, italic, lists, code blocks, tables, links, images, and more.
        </p>
      </fieldset>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/blogs")}
          className="px-6 py-2.5 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
