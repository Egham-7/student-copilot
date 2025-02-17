import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Note } from "@/lib/models/note";

export const useNote = (id: number) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const result = await db.select(
        "SELECT rowid, * FROM notes WHERE rowid = $1",
        [id],
      );
      const rows = result as Note[];

      return rows[0];
    },
  });
};
