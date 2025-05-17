import { Hono } from "hono";

import notesRoute from "./modules/notes/routes";

import { cors } from "hono/cors";
import artifactsRoute from "./modules/knowledge-artifacts/routes";
import { supabaseAuth } from "./middleware/auth";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
  supabaseAuth,
);

app.route("/notes", notesRoute);
app.route("/knowledge-artifacts", artifactsRoute);

export default {
  port: 8080,
  fetch: app.fetch,
};
