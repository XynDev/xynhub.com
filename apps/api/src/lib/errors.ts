import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Return a standardized error response.
 * Logs the real Supabase error server-side but returns a safe generic message to the client.
 */
export function dbError(
  c: Context,
  error: { message: string },
  fallbackMessage = "An unexpected error occurred",
  status: ContentfulStatusCode = 500,
) {
  console.error(`[DB Error] ${error.message}`);
  return c.json({ success: false, error: fallbackMessage }, status);
}
