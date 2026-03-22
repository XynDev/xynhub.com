import { handle } from "@hono/node-server/vercel";
import app from "./app.js";

// Increase Vercel function timeout (default is 10s which causes 504 on cold starts)
export const config = {
  maxDuration: 30,
};

export default handle(app);
