import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import { toast } from "sonner";
import { useSupabaseSession } from "../auth/use-supabase-session";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async (id: number) => {
      if (isLoading) return;

      if (error) throw new Error("Error fetching session.");

      const authToken = session?.access_token;

      if (!authToken) throw new Error("Auth token not found.");

      await notesService.delete(id, session.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
