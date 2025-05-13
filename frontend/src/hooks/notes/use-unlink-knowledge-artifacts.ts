import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService } from "@/services/notes";

export function useUnlinkKnowledgeArtifacts(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artifactIds: number[]) =>
      notesService.unlinkFromArtifacts(noteId, artifactIds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", noteId] });
    },
  });
}
