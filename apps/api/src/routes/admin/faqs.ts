import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { faqSchema } from "@xynhub/shared";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("faqs")
    .select("*")
    .order("page_slug")
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = faqSchema.parse(body);

  const { data, error } = await supabaseAdmin
    .from("faqs")
    .insert(parsed)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data }, 201);
});

app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = faqSchema.partial().parse(body);

  const { data, error } = await supabaseAdmin
    .from("faqs")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin.from("faqs").delete().eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
