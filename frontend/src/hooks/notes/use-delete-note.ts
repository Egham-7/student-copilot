import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Use the service, which handles deleting the note (and, on the backend, any cascading deletes)
      await notesService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
