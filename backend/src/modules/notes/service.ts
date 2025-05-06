import { NotesRepository } from './repository';
import { KnowledgeArtifactsRepository } from '../knowledge-artifacts/repository';
import { NewNote, UpdateNote } from '@/types/notes';
import { embed, cosineSimilarity } from 'ai';
import { openai } from '@ai-sdk/openai';
import { autocompleteCache } from '@/utils/cache';
import { hash } from 'ohash';

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
    const embedding = data.content
      ? (
          await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: data.content,
          })
        ).embedding
      : null;

    const noteWithEmbedding: NewNote = {
      ...data,
      embedding,
    };

    const [created] = await this.repo.create(noteWithEmbedding);
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

  async linkArtifacts(noteId: number, artifactIds: number[]) {
    const [linked] = await this.repo.linkArtifacts(noteId, artifactIds);
    if (!linked) throw new Error('Linking failed');

    return linked;
  }

  async unlinkArtifacts(noteId: number, artifactIds: number[]) {
    const [unlinked] = await this.repo.unlinkArtifacts(noteId, artifactIds);

    if (!unlinked) throw new Error('Unlinking failed');

    return unlinked;
  }

  async retrieveNoteChunks(id: number): Promise<string[]> {
    const note = await this.getNoteById(id);
    const noteContent = note.content;

    const cacheKey = `autocomplete:${id}:${hash(noteContent)}`;

    const cached = autocompleteCache.get(cacheKey);
    if (cached) return cached;

    const { embedding: noteEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: noteContent,
    });

    const scoredArtifacts = note.artifacts
      .map(artifact => ({
        ...artifact,
        score: cosineSimilarity(noteEmbedding, artifact.embedding ?? []),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const artifactChunks = await Promise.all(
      scoredArtifacts.map(async artifact => {
        const chunks = await this.knowledge_artifacts_repo.findRelevantChunksByArtifactId(
          artifact.id,
          noteEmbedding,
        );
        return chunks.map(chunk => chunk.content);
      }),
    );

    console.log('Artifact chunks:', artifactChunks);

    const allChunks = artifactChunks.flat();
    console.log('All chunks:', allChunks);

    autocompleteCache.set(cacheKey, allChunks);

    return allChunks;
  }
}
