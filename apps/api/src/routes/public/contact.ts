import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { contactMessageSchema } from "@xynhub/shared";

const app = new Hono();

// POST /api/v1/contact - submit contact form (public, no auth)
app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = contactMessageSchema.parse(body);

  const { error } = await supabasePublic
    .from("contact_messages")
    .insert(parsed);

  if (error) return c.json({ success: false, error: error.message }, 500);
  return c.json({ success: true, message: "Message sent successfully" }, 201);
});

export default app;
