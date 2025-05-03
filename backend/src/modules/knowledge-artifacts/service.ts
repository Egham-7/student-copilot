import { NewKnowledgeArtifact, UpdateKnowledgeArtifact } from '@/types/knowledge-artifacts';
import { KnowledgeArtifactsRepository } from './repository';
import { PDFArtifactLoader } from '../artifact-loaders/services/pdf';
import { ArtifactLoader } from '../artifact-loaders/types';

const artifactLoaders: Record<string, ArtifactLoader> = {
  pdf: new PDFArtifactLoader(),
};

export class KnowledgeArtifactsService {
  constructor(private repo: KnowledgeArtifactsRepository) {}

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: number) {
    const result = await this.repo.findById(id);
    if (!result.length) throw new Error('Knowledge Artifact not found');
    return result[0];
  }

  async create(data: NewKnowledgeArtifact) {
    const [created] = await this.repo.create(data);

    const loader = artifactLoaders[data.fileType];
    if (!loader) throw new Error(`Unsupported file type: ${data.fileType}`);

    // Load and chunk the artifact
    const chunks = await loader.loadAndChunk(created.id, data.filePath);

    // Calculate aggregated embedding (e.g., average of chunk embeddings)
    const aggregate = chunks
      .map(chunk => chunk.embedding)
      .reduce((acc, emb) => acc.map((v, j) => v + emb[j] / chunks.length));

    // Update artifact with aggregated embedding
    await this.repo.update(created.id, { embedding: aggregate });

    // Insert chunks
    await this.repo.createChunks(chunks);

    return { ...created, embedding: aggregate };
  }

  async update(id: number, data: UpdateKnowledgeArtifact) {
    if (!data.filePath || !data.fileType) {
      throw new Error('Missing filePath or fileType');
    }

    const existing = await this.repo.findById(id);
    if (!existing.length) throw new Error('Knowledge Artifact not found');

    const loader = artifactLoaders[data.fileType];
    if (!loader) throw new Error(`Unsupported file type: ${data.fileType}`);

    // Re-load and re-chunk the updated file
    const chunks = await loader.loadAndChunk(id, data.filePath);

    // Recalculate aggregated embedding
    const aggregate = chunks
      .map(chunk => chunk.embedding)
      .reduce((acc, emb) => acc.map((v, j) => v + emb[j] / chunks.length));

    // Update artifact record with new metadata and embedding
    const [updated] = await this.repo.update(id, {
      title: data.title,
      filePath: data.filePath,
      fileType: data.fileType,
      embedding: aggregate,
    });

    // Delete old chunks and insert new ones
    await this.repo.deleteChunksByArtifactId(id);
    await this.repo.createChunks(chunks);

    return { ...updated, embedding: aggregate };
  }

  async delete(id: number) {
    const [deleted] = await this.repo.delete(id);
    if (!deleted) throw new Error('Knowledge Artifact not found');
    await this.repo.deleteChunksByArtifactId(id);
    return deleted;
  }

  async findAllByNoteId(noteId: number) {
    return this.repo.findAllByNoteId(noteId);
  }
}
