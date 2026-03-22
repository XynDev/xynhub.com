"use client";

import { TextField, TextAreaField } from "@/components/ui/form-field";
import { ArrayField } from "@/components/ui/array-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
interface Props { data: D; onChange: (data: D) => void }

// ============================================================
// SERVICES > HERO
// ============================================================
export function ServicesHero({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  const setStatus = (v: string) => onChange({ ...data, status: { ...data.status, text: v } });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Core Proficiencies" />
      <TextAreaField label="Headline" value={data.headline ?? ""} onChange={(v) => set("headline", v)} rows={2} placeholder="Functional\nStack." />
      <TextField label="Status Text" value={data.status?.text ?? ""} onChange={setStatus} placeholder="System Status: Optimal" />
    </div>
  );
}

// ============================================================
// SERVICES > WEB
// ============================================================
export function ServicesWeb({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Icon" value={data.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="terminal" />
        <TextField label="Number" value={data.number ?? ""} onChange={(v) => set("number", v)} placeholder="01" />
      </div>
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ArrayField
        label="Metrics"
        items={data.metrics ?? []}
        onChange={(metrics) => onChange({ ...data, metrics })}
        fields={[
          { key: "label", label: "Label", placeholder: "Latency" },
          { key: "value", label: "Value", placeholder: "<150ms" },
        ]}
        defaultItem={{ label: "", value: "" }}
      />
    </div>
  );
}

// ============================================================
// SERVICES > TOOLING
// ============================================================
export function ServicesTooling({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
      <ArrayField
        label="Stack Items"
        items={data.stack ?? []}
        onChange={(stack) => onChange({ ...data, stack })}
        fields={[{ key: "name", label: "Technology Name", placeholder: "TypeScript" }]}
        defaultItem={{ name: "" }}
      />
    </div>
  );
}

// ============================================================
// SERVICES > APP
// ============================================================
export function ServicesApp({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Icon" value={data.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="install_mobile" />
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      </div>
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <div>
        <label className="block text-sm font-medium mb-1">Platforms</label>
        <input
          value={(data.platforms ?? []).join(", ")}
          onChange={(e) => onChange({ ...data, platforms: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          placeholder="iOS Swift Native, Android Kotlin, React Native Hybrid"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">Comma-separated</p>
      </div>
    </div>
  );
}

// ============================================================
// SERVICES > CLOUD
// ============================================================
export function ServicesCloud({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Icon" value={data.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="cloud_done" />
        <TextField label="Number" value={data.number ?? ""} onChange={(v) => set("number", v)} placeholder="02" />
      </div>
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      <ArrayField
        label="Features"
        items={data.features ?? []}
        onChange={(features) => onChange({ ...data, features })}
        fields={[
          { key: "title", label: "Title", placeholder: "Provisioning" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
        ]}
        defaultItem={{ title: "", description: "" }}
      />
      <div>
        <label className="block text-sm font-medium mb-1">Technologies</label>
        <input
          value={(data.technologies ?? []).join(", ")}
          onChange={(e) => onChange({ ...data, technologies: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          placeholder="AWS, Google Cloud, Docker"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">Comma-separated</p>
      </div>
    </div>
  );
}

// ============================================================
// SERVICES > CTA
// ============================================================
export function ServicesCta({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ArrayField
        label="Buttons"
        items={data.buttons ?? []}
        onChange={(buttons) => onChange({ ...data, buttons })}
        fields={[
          { key: "text", label: "Button Text", placeholder: "Start Build" },
          { key: "variant", label: "Variant", placeholder: "primary / secondary" },
        ]}
        defaultItem={{ text: "", variant: "primary" }}
        maxItems={3}
      />
    </div>
  );
}
