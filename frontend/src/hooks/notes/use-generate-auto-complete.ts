import { useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";

export function useGenerateAutoComplete() {
  return useMutation({
    mutationKey: ["generateAutoComplete"],
    mutationFn: async (noteId: number) => {
      return await notesService.generateAutoComplete(noteId);
    },
  });
}
