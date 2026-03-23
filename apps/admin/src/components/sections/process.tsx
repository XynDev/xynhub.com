"use client";

import { TextField, TextAreaField } from "@/components/ui/form-field";
import { ArrayField } from "@/components/ui/array-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
interface Props { data: D; onChange: (data: D) => void }

// ============================================================
// PROCESS > HERO
// ============================================================
export function ProcessHero({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Operations Framework" />
      <TextAreaField label="Headline" value={data.headline ?? ""} onChange={(v) => set("headline", v)} rows={2} placeholder="The Strategic \nFlow." />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}

// ============================================================
// PROCESS > PHASES (Unified — all phases in one array)
// ============================================================
export function ProcessPhases({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <p className="text-xs text-[var(--muted-foreground)]">
          <strong>Layout:</strong> Phases auto-arrange in a bento grid cycle: Wide+Side → Equal pair → Side+Wide → Full-width, then repeat.
          Mark items with <code className="px-1 bg-[var(--muted)] rounded">isSideCard: true</code> to make them compact accent cards paired with the next main phase.
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          <strong>Supported fields:</strong> phase (label), title, icon (Material Symbols name), description, metric (label+value), tags (comma list), metrics (array), features (array with icon+title).
        </p>
      </div>
      <ArrayField
        label="Phase Items"
        items={data.items ?? []}
        onChange={(items) => onChange({ ...data, items })}
        fields={[
          { key: "phase", label: "Phase Label", placeholder: "Phase 01" },
          { key: "title", label: "Title", placeholder: "Strategic Inquiry" },
          { key: "icon", label: "Material Icon", placeholder: "search_check" },
          { key: "description", label: "Description", type: "textarea", colSpan: 2 },
        ]}
        defaultItem={{ id: "", phase: "", title: "", icon: "", description: "", isSideCard: false }}
      />
    </div>
  );
}

// ============================================================
// PROCESS > PHASE4 (Legacy support — kept for backward compat)
// ============================================================
export function ProcessPhase4({ data, onChange }: Props) {
  const setSide = (k: string, v: string) => {
    onChange({ ...data, sideCard: { ...(data.sideCard ?? {}), [k]: v } });
  };
  const setMain = (k: string, v: string) => {
    onChange({ ...data, mainCard: { ...(data.mainCard ?? {}), [k]: v } });
  };
  return (
    <div className="space-y-6">
      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
        <p className="text-xs text-[var(--muted-foreground)]">
          <strong>Legacy section.</strong> For new phases, add items to the &quot;phases&quot; section above. This section is kept for backward compatibility.
        </p>
      </div>
      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2">Side Card</legend>
        <TextField label="Icon" value={data.sideCard?.icon ?? ""} onChange={(v) => setSide("icon", v)} placeholder="rocket_launch" />
        <TextField label="Title" value={data.sideCard?.title ?? ""} onChange={(v) => setSide("title", v)} placeholder="Zero Downtime" />
        <TextAreaField label="Description" value={data.sideCard?.description ?? ""} onChange={(v) => setSide("description", v)} rows={2} />
      </fieldset>

      <fieldset className="border border-[var(--border)] rounded-lg p-4 space-y-3">
        <legend className="text-xs font-semibold px-2">Main Card</legend>
        <TextField label="Phase" value={data.mainCard?.phase ?? ""} onChange={(v) => setMain("phase", v)} placeholder="Phase 04" />
        <TextField label="Title" value={data.mainCard?.title ?? ""} onChange={(v) => setMain("title", v)} placeholder="Synaptic Deployment" />
        <ArrayField
          label="Metrics"
          items={data.mainCard?.metrics ?? []}
          onChange={(metrics) => onChange({ ...data, mainCard: { ...(data.mainCard ?? {}), metrics } })}
          fields={[
            { key: "label", label: "Label", placeholder: "Global Latency" },
            { key: "value", label: "Value", placeholder: "< 50ms" },
          ]}
          defaultItem={{ label: "", value: "" }}
        />
      </fieldset>
    </div>
  );
}

// ============================================================
// PROCESS > PHASE5 (Legacy support — kept for backward compat)
// ============================================================
export function ProcessPhase5({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
        <p className="text-xs text-[var(--muted-foreground)]">
          <strong>Legacy section.</strong> For new phases, add items to the &quot;phases&quot; section above. This section is kept for backward compatibility.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Phase" value={data.phase ?? ""} onChange={(v) => set("phase", v)} placeholder="Phase 05" />
        <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} />
      </div>
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ArrayField
        label="Features"
        items={data.features ?? []}
        onChange={(features) => onChange({ ...data, features })}
        fields={[
          { key: "icon", label: "Material Icon", placeholder: "monitoring" },
          { key: "title", label: "Title", placeholder: "Real-time Logs" },
        ]}
        defaultItem={{ icon: "", title: "" }}
      />
    </div>
  );
}
