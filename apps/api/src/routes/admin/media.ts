import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { paginationSchema } from "@xynhub/shared";
import type { AppEnv } from "../../types.js";

const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const app = new Hono<AppEnv>();

// GET /api/v1/admin/media - List all media
app.get("/", async (c) => {
  const { page, per_page: perPage } = paginationSchema.parse({
    page: c.req.query("page"),
    per_page: c.req.query("per_page"),
  });
  const offset = (page - 1) * perPage;

  const { data, error, count } = await supabaseAdmin
    .from("media")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) return c.json({ success: false, error: error.message }, 500);

  return c.json({
    success: true,
    data: data || [],
    pagination: {
      page,
      per_page: perPage,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / perPage),
    },
  });
});

// POST /api/v1/admin/media/upload - Upload file
app.post("/upload", async (c) => {
  const user = c.get("user");
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  const altText = formData.get("alt_text") as string | null;

  if (!file) {
    return c.json({ success: false, error: "No file provided" }, 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return c.json({ success: false, error: "File too large. Maximum size is 10MB." }, 400);
  }

  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    return c.json({
      success: false,
      error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_MEDIA_TYPES.join(", ")}`,
    }, 400);
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("media")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return c.json({ success: false, error: uploadError.message }, 500);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("media").getPublicUrl(filePath);

  // Save to media table
  const { data: media, error: dbError } = await supabaseAdmin
    .from("media")
    .insert({
      file_name: file.name,
      file_url: publicUrl,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      alt_text: altText,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (dbError) {
    return c.json({ success: false, error: dbError.message }, 500);
  }

  return c.json({ success: true, data: media }, 201);
});

// POST /api/v1/admin/media/cleanup - Delete file from storage by URL
// Used when CMS image fields are replaced/removed
app.post("/cleanup", async (c) => {
  const { url } = await c.req.json<{ url: string }>();
  if (!url) return c.json({ success: false, error: "No URL provided" }, 400);

  // Find media record by URL
  const { data: media } = await supabaseAdmin
    .from("media")
    .select("id, file_path")
    .eq("file_url", url)
    .single();

  if (media) {
    // Remove from storage (log errors but don't fail)
    const { error: storageErr } = await supabaseAdmin.storage.from("media").remove([media.file_path]);
    if (storageErr) console.error("[Media cleanup] Storage error:", storageErr.message);

    // Remove from database
    const { error: dbErr } = await supabaseAdmin.from("media").delete().eq("id", media.id);
    if (dbErr) console.error("[Media cleanup] DB error:", dbErr.message);
  }

  return c.json({ success: true, message: "Cleaned up" });
});

// DELETE /api/v1/admin/media/:id
app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  // Get file path first
  const { data: media } = await supabaseAdmin
    .from("media")
    .select("file_path")
    .eq("id", id)
    .single();

  if (media) {
    await supabaseAdmin.storage.from("media").remove([media.file_path]);
  }

  const { error } = await supabaseAdmin.from("media").delete().eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
