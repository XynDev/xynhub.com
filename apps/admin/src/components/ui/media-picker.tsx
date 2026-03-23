"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dbList, dbUploadMedia, dbCleanupMediaByUrl } from "@/lib/db";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media-picker"],
    queryFn: () => dbList<MediaItem>("media", { limit: 100 }),
    enabled: open,
  });

  // Cleanup old image from storage when replaced/removed
  const cleanupMutation = useMutation({
    mutationFn: (url: string) => dbCleanupMediaByUrl(url),
  });

  const handleChange = (newUrl: string) => {
    // If replacing an existing storage image, clean it up
    if (value && value !== newUrl && value.includes("/storage/")) {
      cleanupMutation.mutate(value);
    }
    onChange(newUrl);
  };

  const uploadMutation = useMutation({
    mutationFn: (file: File) => dbUploadMedia(file, altText || undefined),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-media-picker"] });
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      handleChange(res.data.file_url);
      toast.success("Uploaded & selected");
      setAltText("");
      setSelectedFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
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
            onClick={() => handleChange("")}
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
                <div className="space-y-4">
                  {/* Hidden file input */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />

                  {/* Click-to-select zone */}
                  {!selectedFile ? (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-[var(--border)] rounded-lg p-8 flex flex-col items-center gap-3 hover:border-[var(--primary)] hover:bg-[var(--muted)]/50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-[var(--muted-foreground)]" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Click to select a file</p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">JPG, PNG, WebP, SVG, GIF, or PDF</p>
                      </div>
                    </button>
                  ) : (
                    <div className="border border-[var(--border)] rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[var(--border)]" />
                        ) : (
                          <div className="w-16 h-16 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-[var(--muted-foreground)]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreview(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="p-1.5 rounded hover:bg-[var(--muted)]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Alt text (optional)"
                        className={inputClass}
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleUpload}
                          disabled={uploadMutation.isPending}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadMutation.isPending ? "Uploading..." : "Upload & Select"}
                        </button>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)]"
                        >
                          Choose Different File
                        </button>
                      </div>
                    </div>
                  )}
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
                          handleChange(item.file_url);
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
