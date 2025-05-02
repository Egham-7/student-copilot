import { NewKnowledgeArtifact, UpdateKnowledgeArtifact } from '@/types/knowledge-artifacts';
import { KnowledgeArtifactsRepository } from './repository';

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
    return created;
  }
  async update(id: number, data: UpdateKnowledgeArtifact) {
    const [updated] = await this.repo.update(id, data);
    if (!updated) throw new Error('Knowledge Artifact not found');
    return updated;
  }
  async delete(id: number) {
    const [deleted] = await this.repo.delete(id);
    if (!deleted) throw new Error('Knowledge Artifact not found');
    return deleted;
  }

  async findAllByNoteId(noteId: number) {
    return this.repo.findAllByNoteId(noteId);
  }
}
