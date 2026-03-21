import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabasePublic
    .from("footer_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  const result: Record<string, unknown> = {};
  for (const row of data || []) {
    result[row.section_key] = { title: row.title, ...row.content as Record<string, unknown> };
  }

  return c.json({ success: true, data: result });
});

export default app;
