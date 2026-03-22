"use client";

import { TextField, TextAreaField, TagsField } from "@/components/ui/form-field";
import { ArrayField } from "@/components/ui/array-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
interface Props { data: D; onChange: (data: D) => void }

// ============================================================
// PORTOFOLIO > HEADER
// ============================================================
export function PortofolioHeader({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Engineering Portfolio v2.04" />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Title Prefix" value={data.titlePrefix ?? ""} onChange={(v) => set("titlePrefix", v)} placeholder="XYN" />
        <TextField label="Title Suffix" value={data.titleSuffix ?? ""} onChange={(v) => set("titleSuffix", v)} placeholder="_SYSTEM" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stats Badges</label>
        <input
          value={(data.stats ?? []).join(", ")}
          onChange={(e) => onChange({ ...data, stats: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          placeholder="Latency: 14ms, Status: Active"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">Comma-separated</p>
      </div>
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={2} />
    </div>
  );
}

// ============================================================
// PORTOFOLIO > PROFICIENCY
// ============================================================
export function PortofolioProficiency({ data, onChange }: Props) {
  const setFooter = (k: string, v: string) => {
    onChange({ ...data, footer: { ...(data.footer ?? {}), [k]: v } });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Label" value={data.label ?? ""} onChange={(v) => onChange({ ...data, label: v })} placeholder="Capability Matrix" />
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
      </div>

      <ArrayField
        label="Skills"
        items={data.skills ?? []}
        onChange={(skills) => onChange({ ...data, skills })}
        fields={[
          { key: "name", label: "Skill Name", placeholder: "Concurrency" },
          { key: "percentage", label: "Percentage", placeholder: "98%" },
        ]}
        defaultItem={{ id: "", name: "", percentage: "" }}
      />

      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2">Topology</legend>
        <TextAreaField label="Description" value={data.topology?.desc ?? ""} onChange={(v) => onChange({ ...data, topology: { ...(data.topology ?? {}), desc: v } })} rows={2} />
      </fieldset>

      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2">Footer Line</legend>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Icon" value={data.footer?.icon ?? ""} onChange={(v) => setFooter("icon", v)} placeholder="bolt" />
          <TextField label="Highlight" value={data.footer?.highlight ?? ""} onChange={(v) => setFooter("highlight", v)} placeholder="3.2M req/sec" />
        </div>
        <TextField label="Text Before" value={data.footer?.text ?? ""} onChange={(v) => setFooter("text", v)} placeholder="Optimizing critical paths for " />
        <TextField label="Text After" value={data.footer?.text2 ?? ""} onChange={(v) => setFooter("text2", v)} placeholder=" across distributed clusters." />
      </fieldset>
    </div>
  );
}

// ============================================================
// PORTOFOLIO > FEATURES
// ============================================================
export function PortofolioFeatures({ data, onChange }: Props) {
  return (
    <ArrayField
      label="Feature Items"
      items={data.items ?? []}
      onChange={(items) => onChange({ ...data, items })}
      fields={[
        { key: "icon", label: "Material Icon", placeholder: "security" },
        { key: "title", label: "Title", placeholder: "Zero-Trust" },
        { key: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
      defaultItem={{ id: "", icon: "", title: "", description: "" }}
    />
  );
}

// ============================================================
// PORTOFOLIO > CONTACT
// ============================================================
export function PortofolioContact({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Infrastructure Ready" />
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <TextField label="Primary Action Text" value={data.actionPrimary ?? ""} onChange={(v) => set("actionPrimary", v)} placeholder="Initialize Project" />
      <div>
        <label className="block text-sm font-medium mb-1">Links</label>
        <input
          value={(data.links ?? []).join(", ")}
          onChange={(e) => onChange({ ...data, links: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          placeholder="GitHub, LinkedIn"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">Comma-separated</p>
      </div>
    </div>
  );
}
