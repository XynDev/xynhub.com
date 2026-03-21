import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import type { AppEnv } from "../../types.js";

const app = new Hono<AppEnv>();

// GET /api/v1/admin/media - List all media
app.get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const perPage = parseInt(c.req.query("per_page") || "20");
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
