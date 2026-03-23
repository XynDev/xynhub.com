"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dbList, dbCreate, dbUpdate } from "@/lib/db";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

interface FooterSection {
  id: string;
  section_key: string;
  title: string;
  content: Record<string, unknown>;
  sort_order: number;
}

interface FooterLink {
  label: string;
  url: string;
}

const SECTION_TEMPLATES: Record<string, { title: string; description: string; fields: string[] }> = {
  brand: {
    title: "Brand",
    description: "Company description shown in the footer",
    fields: ["description"],
  },
  platform: {
    title: "Platform Links",
    description: "Links column (e.g. Infrastructure, Security, Ecosystem)",
    fields: ["links"],
  },
  company: {
    title: "Company Links",
    description: "Links column (e.g. About Us, Careers, Legal)",
    fields: ["links"],
  },
  newsletter: {
    title: "Newsletter",
    description: "Email signup section in footer",
    fields: ["placeholder", "button_text"],
  },
  bottom: {
    title: "Bottom Bar",
    description: "Copyright text and legal links at the very bottom",
    fields: ["copyright", "links"],
  },
};

export default function FooterPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-footer"],
    queryFn: () => dbList<FooterSection>("footer_sections", { orderBy: "sort_order" }),
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      dbUpdate("footer_sections", id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-footer"] });
      setEditing(null);
      toast.success("Footer section updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      dbCreate("footer_sections", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-footer"] });
      toast.success("Section created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const startEdit = (section: FooterSection) => {
    setEditing(section.id);
    setFormData({ ...section.content });
  };

  const handleSave = (section: FooterSection) => {
    updateMutation.mutate({
      id: section.id,
      body: {
        section_key: section.section_key,
        title: section.title,
        content: formData,
        sort_order: section.sort_order,
      },
    });
  };

  // Create missing sections
  const existingKeys = data?.data?.map((s) => s.section_key) || [];
  const missingKeys = Object.keys(SECTION_TEMPLATES).filter((k) => !existingKeys.includes(k));

  const createSection = (key: string) => {
    const tmpl = SECTION_TEMPLATES[key];
    const defaultContent: Record<string, unknown> = {};
    if (tmpl.fields.includes("description")) defaultContent.description = "";
    if (tmpl.fields.includes("links")) defaultContent.links = [];
    if (tmpl.fields.includes("placeholder")) defaultContent.placeholder = "Email Address";
    if (tmpl.fields.includes("button_text")) defaultContent.button_text = "Join";
    if (tmpl.fields.includes("copyright")) defaultContent.copyright = `© ${new Date().getFullYear()} XYN Engineering Ecosystem. All rights reserved.`;

    createMutation.mutate({
      section_key: key,
      title: tmpl.title,
      content: defaultContent,
      sort_order: Object.keys(SECTION_TEMPLATES).indexOf(key),
    });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[var(--muted)] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Footer</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Manage footer content — brand description, navigation links, newsletter, and copyright.
        </p>
      </div>

      {/* Missing sections */}
      {missingKeys.length > 0 && (
        <div className="p-4 border-2 border-dashed border-[var(--border)] rounded-lg">
          <p className="text-sm font-medium mb-3">Missing sections — click to create:</p>
          <div className="flex gap-2 flex-wrap">
            {missingKeys.map((key) => (
              <button
                key={key}
                onClick={() => createSection(key)}
                disabled={createMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]"
              >
                <Plus className="w-3.5 h-3.5" />
                {SECTION_TEMPLATES[key].title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {data?.data?.map((section) => {
          const tmpl = SECTION_TEMPLATES[section.section_key];
          const isEditing = editing === section.id;

          return (
            <div key={section.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--muted)]">
                <div>
                  <span className="font-medium text-sm">{tmpl?.title || section.section_key}</span>
                  <span className="ml-2 text-xs text-[var(--muted-foreground)]">{tmpl?.description}</span>
                </div>
                <button
                  onClick={() => isEditing ? setEditing(null) : startEdit(section)}
                  className="text-sm px-3 py-1 rounded border border-[var(--border)] hover:bg-[var(--background)]"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <div className="p-4 space-y-4">
                  <FooterSectionEditor
                    sectionKey={section.section_key}
                    data={formData}
                    onChange={setFormData}
                    inputClass={inputClass}
                  />
                  <button
                    onClick={() => handleSave(section)}
                    disabled={updateMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <div className="p-4 text-sm text-[var(--muted-foreground)]">
                  <FooterSectionPreview sectionKey={section.section_key} data={section.content} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Section Editor ----------
function FooterSectionEditor({
  sectionKey,
  data,
  onChange,
  inputClass,
}: {
  sectionKey: string;
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  inputClass: string;
}) {
  const links = (data.links as FooterLink[]) || [];

  const updateLink = (idx: number, field: keyof FooterLink, value: string) => {
    const updated = [...links];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...data, links: updated });
  };
  const addLink = () => onChange({ ...data, links: [...links, { label: "", url: "#" }] });
  const removeLink = (idx: number) => onChange({ ...data, links: links.filter((_, i) => i !== idx) });

  switch (sectionKey) {
    case "brand":
      return (
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={(data.description as string) || ""}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className={`${inputClass} h-24 resize-y`}
            placeholder="Company tagline or description..."
          />
        </div>
      );

    case "platform":
    case "company":
    case "bottom":
      return (
        <div className="space-y-3">
          {sectionKey === "bottom" && (
            <div>
              <label className="block text-sm font-medium mb-1">Copyright Text</label>
              <input
                value={(data.copyright as string) || ""}
                onChange={(e) => onChange({ ...data, copyright: e.target.value })}
                className={inputClass}
                placeholder="© 2024 Company. All rights reserved."
              />
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Links</label>
              <button type="button" onClick={addLink} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-[var(--border)] hover:bg-[var(--muted)]">
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(idx, "label", e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Label (e.g. About Us)"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="URL (e.g. /about)"
                />
                <button type="button" onClick={() => removeLink(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {links.length === 0 && <p className="text-xs text-[var(--muted-foreground)]">No links yet. Click &quot;Add Link&quot; to start.</p>}
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Placeholder Text</label>
            <input
              value={(data.placeholder as string) || ""}
              onChange={(e) => onChange({ ...data, placeholder: e.target.value })}
              className={inputClass}
              placeholder="Email Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Button Text</label>
            <input
              value={(data.button_text as string) || ""}
              onChange={(e) => onChange({ ...data, button_text: e.target.value })}
              className={inputClass}
              placeholder="Join"
            />
          </div>
        </div>
      );

    default:
      return (
        <div>
          <label className="block text-sm font-medium mb-1">Content (JSON)</label>
          <textarea
            value={JSON.stringify(data, null, 2)}
            onChange={(e) => {
              try { onChange(JSON.parse(e.target.value)); } catch { /* ignore while typing */ }
            }}
            className={`${inputClass} h-32 font-mono`}
          />
        </div>
      );
  }
}

// ---------- Section Preview ----------
function FooterSectionPreview({ sectionKey, data }: { sectionKey: string; data: Record<string, unknown> }) {
  const links = (data.links as FooterLink[]) || [];

  switch (sectionKey) {
    case "brand":
      return <p>{(data.description as string) || "No description set"}</p>;
    case "platform":
    case "company":
      return links.length > 0 ? (
        <ul className="list-disc list-inside space-y-1">{links.map((l, i) => <li key={i}>{l.label} → {l.url}</li>)}</ul>
      ) : <p>No links configured</p>;
    case "newsletter":
      return <p>Placeholder: &quot;{(data.placeholder as string) || "Email Address"}&quot; | Button: &quot;{(data.button_text as string) || "Join"}&quot;</p>;
    case "bottom":
      return (
        <div>
          <p>{(data.copyright as string) || "No copyright text"}</p>
          {links.length > 0 && <ul className="list-disc list-inside mt-1">{links.map((l, i) => <li key={i}>{l.label} → {l.url}</li>)}</ul>}
        </div>
      );
    default:
      return <pre className="text-xs font-mono">{JSON.stringify(data, null, 2)}</pre>;
  }
}
