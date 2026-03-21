"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, Info } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
}

// Describe what each setting is used for
const SETTING_DESCRIPTIONS: Record<string, string> = {
  site_name: "The name of the website, used in SEO and metadata",
  site_description: "Default meta description for the website",
  contact_email: "Contact email displayed on the website",
  social_links: "Social media links — { twitter: url, github: url, linkedin: url }",
  analytics_id: "Google Analytics or tracking ID",
  maintenance_mode: "Set { enabled: true } to show maintenance page",
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("{}");
  const [showNew, setShowNew] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => apiFetch<{ data: Setting[] }>("/api/v1/admin/settings"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: Record<string, unknown> }) =>
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

  const handleSave = (key: string) => {
    try {
      const parsed = JSON.parse(editValue);
      updateMutation.mutate({ key, value: parsed });
    } catch {
      toast.error("Invalid JSON");
    }
  };

  const handleCreate = () => {
    if (!newKey.trim()) return toast.error("Key is required");
    try {
      const parsed = JSON.parse(newValue);
      updateMutation.mutate({ key: newKey, value: parsed });
      setNewKey("");
      setNewValue("{}");
      setShowNew(false);
    } catch {
      toast.error("Invalid JSON");
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Global configuration values used across the website. These are optional — the site works with default values.
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Setting
        </button>
      </div>

      {showNew && (
        <div className="p-4 border border-[var(--border)] rounded-lg space-y-3">
          <h3 className="text-sm font-medium">New Setting</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Key</label>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. site_name, contact_email"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value (JSON)</label>
            <textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className={`${inputClass} h-24 font-mono`}
              placeholder='e.g. "XYN Hub" or { "key": "value" }'
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Simple values: use quotes like {'"My Value"'}. Objects: use JSON like {'{ "key": "value" }'}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm">
              Create
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[var(--muted)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--muted-foreground)]">No settings configured yet.</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Settings are optional — click &quot;Add Setting&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.data?.map((setting) => (
            <div key={setting.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--muted)]">
                <div>
                  <span className="font-mono text-sm font-medium">{setting.key}</span>
                  {SETTING_DESCRIPTIONS[setting.key] && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {SETTING_DESCRIPTIONS[setting.key]}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      if (editingKey === setting.key) {
                        setEditingKey(null);
                      } else {
                        setEditingKey(setting.key);
                        setEditValue(JSON.stringify(setting.value, null, 2));
                      }
                    }}
                    className="text-sm px-3 py-1 rounded border border-[var(--border)] hover:bg-[var(--background)]"
                  >
                    {editingKey === setting.key ? "Cancel" : "Edit"}
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this setting?")) deleteMutation.mutate(setting.key); }}
                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {editingKey === setting.key ? (
                <div className="p-4 space-y-3">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className={`${inputClass} h-48 font-mono`}
                    spellCheck={false}
                  />
                  <button
                    onClick={() => handleSave(setting.key)}
                    disabled={updateMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <pre className="p-4 text-xs font-mono overflow-auto max-h-32 text-[var(--muted-foreground)]">
                  {JSON.stringify(setting.value, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
