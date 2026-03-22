"use client";

import { TextField } from "@/components/ui/form-field";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;

interface Props {
  data: D;
  onChange: (data: D) => void;
}

export function LegalContent({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField
        label="Page Title"
        value={data.title ?? ""}
        onChange={(v) => onChange({ ...data, title: v })}
        placeholder="Privacy Policy"
      />
      <MarkdownEditor
        label="Content (Markdown)"
        value={data.body ?? ""}
        onChange={(v) => onChange({ ...data, body: v })}
        minHeight="400px"
        placeholder="Write your content in Markdown..."
      />
    </div>
  );
}
