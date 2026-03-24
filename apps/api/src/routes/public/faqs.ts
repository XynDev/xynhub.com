import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";

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
    return dbError(c, error, "Failed to load FAQs");
  }

  return c.json({ success: true, data: data || [] });
});

export default app;
