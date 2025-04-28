import { useQuery } from '@tanstack/react-query';
import type { KnowledgeArtifact } from '@/types/knowledge-artifacts';
import { knowledgeArtifactsService } from '@/services/knowledge-artifacts';

export function useKnowledgeArtifacts(userId: string) {
  return useQuery<KnowledgeArtifact[]>({
    queryKey: ['knowledge-artifacts', userId],
    queryFn: () => knowledgeArtifactsService.getAll(userId),
    enabled: !!userId,
  });
}
