import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { blogSchema } from "@xynhub/shared";

const app = new Hono();

// GET /api/v1/admin/blogs - List all (including inactive)
app.get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const perPage = parseInt(c.req.query("per_page") || "20");
  const offset = (page - 1) * perPage;

  const { data, error, count } = await supabaseAdmin
    .from("blogs")
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

// GET /api/v1/admin/blogs/:id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return c.json({ success: false, error: "Blog not found" }, 404);
  return c.json({ success: true, data });
});

// POST /api/v1/admin/blogs
app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = blogSchema.parse(body);

  const { data, error } = await supabaseAdmin
    .from("blogs")
    .insert(parsed)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data }, 201);
});

// PUT /api/v1/admin/blogs/:id
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = blogSchema.partial().parse(body);

  const { data, error } = await supabaseAdmin
    .from("blogs")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

// DELETE /api/v1/admin/blogs/:id
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin.from("blogs").delete().eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
