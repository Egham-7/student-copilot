import { db } from "@/db";
import { notes, notesToKnowledgeArtifacts } from "@/db/schema";
import { eq } from "drizzle-orm";

export class NotesRepository {
  async findAll() {
    return db.select().from(notes);
  }

  async findById(id: number) {
    return db.select().from(notes).where(eq(notes.id, id));
  }

  async create(data: any) {
    return db.insert(notes).values(data).returning();
  }

  async update(id: number, data: any) {
    return db.update(notes).set(data).where(eq(notes.id, id)).returning();
  }

  async delete(id: number) {
    return db.delete(notes).where(eq(notes.id, id)).returning();
  }

  async linkToArtifacts(noteId: number, artifactIds: number[]) {
    if (!artifactIds.length) return [];

    const values = artifactIds.map((artifactId) => ({
      noteId,
      artifactId,
    }));

    return db.insert(notesToKnowledgeArtifacts).values(values).returning();
  }
}
