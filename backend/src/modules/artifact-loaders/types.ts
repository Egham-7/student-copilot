import { NewKnowledgeArtifactChunk } from "@/types/knowledge-artifacts";

export interface ArtifactLoader {
  loadAndChunk(
    artifactId: number,
    filePath: string,
  ): Promise<NewKnowledgeArtifactChunk[]>;
}
