"use client";

import { TextField, TextAreaField } from "@/components/ui/form-field";
import { MediaPicker } from "@/components/ui/media-picker";
import { ArrayField } from "@/components/ui/array-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;

interface Props {
  data: D;
  onChange: (data: D) => void;
}

// ============================================================
// HOME > HERO
// ============================================================
export function HomeHero({ data, onChange }: Props) {
  const set = (key: string, val: string) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <TextField label="Version Badge" value={data.version ?? ""} onChange={(v) => set("version", v)} placeholder="v2.5 Neural Core Live" />
      <TextField label="Headline" value={data.headline ?? ""} onChange={(v) => set("headline", v)} placeholder="The Architecture of Pure Performance." />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}

// ============================================================
// HOME > TRUST
// ============================================================
export function HomeTrust({ data, onChange }: Props) {
  const logos = data.logos ?? [];
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} placeholder="Trusted by Global Innovators" />
      <ArrayField
        label="Company Logos"
        items={logos}
        onChange={(items) => onChange({ ...data, logos: items })}
        fields={[
          { key: "name", label: "Company Name", placeholder: "Acme Corp" },
          { key: "logo", label: "Logo Image", type: "media", colSpan: 2 },
        ]}
        defaultItem={{ name: "", logo: "" }}
        renderMediaPicker={(val, onChangeVal) => <MediaPicker value={val} onChange={onChangeVal} />}
      />
      <p className="text-xs text-[var(--muted-foreground)]">Upload company logos. They will be displayed in an infinite horizontal scroll animation on the landing page.</p>
    </div>
  );
}

// ============================================================
// HOME > STATS
// ============================================================
export function HomeStats({ data, onChange }: Props) {
  const updateStat = (key: string, field: string, val: string) => {
    const stat = data[key] ?? {};
    onChange({ ...data, [key]: { ...stat, [field]: val } });
  };
  return (
    <div className="space-y-6">
      {["deployments", "clients"].map((key) => (
        <fieldset key={key} className="border border-[var(--border)] rounded-lg p-4 space-y-3">
          <legend className="text-xs font-semibold px-2 uppercase tracking-wider">{key}</legend>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Value" value={data[key]?.value ?? ""} onChange={(v) => updateStat(key, "value", v)} placeholder="50+" />
            <TextField label="Label" value={data[key]?.label ?? ""} onChange={(v) => updateStat(key, "label", v)} placeholder="Global Deployments" />
          </div>
          <TextAreaField label="Description" value={data[key]?.description ?? ""} onChange={(v) => updateStat(key, "description", v)} rows={2} />
        </fieldset>
      ))}
    </div>
  );
}

// ============================================================
// HOME > SERVICES
// ============================================================
export function HomeServices({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField label="Tagline" value={data.tagline ?? ""} onChange={(v) => onChange({ ...data, tagline: v })} />
      <ArrayField
        label="Service Items"
        items={data.items ?? []}
        onChange={(items) => onChange({ ...data, items })}
        fields={[
          { key: "title", label: "Title", placeholder: "Synaptic Routing" },
          { key: "icon", label: "Material Icon", placeholder: "hub" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2, placeholder: "Description..." },
          { key: "image", label: "Image", type: "media", colSpan: 2 },
        ]}
        defaultItem={{ id: "", title: "", description: "", icon: "", image: "" }}
        renderMediaPicker={(val, onChangeVal) => <MediaPicker value={val} onChange={onChangeVal} />}
      />
    </div>
  );
}

// ============================================================
// HOME > WORKS
// ============================================================
export function HomeWorks({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
      <ArrayField
        label="Projects"
        items={data.projects ?? []}
        onChange={(projects) => onChange({ ...data, projects })}
        fields={[
          { key: "label", label: "Label", placeholder: "Project Alpha" },
          { key: "title", label: "Title", placeholder: "Global Quantum Grid" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
          { key: "image", label: "Image", type: "media", colSpan: 2 },
        ]}
        defaultItem={{ id: "", label: "", title: "", description: "", image: "" }}
        renderMediaPicker={(val, onChangeVal) => <MediaPicker value={val} onChange={onChangeVal} />}
      />
    </div>
  );
}

// ============================================================
// HOME > WHY US
// ============================================================
export function HomeWhyUs({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => onChange({ ...data, description: v })} rows={3} />
      <ArrayField
        label="Features"
        items={data.features ?? []}
        onChange={(features) => onChange({ ...data, features })}
        fields={[
          { key: "id", label: "Number", placeholder: "01" },
          { key: "title", label: "Title", placeholder: "Native Performance" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
        ]}
        defaultItem={{ id: "", title: "", description: "" }}
      />
    </div>
  );
}

// ============================================================
// HOME > CTA
// ============================================================
export function HomeCta({ data, onChange }: Props) {
  const set = (key: string, val: string) => onChange({ ...data, [key]: val });
  const buttons = data.buttons ?? [];
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Project Integration Phase" />
      <TextField label="Headline" value={data.headline ?? ""} onChange={(v) => set("headline", v)} placeholder="Ready to transcend?" />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ArrayField
        label="Buttons"
        items={buttons}
        onChange={(items) => onChange({ ...data, buttons: items })}
        fields={[
          { key: "text", label: "Button Text", placeholder: "Get Started Now" },
          { key: "url", label: "URL / Link", placeholder: "/services or https://wa.me/..." },
          { key: "variant", label: "Variant", placeholder: "primary or secondary" },
        ]}
        defaultItem={{ text: "", url: "", variant: "primary" }}
      />
    </div>
  );
}

// ============================================================
// HOME > CONTACT INFO
// ============================================================
export function HomeContactInfo({ data, onChange }: Props) {
  const set = (key: string, val: string) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <TextField label="Phone Title" value={data.phone_title ?? ""} onChange={(v) => set("phone_title", v)} placeholder="Direct Terminal" />
      <TextField label="Phone Number" value={data.phone ?? ""} onChange={(v) => set("phone", v)} placeholder="+1 (888) XYN-NODE" />
      <TextField label="Availability" value={data.availability ?? ""} onChange={(v) => set("availability", v)} placeholder="Active 24/7/365" />
      <TextField label="Address Title" value={data.address_title ?? ""} onChange={(v) => set("address_title", v)} placeholder="Nexus Core HQ" />
      <TextAreaField label="Address" value={data.address ?? ""} onChange={(v) => set("address", v)} rows={3} placeholder="One Infinite Way,\nSilicon Heights, CA 94025" />
      <TextField label="Maps Link" value={data.maps_link ?? ""} onChange={(v) => set("maps_link", v)} placeholder="https://maps.google.com/..." />
      <TextField label="Maps Link Text" value={data.maps_text ?? ""} onChange={(v) => set("maps_text", v)} placeholder="View Maps" />
    </div>
  );
}
