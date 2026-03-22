"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder,
  minHeight = "200px",
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--muted)]"
        >
          {preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div
          className="prose prose-sm dark:prose-invert max-w-none p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          style={{ minHeight }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "*No content yet...*"}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} font-mono resize-y`}
          style={{ minHeight }}
          spellCheck={false}
          placeholder={placeholder || "Write markdown content..."}
        />
      )}
    </div>
  );
}
