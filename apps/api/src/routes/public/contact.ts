import { Hono } from "hono";
import { supabasePublic } from "../../lib/supabase.js";
import { dbError } from "../../lib/errors.js";
import { contactMessageSchema } from "@xynhub/shared";

const app = new Hono();

// POST /api/v1/contact - submit contact form (public, no auth)
app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = contactMessageSchema.parse(body);

  const { error } = await supabasePublic
    .from("contact_messages")
    .insert(parsed);

  if (error) return dbError(c, error, "Failed to submit contact message");
  return c.json({ success: true, message: "Message sent successfully" }, 201);
});

export default app;
