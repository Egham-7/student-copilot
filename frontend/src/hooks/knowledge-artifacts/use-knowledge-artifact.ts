import { useQuery } from "@tanstack/react-query";
import { knowledgeArtifactsService } from "@/services/knowledge-artifacts";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";

export const useGetKnowledgeArtifact = (id: number) => {
  const { session, isLoading, error } = useSupabaseSession();

  return useQuery({
    queryKey: ["knowledge-artifacts", id],
    queryFn: async () => {
      if (isLoading) return null;
      if (error) throw new Error("Failed to fetch user session.");

      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");

      return await knowledgeArtifactsService.getById(id, authToken);
    },
    enabled: !!session?.access_token,
  });
};
