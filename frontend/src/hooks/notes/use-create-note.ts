import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import { NoteCreate } from "@/types/notes";
import { toast } from "sonner";
import { useSupabaseSession } from "../auth/use-supabase-session";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async ({ title, content, userId }: NoteCreate) => {
      if (isLoading || error) return;

      const authToken = session?.access_token;

      if (!authToken) throw new Error("Failed to get auth token");

      const note = await notesService.create(
        {
          title,
          content,
          userId,
        },
        authToken,
      );
      return note.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
