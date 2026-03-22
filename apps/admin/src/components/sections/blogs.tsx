"use client";

import { TextField, TextAreaField } from "@/components/ui/form-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
interface Props { data: D; onChange: (data: D) => void }

// ============================================================
// BLOGS > HERO
// ============================================================
export function BlogsHero({ data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <TextField label="Label" value={data.label ?? ""} onChange={(v) => set("label", v)} placeholder="Archive // 2024" />
      <TextField label="Title" value={data.title ?? ""} onChange={(v) => set("title", v)} placeholder="XYN INTEL." />
      <TextAreaField label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
    </div>
  );
}
