import { db } from "@/db";
import {
  knowledgeArtifacts,
  knowledgeArtifactChunks,
  notesToKnowledgeArtifacts,
} from "@/db/schema";
import {
  NewKnowledgeArtifact,
  UpdateKnowledgeArtifact,
  KnowledgeArtifactChunk,
  NewKnowledgeArtifactChunk,
} from "@/types/knowledge-artifacts";
import { cosineDistance, and, eq, gt, inArray, sql } from "drizzle-orm";

export class KnowledgeArtifactsRepository {
  /** Get all knowledge artifacts */
  async findAll() {
    return db.select().from(knowledgeArtifacts);
  }

  /** Get a single artifact by ID */
  async findById(id: number) {
    return db
      .select()
      .from(knowledgeArtifacts)
      .where(eq(knowledgeArtifacts.id, id));
  }

  /** Create a new artifact */
  async create(data: NewKnowledgeArtifact) {
    return db.insert(knowledgeArtifacts).values(data).returning();
  }

  /** Update an existing artifact */
  async update(id: number, data: UpdateKnowledgeArtifact) {
    return db
      .update(knowledgeArtifacts)
      .set(data)
      .where(eq(knowledgeArtifacts.id, id))
      .returning();
  }

  /** Delete an artifact */
  async delete(id: number) {
    return db
      .delete(knowledgeArtifacts)
      .where(eq(knowledgeArtifacts.id, id))
      .returning();
  }

  /** Find all knowledge artifacts associated with a given note ID */
  async findAllByNoteId(noteId: number) {
    const artifactLinks = await db
      .select({ artifactId: notesToKnowledgeArtifacts.artifactId })
      .from(notesToKnowledgeArtifacts)
      .where(eq(notesToKnowledgeArtifacts.noteId, noteId));

    const artifactIds = artifactLinks.map((link) => link.artifactId);
    if (artifactIds.length === 0) return [];

    return db
      .select()
      .from(knowledgeArtifacts)
      .where(inArray(knowledgeArtifacts.id, artifactIds));
  }

  /** Create multiple chunks for a knowledge artifact */
  async createChunks(chunks: NewKnowledgeArtifactChunk[]) {
    return db.insert(knowledgeArtifactChunks).values(chunks).returning();
  }

  /** Get all chunks for a given artifact, ordered by index */
  async findChunksByArtifactId(
    artifactId: number,
  ): Promise<KnowledgeArtifactChunk[]> {
    return db
      .select()
      .from(knowledgeArtifactChunks)
      .where(eq(knowledgeArtifactChunks.artifactId, artifactId))
      .orderBy(knowledgeArtifactChunks.index);
  }

  async findRelevantChunksByArtifactId(
    artifactId: number,
    embedding: number[],
    limit = 5,
  ) {
    const similarity = sql<number>`1 - (${cosineDistance(knowledgeArtifactChunks.embedding, embedding)})`;

    const chunks = await db
      .select({
        content: knowledgeArtifactChunks.content,
        similarity,
      })
      .from(knowledgeArtifactChunks)
      .where(
        and(
          eq(knowledgeArtifactChunks.artifactId, artifactId),
          gt(similarity, 0.5),
        ),
      )
      .orderBy((t) => t.similarity)
      .limit(limit);

    return chunks;
  }

  /** Delete all chunks for a given artifact */
  async deleteChunksByArtifactId(artifactId: number) {
    return db
      .delete(knowledgeArtifactChunks)
      .where(eq(knowledgeArtifactChunks.artifactId, artifactId))
      .returning();
  }
}
