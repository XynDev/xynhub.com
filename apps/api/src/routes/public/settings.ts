import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabasePublic
    .from("site_settings")
    .select("key, value");

  if (error) {
    return dbError(c, error, "Failed to load settings");
  }

  const result: Record<string, unknown> = {};
  for (const row of data || []) {
    result[row.key] = row.value;
  }

  return c.json({ success: true, data: result });
});

export default app;
