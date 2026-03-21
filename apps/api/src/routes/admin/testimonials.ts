import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { testimonialSchema } from "@xynhub/shared";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = testimonialSchema.parse(body);

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .insert(parsed)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data }, 201);
});

app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = testimonialSchema.partial().parse(body);

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
