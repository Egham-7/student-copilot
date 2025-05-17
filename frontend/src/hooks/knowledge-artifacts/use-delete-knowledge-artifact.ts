import { useQueryClient, useMutation } from "@tanstack/react-query";
import { knowledgeArtifactsService } from "@/services/knowledge-artifacts";
import { toast } from "sonner";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";

export const useDeleteKnowledgeArtifact = () => {
  const queryClient = useQueryClient();
  const { session } = useSupabaseSession();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!session?.access_token) {
        throw new Error("No authentication token available");
      }
      await knowledgeArtifactsService.delete(id, session.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-artifacts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
