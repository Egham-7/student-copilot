import { useQueryClient, useMutation } from "@tanstack/react-query";
import { knowledgeArtifactsService } from "@/services/knowledge-artifacts";
import { toast } from "sonner";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import type { KnowledgeArtifactUpdate } from "@/types/knowledge-artifacts";

export const useUpdateKnowledgeArtifact = (id: number) => {
  const queryClient = useQueryClient();
  const { session, isLoading, error } = useSupabaseSession();

  return useMutation({
    mutationFn: async (data: Omit<KnowledgeArtifactUpdate, "id">) => {
      if (isLoading) return;
      if (error) throw new Error("Failed to fetch user session.");

      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");

      return await knowledgeArtifactsService.update(id, data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-artifacts"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-artifacts", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
