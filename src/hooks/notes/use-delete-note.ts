import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // First delete all associated context records
      await db.execute("DELETE FROM note_context WHERE note_id = $1", [id]);
      // Then delete the note
      await db.execute("DELETE FROM notes WHERE id = $1", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
