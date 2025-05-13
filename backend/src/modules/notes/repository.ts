import { db } from "@/db";
import { notes, notesToKnowledgeArtifacts } from "@/db/schema";
import { NewNote, UpdateNote } from "@/types/notes";
import { eq, and, inArray } from "drizzle-orm";

export class NotesRepository {
  async findAll() {
    return db.select().from(notes);
  }

  async findById(id: number) {
    return db.select().from(notes).where(eq(notes.id, id));
  }

  async create(data: NewNote) {
    return db.insert(notes).values(data).returning();
  }

  async update(id: number, data: UpdateNote) {
    return db.update(notes).set(data).where(eq(notes.id, id)).returning();
  }

  async delete(id: number) {
    return db.delete(notes).where(eq(notes.id, id)).returning();
  }

  async linkArtifacts(noteId: number, artifactIds: number[]) {
    if (!artifactIds.length) return [];

    const values = artifactIds.map((artifactId) => ({
      noteId,
      artifactId,
    }));

    return db.insert(notesToKnowledgeArtifacts).values(values).returning();
  }

  async unlinkArtifacts(noteId: number, artifactIds: number[]) {
    if (!artifactIds.length) return [];

    return db
      .delete(notesToKnowledgeArtifacts)
      .where(
        and(
          eq(notesToKnowledgeArtifacts.noteId, noteId),
          inArray(notesToKnowledgeArtifacts.artifactId, artifactIds),
        ),
      )
      .returning();
  }
}
