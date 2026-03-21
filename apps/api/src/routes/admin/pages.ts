import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { pageContentSchema } from "@xynhub/shared";
import type { AppEnv } from "../../types.js";

const app = new Hono<AppEnv>();

// GET /api/v1/admin/pages - List all page contents
app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("page_contents")
    .select("*")
    .order("page_slug")
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

// GET /api/v1/admin/pages/:slug - Get all sections for a page
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const { data, error } = await supabaseAdmin
    .from("page_contents")
    .select("*")
    .eq("page_slug", slug)
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

// PUT /api/v1/admin/pages/:slug/:section - Upsert a section
app.put("/:slug/:section", async (c) => {
  const slug = c.req.param("slug");
  const section = c.req.param("section");
  const body = await c.req.json();
  const user = c.get("user");

  const parsed = pageContentSchema.parse({
    page_slug: slug,
    section_key: section,
    content: body.content,
    sort_order: body.sort_order ?? 0,
  });

  const { data, error } = await supabaseAdmin
    .from("page_contents")
    .upsert(
      { ...parsed, updated_by: user.id },
      { onConflict: "page_slug,section_key" }
    )
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

// DELETE /api/v1/admin/pages/:slug/:section
app.delete("/:slug/:section", async (c) => {
  const slug = c.req.param("slug");
  const section = c.req.param("section");

  const { error } = await supabaseAdmin
    .from("page_contents")
    .delete()
    .eq("page_slug", slug)
    .eq("section_key", section);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
