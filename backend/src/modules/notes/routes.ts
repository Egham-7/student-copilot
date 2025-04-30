// src/modules/notes/routes.ts
import { Hono } from "hono";
import { NotesRepository } from "./repository";
import { NotesService } from "./service";
import { KnowledgeArtifactsRepository } from "../knowledge-artifacts/repository";

const notesRepo = new NotesRepository();
const knowledgeArtifactsRepo = new KnowledgeArtifactsRepository();
const notesService = new NotesService(notesRepo, knowledgeArtifactsRepo);

const notesRoute = new Hono();

// --- Notes CRUD ---

notesRoute.get("/", async (c) => {
  const allNotes = await notesService.getAllNotes();
  return c.json(allNotes);
});

notesRoute.get("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const note = await notesService.getNoteById(id);
    return c.json(note);
  } catch (e: any) {
    return c.text(e.message, 404);
  }
});

notesRoute.post("/", async (c) => {
  const body = await c.req.json();
  if (!body.title) {
    return c.text("Missing title or content", 400);
  }
  const created = await notesService.createNote({
    title: body.title,
    content: body.content,
    embedding: body.embedding ?? null,
  });
  return c.json(created, 201);
});

notesRoute.put("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const body = await c.req.json();
    const updated = await notesService.updateNote(id, {
      title: body.title,
      content: body.content,
      embedding: body.embedding,
      updatedAt: new Date(),
    });
    return c.json(updated);
  } catch (e: any) {
    return c.text(e.message, 404);
  }
});

notesRoute.delete("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const deleted = await notesService.deleteNote(id);
    return c.json(deleted);
  } catch (e: any) {
    return c.text(e.message, 404);
  }
});

notesRoute.post("/:id/link", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const body = await c.req.json();
    const artifactIds = body.artifactIds;

    const linked = await notesService.linkToArtifacts(id, artifactIds);

    return c.json(linked);
  } catch (e: any) {
    return c.text(e.message, 404);
  }
});

export default notesRoute;
