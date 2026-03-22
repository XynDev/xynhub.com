import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { serviceSchema } from "@xynhub/shared";

const app = new Hono();

// GET /api/v1/admin/services
app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

// GET /api/v1/admin/services/:id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return c.json({ success: false, error: "Not found" }, 404);
  return c.json({ success: true, data });
});

// POST /api/v1/admin/services
app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = serviceSchema.parse(body);

  const { data, error } = await supabaseAdmin
    .from("services")
    .insert(parsed)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data }, 201);
});

// PUT /api/v1/admin/services/:id
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = serviceSchema.partial().parse(body);

  const { data, error } = await supabaseAdmin
    .from("services")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

// DELETE /api/v1/admin/services/:id
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin
    .from("services")
    .delete()
    .eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
