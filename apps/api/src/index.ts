import { serve } from "@hono/node-server";
import app from "./app.js";

const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 XYNHub API server running on http://localhost:${port}`);
console.log(`📚 Swagger UI: http://localhost:${port}/api/docs`);
console.log(`📄 OpenAPI JSON: http://localhost:${port}/api/openapi.json`);

serve({ fetch: app.fetch, port });
