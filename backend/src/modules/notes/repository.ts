// src/modules/notes/notes.repository.ts
import { db } from "@/db";
import { notes, knowledgeArtifacts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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
}
