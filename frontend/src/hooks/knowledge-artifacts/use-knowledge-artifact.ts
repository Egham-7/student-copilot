import { useQuery } from "@tanstack/react-query";
import type { KnowledgeArtifact } from "@/types/knowledge-artifacts";
import { knowledgeArtifactsService } from "@/services/knowledge-artifacts";

export function useKnowledgeArtifact(id: number) {
  return useQuery<KnowledgeArtifact>({
    queryKey: ["knowledge-artifacts", id],
    queryFn: () => knowledgeArtifactsService.getById(id),
    enabled: !!id,
  });
}
