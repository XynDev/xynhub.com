"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, ChevronDown, ChevronRight, Info, Code } from "lucide-react";
import { getSectionForm, SECTION_DESCRIPTIONS } from "@/components/sections/registry";

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
    queryFn: () => apiFetch<{ data: PageSection[] }>(`/api/v1/admin/pages/${slug}`),
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const updateMutation = useMutation({
    mutationFn: ({ section, content, sort_order }: { section: string; content: Record<string, unknown>; sort_order: number }) =>
      apiFetch(`/api/v1/admin/pages/${slug}/${section}`, {
        method: "PUT",
        body: JSON.stringify({ content, sort_order }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-page", slug] });
      setEditingSection(null);
      setJsonMode(false);
      toast.success("Section updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSave = (section: PageSection) => {
    if (jsonMode) {
      try {
        const parsed = JSON.parse(jsonText);
        updateMutation.mutate({ section: section.section_key, content: parsed, sort_order: section.sort_order });
      } catch {
        toast.error("Invalid JSON — please check your syntax");
      }
    } else {
      updateMutation.mutate({ section: section.section_key, content: editData, sort_order: section.sort_order });
    }
  };

  const openSection = (section: PageSection) => {
    setEditingSection(section.section_key);
    setEditData(structuredClone(section.content));
    setJsonText(JSON.stringify(section.content, null, 2));
    setJsonMode(false);
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

  const descriptions = SECTION_DESCRIPTIONS[slug] || {};

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[var(--muted)] rounded w-48" />
        <div className="h-64 bg-[var(--muted)] rounded" />
      </div>
    );
  }

  const sections = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{pageTitles[slug] || slug}</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Edit content sections for the {slug} page.
          {sections.length === 0 && " No sections found — content needs to be seeded first."}
        </p>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 flex-wrap border-b border-[var(--border)] pb-3">
        {Object.entries(pageTitles).map(([s, title]) => (
          <a
            key={s}
            href={`/pages/${s}`}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              s === slug
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            {title.replace(" Page", "")}
          </a>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--muted-foreground)] mb-2">No sections found for this page.</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Run the seed SQL in Supabase Dashboard &gt; SQL Editor to populate initial content.
          </p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isEditing = editingSection === section.section_key;
          const desc = descriptions[section.section_key];
          const FormComponent = getSectionForm(slug, section.section_key);

          return (
            <div key={section.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    setEditingSection(null);
                    setJsonMode(false);
                  } else {
                    openSection(section);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditing ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="font-mono text-sm font-medium">{section.section_key}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">#{section.sort_order}</span>
                    {FormComponent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 font-medium">Visual Editor</span>
                    )}
                  </div>
                  {desc && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-1 ml-6 flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      {desc}
                    </p>
                  )}
                </div>
              </button>

              {isEditing && (
                <div className="p-4 space-y-4 border-t border-[var(--border)]">
                  {/* Mode toggle */}
                  {FormComponent && (
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!jsonMode) {
                            setJsonText(JSON.stringify(editData, null, 2));
                          } else {
                            try {
                              setEditData(JSON.parse(jsonText));
                            } catch {
                              toast.error("Invalid JSON — can't switch to visual mode");
                              return;
                            }
                          }
                          setJsonMode(!jsonMode);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--muted)]"
                      >
                        <Code className="w-3 h-3" />
                        {jsonMode ? "Visual Editor" : "JSON Editor"}
                      </button>
                    </div>
                  )}

                  {/* Form content */}
                  {jsonMode || !FormComponent ? (
                    <div className="space-y-2">
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Edit the raw JSON content. Each key-value pair maps to a UI element on the website.
                      </p>
                      <textarea
                        value={jsonMode ? jsonText : JSON.stringify(editData, null, 2)}
                        onChange={(e) => {
                          if (jsonMode) {
                            setJsonText(e.target.value);
                          } else {
                            setJsonText(e.target.value);
                            try { setEditData(JSON.parse(e.target.value)); } catch { /* ignore while typing */ }
                          }
                        }}
                        className="w-full h-96 font-mono text-sm p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                        spellCheck={false}
                      />
                    </div>
                  ) : (
                    <FormComponent
                      data={editData}
                      onChange={setEditData}
                    />
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => handleSave(section)}
                      disabled={updateMutation.isPending}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingSection(null); setJsonMode(false); }}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
