import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Note } from "@/lib/models/note";
import { QueryResult } from "@tauri-apps/plugin-sql";

export const useNote = (id: number) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const result = (await db.select(
        "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = $1 LIMIT 1",
        [id],
      )) as QueryResult[];

      if (!result.length) {
        throw new Error(`Note with id ${id} not found`);
      }

      return result[0] as unknown as Note;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};
