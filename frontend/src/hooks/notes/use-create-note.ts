import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { PartialBlock } from "@blocknote/core";
import { notesService } from "@/services/notes";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      embedding,
    }: {
      title: string;
      content: PartialBlock[];
      embedding?: number[] | null;
    }) => {
      const note = await notesService.create({
        title,
        content,
        embedding,
      });
      return note.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
