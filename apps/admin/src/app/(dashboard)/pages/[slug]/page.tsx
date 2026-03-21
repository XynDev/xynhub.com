"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  content: Record<string, unknown>;
  sort_order: number;
}

export default function PageEditorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-page", slug],
    queryFn: () =>
      apiFetch<{ data: PageSection[] }>(`/api/v1/admin/pages/${slug}`),
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const updateMutation = useMutation({
    mutationFn: ({
      section,
      content,
      sort_order,
    }: {
      section: string;
      content: Record<string, unknown>;
      sort_order: number;
    }) =>
      apiFetch(`/api/v1/admin/pages/${slug}/${section}`, {
        method: "PUT",
        body: JSON.stringify({ content, sort_order }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-page", slug] });
      setEditingSection(null);
      toast.success("Section updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSave = (section: PageSection) => {
    try {
      const parsed = JSON.parse(editContent);
      updateMutation.mutate({
        section: section.section_key,
        content: parsed,
        sort_order: section.sort_order,
      });
    } catch {
      toast.error("Invalid JSON format");
    }
  };

  const pageTitles: Record<string, string> = {
    home: "Home Page",
    about: "About Page",
    services: "Services Page",
    "service-detail": "Service Detail Page",
    process: "Process Page",
    blogs: "Blogs Page",
    portofolio: "Portfolio Page",
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-[var(--muted)] rounded w-48" /><div className="h-64 bg-[var(--muted)] rounded" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {pageTitles[slug] || slug}
        </h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Edit content sections for the {slug} page
        </p>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(pageTitles).map(([s, title]) => (
          <a
            key={s}
            href={`/pages/${s}`}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              s === slug
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                : "border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            {title.replace(" Page", "")}
          </a>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {data?.data?.map((section) => (
          <div
            key={section.id}
            className="border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--muted)]">
              <div>
                <span className="font-mono text-sm font-medium">
                  {section.section_key}
                </span>
                <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                  (order: {section.sort_order})
                </span>
              </div>
              <button
                onClick={() => {
                  if (editingSection === section.section_key) {
                    setEditingSection(null);
                  } else {
                    setEditingSection(section.section_key);
                    setEditContent(
                      JSON.stringify(section.content, null, 2)
                    );
                  }
                }}
                className="text-sm px-3 py-1 rounded border border-[var(--border)] hover:bg-[var(--background)] transition-colors"
              >
                {editingSection === section.section_key ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingSection === section.section_key ? (
              <div className="p-4 space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-96 font-mono text-sm p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  spellCheck={false}
                />
                <button
                  onClick={() => handleSave(section)}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <pre className="p-4 text-xs font-mono overflow-auto max-h-48 text-[var(--muted-foreground)]">
                {JSON.stringify(section.content, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
