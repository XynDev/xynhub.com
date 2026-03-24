import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";

const app = new Hono();

// GET /api/v1/portfolios - List portfolios
app.get("/", async (c) => {
  const featured = c.req.query("featured");

  let query = supabasePublic
    .from("portfolios")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;

  if (error) {
    return dbError(c, error, "Failed to load portfolios");
  }

  return c.json({ success: true, data: data || [] });
});

// GET /api/v1/portfolios/:slug - Portfolio detail with extended info
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const { data: portfolio, error: pError } = await supabasePublic
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (pError || !portfolio) {
    return c.json({ success: false, error: "Portfolio not found" }, 404);
  }

  const { data: detail } = await supabasePublic
    .from("portfolio_details")
    .select("*")
    .eq("portfolio_id", portfolio.id)
    .single();

  return c.json({
    success: true,
    data: { ...portfolio, detail: detail || null },
  });
});

export default app;
