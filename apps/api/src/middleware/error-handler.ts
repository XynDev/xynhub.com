import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export function errorHandler(err: Error, c: Context) {
  console.error(`[API Error] ${err.message}`, err.stack);

  if (err instanceof HTTPException) {
    return c.json(
      { success: false, error: err.message },
      err.status as ContentfulStatusCode
    );
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        error: "Validation error",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
      400 as ContentfulStatusCode
    );
  }

  return c.json({ success: false, error: "Internal server error" }, 500 as ContentfulStatusCode);
}
