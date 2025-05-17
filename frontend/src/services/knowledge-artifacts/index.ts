import type {
  KnowledgeArtifact,
  KnowledgeArtifactCreate,
  KnowledgeArtifactUpdate,
} from "@/types/knowledge-artifacts";

import { API_BASE_URL } from "..";

const ARTIFACTS_BASE = `${API_BASE_URL}/knowledge-artifacts`;

export const knowledgeArtifactsService = {
  async getAll(
    userId: string,
    authToken: string,
  ): Promise<KnowledgeArtifact[]> {
    const res = await fetch(`${ARTIFACTS_BASE}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch artifacts");
    return res.json();
  },

  async getById(id: number, authToken: string): Promise<KnowledgeArtifact> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Artifact not found");
    return res.json();
  },

  async create(
    data: KnowledgeArtifactCreate,
    authToken: string,
  ): Promise<KnowledgeArtifact> {
    const res = await fetch(ARTIFACTS_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create artifact");
    return res.json();
  },

  async update(
    id: number,
    data: Omit<KnowledgeArtifactUpdate, "id">,
    authToken: string,
  ): Promise<KnowledgeArtifact> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update artifact");
    return res.json();
  },

  async delete(id: number, authToken: string): Promise<{ success: boolean }> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete artifact");
    return res.json();
  },

  async getAllByNoteId(
    noteId: number,
    authToken: string,
  ): Promise<KnowledgeArtifact[]> {
    const res = await fetch(`${ARTIFACTS_BASE}/note/${noteId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch artifacts by note");
    return res.json();
  },
};
