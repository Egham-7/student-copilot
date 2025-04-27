// src/services/notesService.ts

import type { Note, NoteForm } from "@/types/notes";

import { API_BASE_URL } from "..";

const NOTES_BASE = `${API_BASE_URL}/notes`;

export const notesService = {
  // --- Notes ---
  async getAll(): Promise<Note[]> {
    const res = await fetch(NOTES_BASE);
    if (!res.ok) throw new Error("Failed to fetch notes");
    return res.json();
  },

  async getById(id: number): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`);
    if (!res.ok) throw new Error("Note not found");
    return res.json();
  },

  async create(data: NoteForm): Promise<Note> {
    const res = await fetch(NOTES_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create note");
    return res.json();
  },

  async update(id: number, data: NoteForm): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update note");
    return res.json();
  },

  async delete(id: number): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete note");
    return res.json();
  },
};
