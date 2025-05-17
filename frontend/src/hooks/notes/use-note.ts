import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { notesService } from "@/services/notes";
import { useSupabaseSession } from "../auth/use-supabase-session";

export const useNote = (id: number) => {
  const { session, isLoading, error } = useSupabaseSession();
  return useQuery<Note | undefined>({
    queryKey: ["notes", id],
    queryFn: async () => {
      if (!id) throw new Error("No note id provided");

      if (isLoading) return;

      if (error) throw new Error("Error fetching user session.");

      const authToken = session?.access_token;

      if (!authToken) throw new Error("Error fetching auth token.");

      return await notesService.getById(id, authToken);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};
