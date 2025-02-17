import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useSearchNotes = (embedding: number[]) => {
  return useQuery({
    queryKey: ["search-notes", embedding],
    queryFn: async () => {
      const result = await db.select(
        "SELECT rowid, *, vss_distance(embedding, $1) as similarity FROM notes ORDER BY similarity ASC LIMIT 5",
        [embedding],
      );
      return result;
    },
    enabled: !!embedding,
  });
};
