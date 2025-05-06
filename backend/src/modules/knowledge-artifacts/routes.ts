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
    return c.text(e instanceof Error ? e.message : 'Internal server error', 404);
  }
});

artifactsRoute.post('/', async c => {
  const body = await c.req.json();
  const { title, filePath, fileType, userId } = body;

  if (!title || !filePath || !fileType) {
    return c.text('Missing title, filePath, or fileType', 400);
  }

  try {
    const created = await service.create({
      title,
      filePath,
      fileType,
      userId,
    });
    return c.json(created, 201);
  } catch (e) {
    return c.text(e instanceof Error ? e.message : 'Failed to create artifact', 500);
  }
});

artifactsRoute.put('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const body = await c.req.json();
    const updated = await service.update(id, {
      title: body.title,
      filePath: body.filePath,
      fileType: body.fileType,
      updatedAt: new Date(),
    });
    return c.json(updated);
  } catch (e) {
    return c.text(e instanceof Error ? e.message : 'Internal server error', 500);
  }
});

artifactsRoute.delete('/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.text('Invalid ID', 400);
    const deleted = await service.delete(id);
    return c.json(deleted);
  } catch (e) {
    return c.text(e instanceof Error ? e.message : 'Internal server error', 500);
  }
});

export default artifactsRoute;
