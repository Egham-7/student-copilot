import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useDeleteNoteContext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, noteId }: { id: number; noteId: number }) => {
      return await db.execute("DELETE FROM note_context WHERE rowid = $1", [
        id,
      ]);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["noteContext", variables.noteId],
      });
    },
  });
};
