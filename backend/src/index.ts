import { Hono } from "hono";
import notesRoute from "./modules/notes/routes";

const app = new Hono();

app.route("/notes", notesRoute);

export default app;
