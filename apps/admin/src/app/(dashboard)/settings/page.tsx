"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, Info } from "lucide-react";
import { MediaPicker } from "@/components/ui/media-picker";

interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyVal = any;

// Known settings with descriptions and their expected format
const IMAGE_SETTINGS = new Set(["logo_light", "logo_dark", "logo_icon_light", "logo_icon_dark", "og_image"]);

const KNOWN_SETTINGS: Record<string, { description: string; type: "text" | "json" | "boolean" | "image"; fields?: string[] }> = {
  site_name: { description: "Website name, used in SEO and browser tab title", type: "text" },
  site_description: { description: "Default meta description for search engines", type: "text" },
  contact_email: { description: "Contact email displayed on the website", type: "text" },
  social_links: { description: "Social media links for the website footer", type: "json", fields: ["github", "telegram", "email", "twitter", "linkedin"] },
  analytics_id: { description: "Google Analytics or tracking ID", type: "text" },
  maintenance_mode: { description: "Enable to show maintenance page to visitors", type: "boolean" },
  seo_default: { description: "Default SEO metadata for all pages", type: "json", fields: ["title", "description", "keywords", "image"] },
  logo_light: { description: "Logo for light theme (upload image)", type: "image" },
  logo_dark: { description: "Logo for dark theme (upload image)", type: "image" },
  logo_icon_light: { description: "Icon logo for light theme (upload image)", type: "image" },
  logo_icon_dark: { description: "Icon logo for dark theme (upload image)", type: "image" },
  og_image: { description: "Default Open Graph image for social sharing", type: "image" },
  header_cta: { description: "Header 'Get Started' button config", type: "json", fields: ["text", "url"] },
};

// Extract the display value from setting value (handles { value: "..." } and { url: "..." } wrappers)
function getDisplayValue(val: AnyVal): string {
  if (typeof val === "string") return val;
  if (val?.value) return String(val.value);
  if (val?.url) return String(val.url);
  return JSON.stringify(val, null, 2);
}

// Wrap value back to the format the DB expects
function wrapValue(key: string, val: string, original: AnyVal): AnyVal {
  if (original?.url !== undefined) return { url: val };
  if (original?.value !== undefined) return { value: val };
  if (original?.enabled !== undefined) return { enabled: val === "true" };
  return { value: val };
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showNew, setShowNew] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => apiFetch<{ data: Setting[] }>("/api/v1/admin/settings"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: AnyVal }) =>
      apiFetch(`/api/v1/admin/settings/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      setEditingKey(null);
      toast.success("Setting updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) =>
      apiFetch(`/api/v1/admin/settings/${key}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Deleted");
    },
  });

  const handleSave = (setting: Setting) => {
    const meta = KNOWN_SETTINGS[setting.key];
    if (meta?.type === "image") {
      updateMutation.mutate({ key: setting.key, value: { url: editValue } });
    } else if (meta?.type === "json" && meta.fields) {
      updateMutation.mutate({ key: setting.key, value: editFields });
    } else if (meta?.type === "boolean") {
      updateMutation.mutate({ key: setting.key, value: { enabled: editValue === "true" } });
    } else if (meta?.type === "text") {
      updateMutation.mutate({ key: setting.key, value: wrapValue(setting.key, editValue, setting.value) });
    } else {
      try {
        updateMutation.mutate({ key: setting.key, value: JSON.parse(editValue) });
      } catch {
        toast.error("Invalid JSON");
      }
    }
  };

  const startEdit = (setting: Setting) => {
    const meta = KNOWN_SETTINGS[setting.key];
    if (meta?.type === "image") {
      setEditValue((setting.value as AnyVal)?.url || getDisplayValue(setting.value));
    } else if (meta?.type === "json" && meta.fields) {
      const fields: Record<string, string> = {};
      meta.fields.forEach(f => { fields[f] = String((setting.value as AnyVal)?.[f] || ""); });
      setEditFields(fields);
    } else if (meta?.type === "boolean") {
      setEditValue(String(!!(setting.value as AnyVal)?.enabled));
    } else if (meta?.type === "text") {
      setEditValue(getDisplayValue(setting.value));
    } else {
      setEditValue(JSON.stringify(setting.value, null, 2));
    }
    setEditingKey(setting.key);
  };

  const handleCreate = () => {
    if (!newKey.trim()) return toast.error("Key is required");
    const meta = KNOWN_SETTINGS[newKey];
    let val: AnyVal;
    if (meta?.type === "text") {
      val = { value: newValue };
    } else if (meta?.type === "boolean") {
      val = { enabled: false };
    } else {
      try { val = newValue ? JSON.parse(newValue) : {}; } catch { val = { value: newValue }; }
    }
    updateMutation.mutate({ key: newKey, value: val });
    setNewKey("");
    setNewValue("");
    setShowNew(false);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";
  const existingKeys = new Set(data?.data?.map(s => s.key) || []);
  const missingKnown = Object.keys(KNOWN_SETTINGS).filter(k => !existingKeys.has(k));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Global configuration for the website.</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Setting
        </button>
      </div>

      {showNew && (
        <div className="p-4 border border-[var(--border)] rounded-lg space-y-3">
          <h3 className="text-sm font-medium">New Setting</h3>
          {missingKnown.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Quick Add</label>
              <div className="flex flex-wrap gap-2">
                {missingKnown.map(k => (
                  <button key={k} type="button" onClick={() => { setNewKey(k); setNewValue(""); }} className={`px-3 py-1 text-xs rounded-full border ${newKey === k ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--border)] hover:bg-[var(--muted)]"}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Key</label>
            <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="setting_key" className={inputClass} />
            {KNOWN_SETTINGS[newKey] && <p className="text-xs text-[var(--muted-foreground)] mt-1"><Info className="w-3 h-3 inline mr-1" />{KNOWN_SETTINGS[newKey].description}</p>}
          </div>
          {KNOWN_SETTINGS[newKey]?.type !== "boolean" && (
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input value={newValue} onChange={(e) => setNewValue(e.target.value)} className={inputClass} placeholder={KNOWN_SETTINGS[newKey]?.type === "text" ? "Your value here" : '{ "key": "value" }'} />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm">Create</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-[var(--muted)] rounded-lg animate-pulse" />)}</div>
      ) : data?.data?.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--muted-foreground)]">No settings configured yet.</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Click &quot;Add Setting&quot; or run the seed SQL to populate defaults.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.data?.map((setting) => {
            const meta = KNOWN_SETTINGS[setting.key];
            const isEditing = editingKey === setting.key;
            const displayVal = meta?.type === "json" && meta.fields
              ? meta.fields.map(f => `${f}: ${(setting.value as AnyVal)?.[f] || "—"}`).join(" | ")
              : meta?.type === "boolean"
                ? (setting.value as AnyVal)?.enabled ? "Enabled" : "Disabled"
                : getDisplayValue(setting.value);

            return (
              <div key={setting.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--muted)]">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{setting.key}</span>
                      {!isEditing && <span className="text-xs text-[var(--muted-foreground)] truncate max-w-md">{displayVal}</span>}
                    </div>
                    {meta && <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1"><Info className="w-3 h-3 shrink-0" />{meta.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button onClick={() => isEditing ? setEditingKey(null) : startEdit(setting)} className="text-sm px-3 py-1 rounded border border-[var(--border)] hover:bg-[var(--background)]">
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                    <button onClick={() => { if (confirm("Delete this setting?")) deleteMutation.mutate(setting.key); }} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="p-4 space-y-3">
                    {meta?.type === "image" ? (
                      <MediaPicker
                        label={meta.description}
                        value={editValue}
                        onChange={(v) => setEditValue(v)}
                        placeholder="Select or upload image"
                      />
                    ) : meta?.type === "json" && meta.fields ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {meta.fields.map(f => (
                          <div key={f}>
                            <label className="block text-xs font-medium mb-1 capitalize">{f.replace(/_/g, " ")}</label>
                            <input value={editFields[f] || ""} onChange={e => setEditFields({ ...editFields, [f]: e.target.value })} className={inputClass} placeholder={f === "email" ? "email@example.com" : f === "url" ? "https://..." : f} />
                          </div>
                        ))}
                      </div>
                    ) : meta?.type === "boolean" ? (
                      <div className="flex items-center gap-3">
                        <select value={editValue} onChange={e => setEditValue(e.target.value)} className={inputClass + " max-w-xs"}>
                          <option value="false">Disabled</option>
                          <option value="true">Enabled</option>
                        </select>
                      </div>
                    ) : meta?.type === "text" ? (
                      <input value={editValue} onChange={e => setEditValue(e.target.value)} className={inputClass} />
                    ) : (
                      <textarea value={editValue} onChange={e => setEditValue(e.target.value)} className={`${inputClass} h-48 font-mono`} spellCheck={false} />
                    )}
                    <button onClick={() => handleSave(setting)} disabled={updateMutation.isPending} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                      <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
