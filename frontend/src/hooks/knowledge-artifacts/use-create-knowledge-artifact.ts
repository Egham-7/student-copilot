import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { KnowledgeArtifactCreate } from '@/types/knowledge-artifacts';
import { knowledgeArtifactsService } from '@/services/knowledge-artifacts';
import { toast } from 'sonner';

export function useCreateKnowledgeArtifact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: KnowledgeArtifactCreate) =>
      knowledgeArtifactsService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['knowledge-artifacts', data.userId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
