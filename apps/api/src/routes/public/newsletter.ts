import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";
import { newsletterSubscribeSchema } from "@xynhub/shared";

const app = new Hono();

// POST /api/v1/newsletter/subscribe - subscribe to newsletter (public)
app.post("/subscribe", async (c) => {
  const body = await c.req.json();
  const parsed = newsletterSubscribeSchema.parse(body);

  const { error } = await supabasePublic
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.email, is_active: true },
      { onConflict: "email" }
    );

  if (error) return dbError(c, error, "Failed to subscribe");
  return c.json({ success: true, message: "Subscribed successfully" }, 201);
});

export default app;
