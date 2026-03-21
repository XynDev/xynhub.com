import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabasePublic
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  // Group by group_name
  const grouped: Record<string, typeof data> = {};
  for (const member of data || []) {
    if (!grouped[member.group_name]) {
      grouped[member.group_name] = [];
    }
    grouped[member.group_name].push(member);
  }

  return c.json({ success: true, data: grouped });
});

export default app;
