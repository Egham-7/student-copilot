import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { PartialBlock } from "@blocknote/core";
import { notesService } from "@/services/notes";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      embedding,
    }: {
      id: number;
      title: string;
      content: PartialBlock[];
      embedding?: number[] | null;
    }) => {
      // Call the service to update the note
      return await notesService.update(id, {
        title,
        content,
        embedding,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
    },
  });
};
