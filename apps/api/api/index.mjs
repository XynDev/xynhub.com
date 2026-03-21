import { handle } from "hono/vercel";
import app from "../dist/bundle/app.mjs";

export default handle(app);
