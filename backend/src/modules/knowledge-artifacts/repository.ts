import { db } from '@/db';
import {
  knowledgeArtifacts,
  knowledgeArtifactChunks,
  notesToKnowledgeArtifacts,
} from '@/db/schema';
import {
  NewKnowledgeArtifact,
  UpdateKnowledgeArtifact,
  KnowledgeArtifactChunk,
  NewKnowledgeArtifactChunk,
} from '@/types/knowledge-artifacts';
import { eq, inArray } from 'drizzle-orm';

export class KnowledgeArtifactsRepository {
  /** Get all knowledge artifacts */
  async findAll() {
    return db.select().from(knowledgeArtifacts);
  }

  /** Get a single artifact by ID */
  async findById(id: number) {
    return db.select().from(knowledgeArtifacts).where(eq(knowledgeArtifacts.id, id));
  }

  /** Create a new artifact */
  async create(data: NewKnowledgeArtifact) {
    return db.insert(knowledgeArtifacts).values(data).returning();
  }

  /** Update an existing artifact */
  async update(id: number, data: UpdateKnowledgeArtifact) {
    return db.update(knowledgeArtifacts).set(data).where(eq(knowledgeArtifacts.id, id)).returning();
  }

  /** Delete an artifact */
  async delete(id: number) {
    return db.delete(knowledgeArtifacts).where(eq(knowledgeArtifacts.id, id)).returning();
  }

  /** Find all knowledge artifacts associated with a given note ID */
  async findAllByNoteId(noteId: number) {
    const artifactLinks = await db
      .select({ artifactId: notesToKnowledgeArtifacts.artifactId })
      .from(notesToKnowledgeArtifacts)
      .where(eq(notesToKnowledgeArtifacts.noteId, noteId));

    const artifactIds = artifactLinks.map(link => link.artifactId);
    if (artifactIds.length === 0) return [];

    return db.select().from(knowledgeArtifacts).where(inArray(knowledgeArtifacts.id, artifactIds));
  }

  /** Create multiple chunks for a knowledge artifact */
  async createChunks(chunks: NewKnowledgeArtifactChunk[]) {
    return db.insert(knowledgeArtifactChunks).values(chunks).returning();
  }

  /** Get all chunks for a given artifact, ordered by index */
  async findChunksByArtifactId(artifactId: number): Promise<KnowledgeArtifactChunk[]> {
    return db
      .select()
      .from(knowledgeArtifactChunks)
      .where(eq(knowledgeArtifactChunks.artifactId, artifactId))
      .orderBy(knowledgeArtifactChunks.index);
  }

  /** Delete all chunks for a given artifact */
  async deleteChunksByArtifactId(artifactId: number) {
    return db
      .delete(knowledgeArtifactChunks)
      .where(eq(knowledgeArtifactChunks.artifactId, artifactId))
      .returning();
  }
}
