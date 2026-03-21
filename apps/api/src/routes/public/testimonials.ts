import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabasePublic
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  return c.json({ success: true, data: data || [] });
});

export default app;
