import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";

const app = new Hono();

// GET /api/v1/services - list active services
app.get("/", async (c) => {
  const featured = c.req.query("featured");

  let query = supabasePublic
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;
  if (error) return dbError(c, error, "Failed to load services");
  return c.json({ success: true, data: data || [] });
});

// GET /api/v1/services/:slug
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const { data, error } = await supabasePublic
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return c.json({ success: false, error: "Not found" }, 404);
  return c.json({ success: true, data });
});

export default app;
