import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";

const app = new Hono();

app.get("/", async (c) => {
  const pageSlug = c.req.query("page") || "home";

  const { data, error } = await supabasePublic
    .from("faqs")
    .select("id, question, answer, page_slug, sort_order")
    .eq("page_slug", pageSlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  return c.json({ success: true, data: data || [] });
});

export default app;
