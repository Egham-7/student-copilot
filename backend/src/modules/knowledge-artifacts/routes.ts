import { Hono } from 'hono';
import { KnowledgeArtifactsRepository } from './repository';
import { KnowledgeArtifactsService } from './service';

const repo = new KnowledgeArtifactsRepository();
const service = new KnowledgeArtifactsService(repo);

const artifactsRoute = new Hono();

artifactsRoute.get('/', async c => {
  const all = await service.getAll();
  return c.json(all);
});

artifactsRoute.get('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const artifact = await service.getById(id);
    return c.json(artifact);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('An internal server error occurred.', 500);
  }
});

artifactsRoute.post('/', async c => {
  const body = await c.req.json();
  if (!body.title || !body.content || !body.filePath) {
    return c.text('Missing title, content, or filePath', 400);
  }
  const created = await service.create({
    title: body.title,
    content: body.content,
    filePath: body.filePath,
    embedding: body.embedding ?? null,
  });
  return c.json(created, 201);
});

artifactsRoute.put('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const body = await c.req.json();
    const updated = await service.update(id, {
      title: body.title,
      content: body.content,
      filePath: body.filePath,
      embedding: body.embedding,
      updatedAt: new Date(),
    });
    return c.json(updated);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('An internal server error occurred.', 500);
  }
});

artifactsRoute.delete('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const deleted = await service.delete(id);
    return c.json(deleted);
  } catch (e) {
    if (e instanceof Error) {
      return c.text(e.message, 404);
    }
    return c.text('An internal server error occurred.', 500);
  }
});

export default artifactsRoute;
