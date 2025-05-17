import { useQueryClient, useMutation } from "@tanstack/react-query";
import { knowledgeArtifactsService } from "@/services/knowledge-artifacts";
import { toast } from "sonner";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import type { KnowledgeArtifactCreate } from "@/types/knowledge-artifacts";

export const useCreateKnowledgeArtifact = () => {
  const queryClient = useQueryClient();
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async (data: KnowledgeArtifactCreate) => {
      if (isLoading) return;
      if (error) throw new Error("Failed to fetch user session.");

      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");

      return await knowledgeArtifactsService.create(data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-artifacts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
