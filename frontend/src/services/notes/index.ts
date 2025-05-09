import type { Note, NoteUpdate, NoteCreate } from '@/types/notes';

import { API_BASE_URL } from '..';

export const NOTES_BASE = `${API_BASE_URL}/notes`;

export const notesService = {
  // --- Notes ---
  async getAll(): Promise<Note[]> {
    const res = await fetch(NOTES_BASE);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async getById(id: number): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`);
    if (!res.ok) throw new Error('Note not found');
    return res.json();
  },

  async create(data: NoteCreate): Promise<Note> {
    const res = await fetch(NOTES_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async update(id: number, data: Omit<NoteUpdate, 'id'>): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async delete(id: number): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete note');
    return res.json();
  },

  async linkToArtifacts(id: number, artifactIds: number[]): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifactIds }),
    });

    if (!res.ok) {
      throw new Error('Failed to link note to artifacts');
    }
    return res.json();
  },

  async unlinkFromArtifacts(id: number, artifactIds: number[]): Promise<Note> {
    const res = await fetch(`${NOTES_BASE}/${id}/link`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifactIds }),
    });

    if (!res.ok) {
      throw new Error('Failed to unlink artifacts from note');
    }

    return res.json();
  },

  async generateAutoComplete(id: number): Promise<string> {
    const res = await fetch(`${NOTES_BASE}/${id}/autocomplete`);

    if (!res.ok) {
      throw new Error('Failed to generate autocomplete');
    }

    return res.text();
  },
};
