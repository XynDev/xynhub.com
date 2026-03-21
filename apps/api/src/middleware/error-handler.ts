import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export function errorHandler(err: Error, c: Context) {
  console.error(`[API Error] ${err.message}`, err.stack);

  if (err instanceof HTTPException) {
    return c.json(
      { success: false, error: err.message },
      err.status as 400 | 401 | 403 | 404 | 500
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
      400
    );
  }

  return c.json({ success: false, error: "Internal server error" }, 500);
}
