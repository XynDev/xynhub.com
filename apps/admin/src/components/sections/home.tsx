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
          { key: "logo", label: "Logo (Light Mode)", type: "media" },
          { key: "logo_dark", label: "Logo (Dark Mode)", type: "media" },
        ]}
        defaultItem={{ name: "", logo: "", logo_dark: "" }}
        renderMediaPicker={(val, onChangeVal) => <MediaPicker value={val} onChange={onChangeVal} />}
      />
      <p className="text-xs text-[var(--muted-foreground)]">Upload company logos for light &amp; dark mode. They will be displayed in an infinite horizontal scroll animation on the landing page. If only one variant is uploaded, it will be used for both modes with an automatic CSS invert filter.</p>
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
  const updateBadges = (val: string) => {
    const badges = val.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({ ...data, network: { ...(data.network ?? {}), badges } });
  };
  return (
    <div className="space-y-6">
      {/* Number stats */}
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

      {/* Network Infrastructure card */}
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2 uppercase tracking-wider">Network Card (large left)</legend>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Label" value={data.network?.label ?? ""} onChange={(v) => updateStat("network", "label", v)} placeholder="Network Infrastructure" />
          <TextField label="Title" value={data.network?.title ?? ""} onChange={(v) => updateStat("network", "title", v)} placeholder="Ecosystem Topology" />
        </div>
        <TextAreaField label="Description" value={data.network?.description ?? ""} onChange={(v) => updateStat("network", "description", v)} rows={2} placeholder="Visualizing the multi-layered nodal connections..." />
        <TextField label="Badges (comma-separated)" value={(data.network?.badges ?? []).join(", ")} onChange={updateBadges} placeholder="Active Nodal Map, Latency: 0.4ms" />
      </fieldset>

      {/* System Load card */}
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2 uppercase tracking-wider">System Load Card (wide bottom)</legend>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Label" value={data.systemLoad?.label ?? ""} onChange={(v) => updateStat("systemLoad", "label", v)} placeholder="System Load" />
          <TextField label="Title" value={data.systemLoad?.title ?? ""} onChange={(v) => updateStat("systemLoad", "title", v)} placeholder="Throughput Velocity" />
        </div>
      </fieldset>
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
// HOME > TESTIMONIALS (header only — items managed in /testimonials)
// ============================================================
export function HomeTestimonials({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField label="Section Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} placeholder="What industry leaders say." />
      <TextAreaField label="Description (optional)" value={data.description ?? ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="Optional subtitle for testimonials section" />
      <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-lg">
        Testimonial items are managed separately in <a href="/testimonials" className="underline font-medium">Testimonials</a> page.
      </p>
    </div>
  );
}

// ============================================================
// HOME > FAQ (header only — items managed in /faqs)
// ============================================================
export function HomeFaq({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField label="Section Title" value={data.title ?? ""} onChange={(v) => onChange({ ...data, title: v })} placeholder="Frequently Asked Questions." />
      <TextAreaField label="Description (optional)" value={data.description ?? ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="Optional subtitle for FAQ section" />
      <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-lg">
        FAQ items are managed separately in <a href="/faqs" className="underline font-medium">FAQs</a> page.
      </p>
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
