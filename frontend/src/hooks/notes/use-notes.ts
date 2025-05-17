import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { notesService } from "@/services/notes";
import { useSupabaseSession } from "../auth/use-supabase-session";

export const useNotes = () => {
  const { session, isLoading, error } = useSupabaseSession();
  return useQuery<Note[] | undefined>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (isLoading) return;

      if (error) throw new Error("Failed to fetch user session.");

      const authToken = session?.access_token;

      if (!authToken) throw new Error("Failed to fetch auth token.");

      return notesService.getAll(authToken);
    },
  });
};
