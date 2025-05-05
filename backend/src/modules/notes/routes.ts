import { Hono } from 'hono';
import { NotesRepository } from './repository';
import { NotesService } from './service';
import { KnowledgeArtifactsRepository } from '../knowledge-artifacts/repository';
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const notesRepo = new NotesRepository();
const knowledgeArtifactsRepo = new KnowledgeArtifactsRepository();
const notesService = new NotesService(notesRepo, knowledgeArtifactsRepo);

const notesRoute = new Hono();

notesRoute.get('/', async c => {
  const allNotes = await notesService.getAllNotes();
  return c.json(allNotes);
});

notesRoute.get('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const note = await notesService.getNoteById(id);
    return c.json(note);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('An internal server error occurred.', 500);
  }
});

notesRoute.post('/', async c => {
  const body = await c.req.json();
  if (!body.title) {
    return c.text('Missing title or content', 400);
  }

  const created = await notesService.createNote({
    title: body.title,
    content: body.content,
    userId: body.userId,
  });
  return c.json(created, 201);
});

notesRoute.put('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
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
    return c.text('An internal server error occurred.', 404);
  }
});

notesRoute.delete('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const deleted = await notesService.deleteNote(id);
    return c.json(deleted);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('Internal server error occurred.', 500);
  }
});

notesRoute.post('/:id/link', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const body = await c.req.json();
    const artifactIds = body.artifactIds;

    const linked = await notesService.linkArtifacts(id, artifactIds);

    return c.json(linked);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('Internal server error occurred.', 500);
  }
});

notesRoute.delete('/:id/link', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);

    const body = await c.req.json();
    const artifactIds = body.artifactIds;

    const unlinked = await notesService.unlinkArtifacts(id, artifactIds);

    return c.json(unlinked);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('Internal server error occurred.', 500);
  }
});

notesRoute.get('/:id/autocomplete', async c => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.text('Invalid ID', 400);

  const inputPrompt = `
You are continuing a note. Your task is to write the **next logical content chunk** based on its current state.

Use the "getRelevantContext" tool to fetch relevant chunks from related knowledge artifacts for note ${id}.

Write only the next chunk, without repeating or summarizing previous content. Keep the tone and style consistent with the original note.
`;

  const result = await generateText({
    model: openai('gpt-4'),
    tools: {
      getRelevantContext: tool({
        description: 'Retrieve relevant content chunks for a note',
        parameters: z.object({
          noteId: z.number(),
        }),
        execute: async ({ noteId }) => {
          return notesService.retrieveNoteChunks(noteId);
        },
      }),
    },
    messages: [
      {
        role: 'user',
        content: inputPrompt,
      },
    ],
  });

  return c.text(result.text);
});

export default notesRoute;
