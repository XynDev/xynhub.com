import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { footerSectionSchema } from "@xynhub/shared";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("footer_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = footerSectionSchema.partial().parse(body);

  const { data, error } = await supabaseAdmin
    .from("footer_sections")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = footerSectionSchema.parse(body);

  const { data, error } = await supabaseAdmin
    .from("footer_sections")
    .insert(parsed)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data }, 201);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin
    .from("footer_sections")
    .delete()
    .eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
