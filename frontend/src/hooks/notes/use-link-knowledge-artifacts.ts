import { useQueryClient, useMutation } from '@tanstack/react-query';
import { notesService } from '@/services/notes';
import { toast } from 'sonner';

export function useLinkKnowledgeArtifacts(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artifactIds: number[]) =>
      notesService.linkToArtifacts(noteId, artifactIds),
    onSuccess: (_, artifactIds) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', noteId] });
      artifactIds.forEach((artifactId) => {
        queryClient.invalidateQueries({
          queryKey: ['knowledge-artifacts', artifactId],
        });
      });
    },

    onError(error) {
      toast.error(error.message);
    },
  });
}
