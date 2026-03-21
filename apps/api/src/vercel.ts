import { handle } from "@hono/node-server/vercel";
import app from "./app.js";

export default handle(app);
