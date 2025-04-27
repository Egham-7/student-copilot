// src/modules/notes/notes.service.ts
import { NotesRepository } from "./repository";

export class NotesService {
  constructor(private repo: NotesRepository) {}

  async getAllNotes() {
    return this.repo.findAll();
  }

  async getNoteById(id: number) {
    const note = await this.repo.findById(id);
    if (!note.length) throw new Error("Note not found");
    return note[0];
  }

  async createNote(data: any) {
    const [created] = await this.repo.create(data);
    return created;
  }

  async updateNote(id: number, data: any) {
    const [updated] = await this.repo.update(id, data);
    if (!updated) throw new Error("Note not found");
    return updated;
  }

  async deleteNote(id: number) {
    const [deleted] = await this.repo.delete(id);
    if (!deleted) throw new Error("Note not found");
    return deleted;
  }
}
