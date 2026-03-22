"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  alt_text: string | null;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function MediaPicker({ value, onChange, label, placeholder }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"browse" | "upload">("browse");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [altText, setAltText] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media-picker"],
    queryFn: () =>
      apiFetch<{ data: MediaItem[] }>("/api/v1/admin/media?per_page=100"),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      if (altText) formData.append("alt_text", altText);
      return apiFetch<{ data: MediaItem }>("/api/v1/admin/media/upload", {
        method: "POST",
        body: formData as unknown as BodyInit,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-media-picker"] });
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      onChange(res.data.file_url);
      toast.success("Uploaded & selected");
      setAltText("");
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={placeholder || "Image URL..."}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-sm inline-flex items-center gap-1.5"
          title="Browse Media"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-2 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-lg border border-[var(--border)]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-[var(--destructive)] text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold">Select Media</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--muted)] rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-3">
              <button
                type="button"
                onClick={() => setTab("browse")}
                className={`px-3 py-1.5 text-xs rounded-lg ${tab === "browse" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] hover:bg-[var(--muted)]"}`}
              >
                Browse Library
              </button>
              <button
                type="button"
                onClick={() => setTab("upload")}
                className={`px-3 py-1.5 text-xs rounded-lg ${tab === "upload" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] hover:bg-[var(--muted)]"}`}
              >
                Upload New
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === "upload" ? (
                <div className="space-y-3">
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="text-sm" />
                  <input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Alt text (optional)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadMutation.isPending ? "Uploading..." : "Upload & Select"}
                  </button>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-[var(--muted)] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {data?.data
                    ?.filter((m) => m.file_type.startsWith("image/"))
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(item.file_url);
                          setOpen(false);
                        }}
                        className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:border-[var(--primary)] ${
                          value === item.file_url ? "border-[var(--primary)] ring-2 ring-[var(--ring)]" : "border-[var(--border)]"
                        }`}
                      >
                        <img
                          src={item.file_url}
                          alt={item.alt_text || item.file_name}
                          className="w-full h-full object-cover"
                        />
                        {value === item.file_url && (
                          <div className="absolute top-1 right-1 p-0.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  {data?.data?.filter((m) => m.file_type.startsWith("image/")).length === 0 && (
                    <div className="col-span-4 text-center py-8 text-sm text-[var(--muted-foreground)]">
                      No images in library. Upload one first.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
