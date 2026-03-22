import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";

const app = new Hono();

// GET /api/v1/admin/contact-messages
app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

// PUT /api/v1/admin/contact-messages/:id (mark as read)
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .update({ is_read: body.is_read ?? true })
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

// DELETE /api/v1/admin/contact-messages/:id
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
