"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dbList, dbUploadMedia, dbDeleteMedia } from "@/lib/db";
import { Upload, Trash2, Copy } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  alt_text: string | null;
  created_at: string;
}

export default function MediaPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [altText, setAltText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => dbList<MediaItem>("media", { limit: 100 }),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => dbUploadMedia(file, altText || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("File uploaded");
      setAltText("");
      if (fileRef.current) fileRef.current.value = "";
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dbDeleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("Deleted");
    },
  });

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Upload and manage media files ({data?.pagination?.total ?? 0} files)
        </p>
      </div>

      {/* Upload area */}
      <div className="p-6 border-2 border-dashed border-[var(--border)] rounded-lg space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5">File</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5">Alt Text</label>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Media grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-[var(--muted)] rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.data?.map((item) => (
            <div
              key={item.id}
              className="group relative border border-[var(--border)] rounded-lg overflow-hidden"
            >
              {item.file_type.startsWith("image/") ? (
                <img
                  src={item.file_url}
                  alt={item.alt_text || item.file_name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-[var(--muted)]">
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">
                    {item.file_type}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(item.file_url)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete?")) deleteMutation.mutate(item.id);
                  }}
                  className="p-2 rounded-full bg-red-500/60 hover:bg-red-500/80 text-white"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2">
                <p className="text-xs font-medium truncate">{item.file_name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {formatSize(item.file_size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
