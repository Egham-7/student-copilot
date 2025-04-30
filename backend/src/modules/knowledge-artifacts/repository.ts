import { db } from "@/db";
import { knowledgeArtifacts, notesToKnowledgeArtifacts } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export class KnowledgeArtifactsRepository {
  async findAll() {
    return db.select().from(knowledgeArtifacts);
  }

  async findById(id: number) {
    return db
      .select()
      .from(knowledgeArtifacts)
      .where(eq(knowledgeArtifacts.id, id));
  }

  async create(data: any) {
    return db.insert(knowledgeArtifacts).values(data).returning();
  }

  async update(id: number, data: any) {
    return db
      .update(knowledgeArtifacts)
      .set(data)
      .where(eq(knowledgeArtifacts.id, id))
      .returning();
  }

  async delete(id: number) {
    return db
      .delete(knowledgeArtifacts)
      .where(eq(knowledgeArtifacts.id, id))
      .returning();
  }

  /**
   * Find all knowledge artifacts associated with a given note ID.
   */
  async findAllByNoteId(noteId: number) {
    // 1. Get artifact IDs from the join table
    const artifactLinks = await db
      .select({ artifactId: notesToKnowledgeArtifacts.artifactId })
      .from(notesToKnowledgeArtifacts)
      .where(eq(notesToKnowledgeArtifacts.noteId, noteId));

    const artifactIds = artifactLinks.map((link) => link.artifactId);

    // 2. Get the artifacts
    if (artifactIds.length === 0) return [];

    return db
      .select()
      .from(knowledgeArtifacts)
      .where(inArray(knowledgeArtifacts.id, artifactIds));
  }
}
