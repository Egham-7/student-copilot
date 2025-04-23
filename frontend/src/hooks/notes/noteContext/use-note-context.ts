import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useNoteContext = (noteId: number) => {
  return useQuery({
    queryKey: ["noteContext", noteId],
    queryFn: async () => {
      const result = await db.select(
        "SELECT rowid, * FROM note_context WHERE note_id = $1 ORDER BY created_at DESC",
        [noteId],
      );
      return result;
    },
  });
};
