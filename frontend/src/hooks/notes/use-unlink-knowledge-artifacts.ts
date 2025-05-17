import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import { toast } from "sonner";
import { useSupabaseSession } from "../auth/use-supabase-session";
import type { Note } from "@/types/notes";

export function useUnlinkKnowledgeArtifacts(noteId: number) {
  const queryClient = useQueryClient();
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async (artifactIds: number[]) => {
      if (isLoading) return;
      if (error) throw new Error("Failed to fetch user session.");
      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");
      return await notesService.unlinkFromArtifacts(
        noteId,
        artifactIds,
        authToken,
      );
    },

    onMutate: async (artifactIds: number[]) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notes", noteId] });

      // Snapshot the previous value
      const previousNote = queryClient.getQueryData<Note>(["notes", noteId]);

      // Optimistically update the note
      if (previousNote) {
        queryClient.setQueryData<Note>(["notes", noteId], {
          ...previousNote,
          artifacts: previousNote.artifacts.filter(
            (artifact) => !artifactIds.includes(artifact.id),
          ),
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
