import { NotesRepository } from './repository';
import { KnowledgeArtifactsRepository } from '../knowledge-artifacts/repository';
import { NewNote, UpdateNote } from '@/types/notes';

export class NotesService {
  constructor(
    private repo: NotesRepository,
    private knowledge_artifacts_repo: KnowledgeArtifactsRepository,
  ) {}

  async getAllNotes() {
    return this.repo.findAll();
  }

  async getNoteById(id: number) {
    const noteResult = await this.repo.findById(id);
    if (!noteResult.length) throw new Error('Note not found');
    const note = noteResult[0];

    const artifacts = await this.knowledge_artifacts_repo.findAllByNoteId(id);

    return {
      ...note,
      artifacts,
    };
  }

  async createNote(data: NewNote) {
    const [created] = await this.repo.create(data);
    return created;
  }

  async updateNote(id: number, data: UpdateNote) {
    const [updated] = await this.repo.update(id, data);
    if (!updated) throw new Error('Note not found');
    return updated;
  }

  async deleteNote(id: number) {
    const [deleted] = await this.repo.delete(id);
    if (!deleted) throw new Error('Note not found');
    return deleted;
  }

  async linkToArtifacts(noteId: number, artifactIds: number[]) {
    const [linked] = await this.repo.linkToArtifacts(noteId, artifactIds);
    if (!linked) throw new Error('Linking failed');

    return linked;
  }
}
