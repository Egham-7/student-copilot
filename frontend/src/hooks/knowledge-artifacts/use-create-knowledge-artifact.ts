import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { KnowledgeArtifactCreate } from '@/types/knowledge-artifacts';
import { knowledgeArtifactsService } from '@/services/knowledge-artifacts';

export function useCreateKnowledgeArtifact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: KnowledgeArtifactCreate) =>
      knowledgeArtifactsService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['knowledge-artifact', data.userId],
      });
    },
  });
}
