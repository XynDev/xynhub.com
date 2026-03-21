import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { siteSettingSchema } from "@xynhub/shared";
import type { AppEnv } from "../../types.js";

const app = new Hono<AppEnv>();

app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .order("key");

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

app.put("/:key", async (c) => {
  const key = c.req.param("key");
  const body = await c.req.json();
  const user = c.get("user");

  const parsed = siteSettingSchema.parse({ key, value: body.value });

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ ...parsed, updated_by: user.id }, { onConflict: "key" })
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data });
});

app.delete("/:key", async (c) => {
  const key = c.req.param("key");
  const { error } = await supabaseAdmin
    .from("site_settings")
    .delete()
    .eq("key", key);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
