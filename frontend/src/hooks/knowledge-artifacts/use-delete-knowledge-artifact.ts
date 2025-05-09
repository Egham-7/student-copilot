import { useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeArtifactsService } from '@/services/knowledge-artifacts';
import { useSupabaseSession } from '../auth/use-supabase-session';
import { toast } from 'sonner';

export function useDeleteKnowledgeArtifact() {
  const queryClient = useQueryClient();
  const { session } = useSupabaseSession();
  return useMutation({
    mutationFn: (id: number) => knowledgeArtifactsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledge-artifacts', session?.user.id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
