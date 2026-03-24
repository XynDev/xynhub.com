import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { paginationSchema } from "@xynhub/shared";

const app = new Hono();

// GET /api/v1/blogs - List blogs with pagination & filters
app.get("/", async (c) => {
  const { page, per_page: perPage } = paginationSchema.parse({
    page: c.req.query("page"),
    per_page: c.req.query("per_page"),
  });
  const category = c.req.query("category");
  const featured = c.req.query("featured");
  const offset = (page - 1) * perPage;

  let query = supabasePublic
    .from("blogs")
    .select(
      "id, slug, title, category, tag, description, author_name, author_role, author_image, image_url, icon, is_featured, read_time, published_at",
      { count: "exact" }
    )
    .eq("is_active", true)
    .order("published_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (category) {
    query = query.eq("category", category);
  }

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

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

// GET /api/v1/blogs/:slug - Blog detail
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const { data, error } = await supabasePublic
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return c.json({ success: false, error: "Blog not found" }, 404);
  }

  return c.json({ success: true, data });
});

export default app;
