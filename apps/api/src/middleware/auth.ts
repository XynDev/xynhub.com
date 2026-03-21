import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { supabaseAdmin } from "../lib/supabase.js";
import type { AppEnv } from "../types.js";

const getAllowedEmails = (): string[] => {
  const emails = process.env.ALLOWED_ADMIN_EMAILS || "";
  return emails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new HTTPException(401, { message: "Missing authorization token" });
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }

  // Check email whitelist
  const allowedEmails = getAllowedEmails();
  const userEmail = user.email?.toLowerCase();

  if (!userEmail || !allowedEmails.includes(userEmail)) {
    throw new HTTPException(403, {
      message: "Access denied. Your email is not authorized for admin access.",
    });
  }

  c.set("user", user);
  await next();
});
