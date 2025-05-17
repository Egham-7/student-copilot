import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import { toast } from "sonner";
import { useSupabaseSession } from "../auth/use-supabase-session";
import type { Note } from "@/types/notes";
import type { KnowledgeArtifact } from "@/types/knowledge-artifacts";

export function useLinkKnowledgeArtifacts(noteId: number) {
  const queryClient = useQueryClient();
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async (artifactIds: number[]) => {
      if (isLoading) return;
      if (error) throw new Error("Failed to fetch user session.");
      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");
      return await notesService.linkToArtifacts(noteId, artifactIds, authToken);
    },

    onMutate: async (artifactIds: number[]) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notes", noteId] });

      // Snapshot the previous value
      const previousNote = queryClient.getQueryData<Note>(["notes", noteId]);

      // Get the existing artifacts data for the artifacts being linked
      const existingArtifacts = queryClient.getQueriesData<KnowledgeArtifact>({
        queryKey: ["knowledge-artifacts"],
      });

      // Optimistically update the note
      if (previousNote) {
        const newArtifacts = artifactIds
          .map((id) => {
            const artifactData = existingArtifacts.find(
              ([, data]) => data?.id === id,
            )?.[1];
            return artifactData;
          })
          .filter(
            (artifact): artifact is KnowledgeArtifact => artifact !== undefined,
          );

        queryClient.setQueryData<Note>(["notes", noteId], {
          ...previousNote,
          artifacts: [...previousNote.artifacts, ...newArtifacts],
        });
      }

      // Return context with the snapshotted value
      return { previousNote };
    },

    onSuccess: (updatedNote, artifactIds) => {
      // Update all related queries with the correct data
      queryClient.setQueryData(["notes", noteId], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      artifactIds.forEach((artifactId) => {
        queryClient.invalidateQueries({
          queryKey: ["knowledge-artifacts", artifactId],
        });
      });
    },

    onError: (error, _, context) => {
      // Rollback to the previous value on error
      if (context?.previousNote) {
        queryClient.setQueryData(["notes", noteId], context.previousNote);
      }
      toast.error(error.message);
    },

    // Always refetch after error or success to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", noteId] });
    },
  });
}
