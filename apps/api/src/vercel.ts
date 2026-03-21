import { handle } from "hono/vercel";
import app from "./app.js";

export const config = {
  runtime: "edge",
};

export default handle(app);
