import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Note } from "@/lib/models/note";

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const result = await db.select(
        "SELECT rowid, * FROM notes ORDER BY created_at DESC",
      );
      return result as Note[];
    },
  });
};
