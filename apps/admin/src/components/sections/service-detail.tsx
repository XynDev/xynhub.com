"use client";

import { TextField, TextAreaField } from "@/components/ui/form-field";
import { ArrayField } from "@/components/ui/array-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
interface Props { data: D; onChange: (data: D) => void }

// ============================================================
// SERVICE-DETAIL > HERO
// ============================================================
export function ServiceDetailHero({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Engineering Ethos" />
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} placeholder="Web & App Development" />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}

// ============================================================
// SERVICE-DETAIL > SECURITY
// ============================================================
export function ServiceDetailSecurity({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Icon" value={data.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="shield_lock" />
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      </div>
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ArrayField
        label="Modules"
        items={data.modules ?? []}
        onChange={(modules) => onChange({ ...data, modules })}
        fields={[
          { key: "name", label: "Module Name", placeholder: "IDENTITY_VERIFICATION_MODULE" },
          { key: "status", label: "Status", placeholder: "active / passive" },
        ]}
        defaultItem={{ name: "", status: "active" }}
      />
    </div>
  );
}

// ============================================================
// SERVICE-DETAIL > MEMORY
// ============================================================
export function ServiceDetailMemory({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Icon" value={data.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="memory" />
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      </div>
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ArrayField
        label="Metrics"
        items={data.metrics ?? []}
        onChange={(metrics) => onChange({ ...data, metrics })}
        fields={[
          { key: "label", label: "Label", placeholder: "Leak Prevention" },
          { key: "value", label: "Value", placeholder: "100%" },
        ]}
        defaultItem={{ label: "", value: "" }}
      />
    </div>
  );
}

// ============================================================
// SERVICE-DETAIL > ROUTING
// ============================================================
export function ServiceDetailRouting({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Icon" value={data.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="alt_route" />
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      </div>
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}

// ============================================================
// SERVICE-DETAIL > STRESS
// ============================================================
export function ServiceDetailStress({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Title Prefix" value={data.titlePrefix ?? ""} onChange={(v) => set("titlePrefix", v)} placeholder="PROVEN BY" />
      <TextField label="Title Highlight" value={data.titleHighlight ?? ""} onChange={(v) => set("titleHighlight", v)} placeholder="STRESS." />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}

// ============================================================
// SERVICE-DETAIL > HABITS
// ============================================================
export function ServiceDetailHabits({ data, onChange }: Props) {
  return (
    <ArrayField
      label="Habits"
      items={data.items ?? []}
      onChange={(items) => onChange({ ...data, items })}
      fields={[
        { key: "label", label: "Label", placeholder: "Habit 01" },
        { key: "title", label: "Title", placeholder: "Immutable Infrastructure" },
        { key: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
      defaultItem={{ id: "", label: "", title: "", description: "" }}
    />
  );
}

// ============================================================
// SERVICE-DETAIL > CTA
// ============================================================
export function ServiceDetailCta({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <TextField label="Button Text" value={data.buttonText ?? ""} onChange={(v) => set("buttonText", v)} placeholder="Inquire for Engineering" />
    </div>
  );
}
