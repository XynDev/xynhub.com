import { handle } from "hono/vercel";
import app from "./app.js";

export default handle(app);
