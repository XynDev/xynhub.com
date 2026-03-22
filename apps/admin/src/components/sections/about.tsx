"use client";

import { TextField, TextAreaField } from "@/components/ui/form-field";
import { ArrayField } from "@/components/ui/array-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
interface Props { data: D; onChange: (data: D) => void }

// ============================================================
// ABOUT > HERO
// ============================================================
export function AboutHero({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Our Origin Story" />
      <TextField label="Headline" value={data.headline ?? ""} onChange={(v) => set("headline", v)} placeholder="The Genesis of Synaptic" />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}

// ============================================================
// ABOUT > TIMELINE
// ============================================================
export function AboutTimeline({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <ArrayField
        label="Milestones"
        items={data.milestones ?? []}
        onChange={(milestones) => onChange({ ...data, milestones })}
        fields={[
          { key: "id", label: "Number", placeholder: "01" },
          { key: "title", label: "Title", placeholder: "Initial Convergence" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
        ]}
        defaultItem={{ id: "", title: "", description: "" }}
      />
    </div>
  );
}

// ============================================================
// ABOUT > TENETS
// ============================================================
export function AboutTenets({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
        <TextField label="Label" value={data.label ?? ""} onChange={(v) => onChange({ ...data, label: v })} placeholder="XYN / PRINCIPLES" />
      </div>
      <ArrayField
        label="Tenet Items"
        items={data.items ?? []}
        onChange={(items) => onChange({ ...data, items })}
        fields={[
          { key: "icon", label: "Material Icon", placeholder: "target" },
          { key: "title", label: "Title", placeholder: "Precision" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
        ]}
        defaultItem={{ id: "", icon: "", title: "", description: "" }}
      />
    </div>
  );
}

// ============================================================
// ABOUT > CULTURE
// ============================================================
export function AboutCulture({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
        <TextField label="Label" value={data.label ?? ""} onChange={(v) => onChange({ ...data, label: v })} placeholder="XYN / CULTURE" />
      </div>
      <ArrayField
        label="Culture Items"
        items={data.items ?? []}
        onChange={(items) => onChange({ ...data, items })}
        fields={[
          { key: "title", label: "Title", placeholder: "Deep Focus Intervals" },
          { key: "span", label: "Grid Span (CSS)", placeholder: "md:col-span-4" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
          { key: "bg", label: "BG Class (optional)", placeholder: "bg-surface-container-low" },
          { key: "iconbg", label: "Icon Code (optional)", placeholder: "code" },
        ]}
        defaultItem={{ id: "", title: "", description: "", span: "md:col-span-4", bg: "", iconbg: "" }}
      />
    </div>
  );
}

// ============================================================
// ABOUT > LEADERSHIP
// ============================================================
export function AboutLeadership({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} placeholder="Core Leadership" />
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="XYN / NODES" />
      <p className="text-xs text-[var(--muted-foreground)]">
        Team members are managed in the Team Members section. This only controls the section header.
      </p>
    </div>
  );
}

// ============================================================
// ABOUT > CTA
// ============================================================
export function AboutCta({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Headline" value={data.headline ?? ""} onChange={(v) => set("headline", v)} placeholder="Join the Synaptic Revolution." />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <TextField label="Button Text" value={data.buttonText ?? ""} onChange={(v) => set("buttonText", v)} placeholder="View Positions" />
    </div>
  );
}

// ============================================================
// ABOUT > CONTACT
// ============================================================
export function AboutContact({ data, onChange }: Props) {
  const setNested = (parent: string, key: string, val: string) => {
    const obj = data[parent] ?? {};
    onChange({ ...data, [parent]: { ...obj, [key]: val } });
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
        <TextField label="Label" value={data.label ?? ""} onChange={(v) => onChange({ ...data, label: v })} />
      </div>

      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2">HQ</legend>
        <TextField label="City" value={data.hq?.city ?? ""} onChange={(v) => setNested("hq", "city", v)} placeholder="Zurich, CH" />
        <TextAreaField label="Address" value={data.hq?.address ?? ""} onChange={(v) => setNested("hq", "address", v)} rows={2} />
      </fieldset>

      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2">Map Info</legend>
        <TextField label="Label" value={data.map?.label ?? ""} onChange={(v) => setNested("map", "label", v)} />
        <TextField label="Text" value={data.map?.text ?? ""} onChange={(v) => setNested("map", "text", v)} />
      </fieldset>

      <ArrayField
        label="Contact Channels"
        items={data.channels ?? []}
        onChange={(channels) => onChange({ ...data, channels })}
        fields={[
          { key: "icon", label: "Material Icon", placeholder: "alternate_email" },
          { key: "text", label: "Text / Value", placeholder: "protocols@xyn.eth" },
        ]}
        defaultItem={{ id: "", icon: "", text: "" }}
      />
    </div>
  );
}
