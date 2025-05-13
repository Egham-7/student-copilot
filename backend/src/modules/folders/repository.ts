import { db } from "@/db";
import { folders, notes } from "@/db/schema";
import { NewFolder, UpdateFolder } from "@/types/folders";
import { eq, and, isNull } from "drizzle-orm";

export class FoldersRepository {
  async findAll() {
    return db.select().from(folders);
  }

  async findByUserId(userId: string) {
    return db.select().from(folders).where(eq(folders.userId, userId));
  }

  async findById(id: number) {
    return db.select().from(folders).where(eq(folders.id, id));
  }

  async findRootFolders(userId: string) {
    return db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, userId), isNull(folders.parentId)));
  }

  async findSubfolders(parentId: number) {
    return db.select().from(folders).where(eq(folders.parentId, parentId));
  }

  async create(data: NewFolder) {
    return db.insert(folders).values(data).returning();
  }

  async update(id: number, data: UpdateFolder) {
    return db.update(folders).set(data).where(eq(folders.id, id)).returning();
  }

  async delete(id: number) {
    // Note: Child folders are automatically deleted due to CASCADE constraint
    return db.delete(folders).where(eq(folders.id, id)).returning();
  }

  async findNotesByFolderId(folderId: number) {
    return db.select().from(notes).where(eq(notes.folderId, folderId));
  }
}
