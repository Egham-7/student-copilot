import type { Note, NoteUpdate, NoteCreate } from "@/types/notes";

import { API_BASE_URL } from "..";

export const NOTES_BASE = `${API_BASE_URL}/notes`;

export const notesService = {
  // --- Notes ---
  async getAll(authToken: string): Promise<Note[]> {
    const res = await fetch(NOTES_BASE, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch notes");
    return res.json();
  },

  async getById(id: number, authToken: string): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Note not found");
    return res.json();
  },

  async create(data: NoteCreate, authToken: string): Promise<Note> {
    const res = await fetch(NOTES_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create note");
    return res.json();
  },

  async update(
    id: number,
    data: Omit<NoteUpdate, "id">,
    authToken: string,
  ): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update note");
    return res.json();
  },

  async delete(id: number, authToken: string): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete note");
    return res.json();
  },

  async linkToArtifacts(
    id: number,
    artifactIds: number[],
    authToken: string,
  ): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ artifactIds }),
    });

    if (!res.ok) {
      throw new Error("Failed to link note to artifacts");
    }
    return res.json();
  },

  async unlinkFromArtifacts(
    id: number,
    artifactIds: number[],
    authToken: string,
  ): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}/link`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ artifactIds }),
    });

    if (!res.ok) {
      throw new Error("Failed to unlink artifacts from note");
    }

    return res.json();
  },

  async generateAutoComplete(id: number, authToken: string): Promise<string> {
    const res = await fetch(`${NOTES_BASE}/${id}/autocomplete`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to generate autocomplete");
    }

    return res.text();
  },
};
