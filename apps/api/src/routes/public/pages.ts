import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";

const app = new Hono();

// GET /api/v1/pages/:slug - Get all sections for a page
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const { data, error } = await supabasePublic
    .from("page_contents")
    .select("section_key, content, sort_order")
    .eq("page_slug", slug)
    .order("sort_order", { ascending: true });

  if (error) {
    return dbError(c, error, "Failed to load page content");
  }

  // Transform to a flat object keyed by section_key
  const result: Record<string, unknown> = {};
  for (const row of data || []) {
    result[row.section_key] = row.content;
  }

  return c.json({ success: true, data: result });
});

// GET /api/v1/pages/:slug/:section - Get specific section
app.get("/:slug/:section", async (c) => {
  const slug = c.req.param("slug");
  const section = c.req.param("section");

  const { data, error } = await supabasePublic
    .from("page_contents")
    .select("content")
    .eq("page_slug", slug)
    .eq("section_key", section)
    .single();

  if (error) {
    return c.json({ success: false, error: "Section not found" }, 404);
  }

  return c.json({ success: true, data: data.content });
});

export default app;
