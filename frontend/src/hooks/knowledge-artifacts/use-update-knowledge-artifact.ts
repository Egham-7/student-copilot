import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { KnowledgeArtifactCreate } from '@/types/knowledge-artifacts';
import { knowledgeArtifactsService } from '@/services/knowledge-artifacts';
import { toast } from 'sonner';

export function useUpdateKnowledgeArtifact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: KnowledgeArtifactCreate }) =>
      knowledgeArtifactsService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['knowledge-artifacts', data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['knowledge-artifacts', variables.id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
