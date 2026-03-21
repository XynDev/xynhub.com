import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabasePublic
    .from("navigation_items")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  return c.json({ success: true, data: data || [] });
});

export default app;
