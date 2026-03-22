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

// Wrap async operation with a timeout to prevent Vercel 504s
// (504 from Vercel has no CORS headers, hiding the real error)
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new HTTPException(504, { message: `${label} timed out after ${ms}ms` })), ms)
    ),
  ]);
}

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new HTTPException(401, { message: "Missing authorization token" });
  }

  // 7s timeout — fail fast with a proper error response (with CORS headers)
  // instead of letting Vercel kill the function at 10s with a CORS-less 504
  const {
    data: { user },
    error,
  } = await withTimeout(
    supabaseAdmin.auth.getUser(token),
    7000,
    "Auth verification"
  );

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
