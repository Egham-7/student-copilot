import type {
  KnowledgeArtifact,
  KnowledgeArtifactForm,
} from "@/types/knowledge-artifacts";

import { API_BASE_URL } from "..";

const ARTIFACTS_BASE = `${API_BASE_URL}/knowledge-artifacts`;

export class KnowledgeArtifactsService {
  static async getAll(): Promise<KnowledgeArtifact[]> {
    const res = await fetch(ARTIFACTS_BASE);
    if (!res.ok) throw new Error("Failed to fetch artifacts");
    return res.json();
  }

  static async getById(id: number): Promise<KnowledgeArtifact> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`);
    if (!res.ok) throw new Error("Artifact not found");
    return res.json();
  }

  static async create(data: KnowledgeArtifactForm): Promise<KnowledgeArtifact> {
    const res = await fetch(ARTIFACTS_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create artifact");
    return res.json();
  }

  static async update(
    id: number,
    data: KnowledgeArtifactForm,
  ): Promise<KnowledgeArtifact> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update artifact");
    return res.json();
  }

  static async delete(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${ARTIFACTS_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete artifact");
    return res.json();
  }
}
