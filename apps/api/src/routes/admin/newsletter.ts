import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";

const app = new Hono();

// GET /api/v1/admin/newsletter
app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

// DELETE /api/v1/admin/newsletter/:id
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
