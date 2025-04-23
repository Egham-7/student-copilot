import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Note } from "@/lib/models/note";

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      // Using specific column names instead of *
      const result = await db.select(`
        SELECT 
          id, 
          title, 
          content, 
          created_at, 
          updated_at 
        FROM notes 
        ORDER BY created_at DESC
      `);

      return result as Note[];
    },
  });
};
