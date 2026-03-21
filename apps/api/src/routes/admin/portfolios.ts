import { Hono } from "hono";
import { supabaseAdmin } from "../../lib/supabase.js";
import { portfolioSchema, portfolioDetailSchema } from "@xynhub/shared";

const app = new Hono();

// GET /api/v1/admin/portfolios
app.get("/", async (c) => {
  const { data, error } = await supabaseAdmin
    .from("portfolios")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, data: data || [] });
});

// GET /api/v1/admin/portfolios/:id
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const { data: portfolio, error } = await supabaseAdmin
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return c.json({ success: false, error: "Not found" }, 404);

  const { data: detail } = await supabaseAdmin
    .from("portfolio_details")
    .select("*")
    .eq("portfolio_id", id)
    .single();

  return c.json({ success: true, data: { ...portfolio, detail } });
});

// POST /api/v1/admin/portfolios
app.post("/", async (c) => {
  const body = await c.req.json();
  const { detail: detailBody, ...portfolioBody } = body;
  const parsed = portfolioSchema.parse(portfolioBody);

  const { data: portfolio, error } = await supabaseAdmin
    .from("portfolios")
    .insert(parsed)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);

  // Create detail if provided
  if (detailBody) {
    const detailParsed = portfolioDetailSchema.parse({
      ...detailBody,
      portfolio_id: portfolio.id,
    });
    await supabaseAdmin.from("portfolio_details").insert(detailParsed);
  }

  return c.json({ success: true, data: portfolio }, 201);
});

// PUT /api/v1/admin/portfolios/:id
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { detail: detailBody, ...portfolioBody } = body;
  const parsed = portfolioSchema.partial().parse(portfolioBody);

  const { data, error } = await supabaseAdmin
    .from("portfolios")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ success: false, error: error.message }, 500);

  if (detailBody) {
    const detailParsed = portfolioDetailSchema
      .partial()
      .parse({ ...detailBody, portfolio_id: id });

    await supabaseAdmin
      .from("portfolio_details")
      .upsert(detailParsed, { onConflict: "portfolio_id" });
  }

  return c.json({ success: true, data });
});

// DELETE /api/v1/admin/portfolios/:id
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabaseAdmin
    .from("portfolios")
    .delete()
    .eq("id", id);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Deleted" });
});

export default app;
