import type {
  KnowledgeArtifact,
  KnowledgeArtifactCreate,
  KnowledgeArtifactUpdate,
} from '@/types/knowledge-artifacts';

import { API_BASE_URL } from '..';

const ARTIFACTS_BASE = `${API_BASE_URL}/knowledge-artifacts`;

export const knowledgeArtifactsService = {
  async getAll(userId: string): Promise<KnowledgeArtifact[]> {
    const res = await fetch(`${ARTIFACTS_BASE}?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch artifacts');
    return res.json();
  },

  async getById(id: number): Promise<KnowledgeArtifact> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`);
    if (!res.ok) throw new Error('Artifact not found');
    return res.json();
  },

  async create(data: KnowledgeArtifactCreate): Promise<KnowledgeArtifact> {
    const res = await fetch(ARTIFACTS_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create artifact');
    return res.json();
  },

  async update(
    id: number,
    data: Omit<KnowledgeArtifactUpdate, 'id'>,
  ): Promise<KnowledgeArtifact> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        filePath: data.filePath,
        fileType: data.fileType,
        updatedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error('Failed to update artifact');
    return res.json();
  },

  async delete(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete artifact');
    return res.json();
  },

  async getAllByNoteId(noteId: number): Promise<KnowledgeArtifact[]> {
    const res = await fetch(`${ARTIFACTS_BASE}/note/${noteId}`);
    if (!res.ok) throw new Error('Failed to fetch artifacts by note');
    return res.json();
  },

  async presignUploadUrl(params: {
    key: string;
    contentType: string;
  }): Promise<{ url: string }> {
    const res = await fetch(`${ARTIFACTS_BASE}/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate presigned URL');
    return res.json();
  },
};
