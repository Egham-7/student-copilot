import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import { toast } from "sonner";
import { useSupabaseSession } from "../auth/use-supabase-session";
import type { NoteUpdate } from "@/types/notes";

export function useUpdateNote(id: number) {
  const queryClient = useQueryClient();
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async (data: Omit<NoteUpdate, "id">) => {
      if (isLoading) return;
      if (error) throw new Error("Failed to fetch user session.");
      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");
      return await notesService.update(id, data, authToken);
    },

    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["notes", id], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}
