import { useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import { useSupabaseSession } from "../auth/use-supabase-session";

export function useGenerateAutoComplete() {
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationKey: ["generateAutoComplete"],
    mutationFn: async (noteId: number) => {
      if (isLoading) return;

      if (error) throw new Error("Error fetching session.");

      const authToken = session?.access_token;

      if (!authToken) throw new Error("Error getting auth token.");

      return await notesService.generateAutoComplete(noteId, authToken);
    },
  });
}
