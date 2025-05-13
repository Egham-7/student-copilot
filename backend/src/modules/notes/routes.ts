import { Hono } from "hono";
import { NotesRepository } from "./repository";
import { NotesService } from "./service";
import { KnowledgeArtifactsRepository } from "../knowledge-artifacts/repository";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText, tool } from "ai";
import { z } from "zod";
import { timeout } from "hono/timeout";

const notesRepo = new NotesRepository();
const knowledgeArtifactsRepo = new KnowledgeArtifactsRepository();
const notesService = new NotesService(notesRepo, knowledgeArtifactsRepo);

const notesRoute = new Hono();

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
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text("An internal server error occurred.", 500);
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
    userId: body.userId,
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
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text("An internal server error occurred.", 404);
  }
});

notesRoute.delete("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const deleted = await notesService.deleteNote(id);
    return c.json(deleted);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text("Internal server error occurred.", 500);
  }
});

notesRoute.post("/:id/link", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const body = await c.req.json();
    const artifactIds = body.artifactIds;

    const linked = await notesService.linkArtifacts(id, artifactIds);

    return c.json(linked);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text("Internal server error occurred.", 500);
  }
});

notesRoute.delete("/:id/link", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const body = await c.req.json();
    const artifactIds = body.artifactIds;

    const unlinked = await notesService.unlinkArtifacts(id, artifactIds);

    return c.json(unlinked);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text("Internal server error occurred.", 500);
  }
});

notesRoute.use("/:id/autocomplete", timeout(60000));

notesRoute.get("/:id/autocomplete", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const inputPrompt = `
You are extending a note. Your task is to generate the **next logical content chunk** in **HTML format**, based on the note's current content and relevant context.

Instructions:
1. Use the getContent tool to retrieve the full current content of note ${id}.
2. Use the getRelevantContext tool to retrieve relevant knowledge chunks for note ${id}.

Guidelines:
- Generate only the **next coherent and meaningful section** of the note.
- Output must be valid **HTML**.
- Use appropriate semantic HTML elements for structured note-taking (e.g., <h1>-<h6>, <ul>, <ol>, <strong>, <em>, <blockquote>, <code>, <section>, etc.).
- Maintain the original **tone, formatting, and writing style**.
- Do **not** repeat or paraphrase existing content.
- Do **not** include hyperlinks or metadataÔÇöonly the new content.

Return only the new content chunk as raw HTML. Do not wrap it in code fences.
`;

  const result = await generateText({
    model: openai("gpt-4.1-mini"),
    tools: {
      getRelevantContext: tool({
        description: "Retrieve relevant content chunks for a note",
        parameters: z.object({
          noteId: z.number(),
        }),
        execute: async ({ noteId }) => {
          const chunks = await notesService.retrieveNoteChunks(noteId);

          return chunks.join("\n");
        },
      }),
      getNoteContent: tool({
        description: "Retrieve the content of a note",
        parameters: z.object({
          noteId: z.number(),
        }),
        execute: async ({ noteId }) => {
          const note = await notesService.getNoteById(noteId);

          return note.content;
        },
      }),
    },
    prompt: inputPrompt,
    maxSteps: 5,
  });

  const text = result.text;

  return c.text(text);
});

notesRoute.use("/:id/chat", timeout(60000));

notesRoute.post("/:id/chat", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const { messages } = await c.req.json();

  const systemPrompt = `
    You are an AI assistant engaging in a conversation about a note's content. Your task is to help users understand, analyze, and discuss the content of the note.

    Instructions:
    1. Use the getNoteContent tool to retrieve the full current content of note ${id}.
    2. Use the getRelevantContext tool to retrieve relevant knowledge chunks for note ${id}.

    Guidelines:
    - Engage in a natural conversation about the note's content
    - Provide clear and concise responses
    - Help users understand complex concepts from the note
    - Answer questions about the content
    - Suggest connections between different parts of the note
    - Reference specific parts of the note when relevant
    - Stay focused on the note's content and directly related topics
    - Be helpful and informative while maintaining a conversational tone

    Respond naturally as a knowledgeable conversation partner who has read and understood the note thoroughly.
    `;

  const result = streamText({
    model: openai("gpt-4.1-mini"),
    tools: {
      getRelevantContext: tool({
        description: "Retrieve relevant content chunks for a note",
        parameters: z.object({
          noteId: z.number(),
        }),
        execute: async ({ noteId }) => {
          const chunks = await notesService.retrieveNoteChunks(noteId);

          return chunks.join("\n");
        },
      }),
      getNoteContent: tool({
        description: "Retrieve the content of a note",
        parameters: z.object({
          noteId: z.number(),
        }),
        execute: async ({ noteId }) => {
          const note = await notesService.getNoteById(noteId);

          return note.content;
        },
      }),
    },
    system: systemPrompt,
    maxSteps: 5,
    messages,
  });

  return result.toDataStreamResponse();
});

export default notesRoute;
