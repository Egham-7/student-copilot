import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useSearchNoteContext = (embedding: number[]) => {
  return useQuery({
    queryKey: ["search-noteContext", embedding],
    queryFn: async () => {
      const result = await db.select(
        "SELECT note_context.rowid, note_context.*, notes.title as note_title, vss_distance(note_context.embedding, $1) as similarity FROM note_context JOIN notes ON note_context.note_id = notes.rowid ORDER BY similarity ASC LIMIT 5",
        [embedding],
      );
      return result;
    },
    enabled: !!embedding,
  });
};
