import { useQuery } from "@tanstack/react-query";
import { knowledgeArtifactsService } from "@/services/knowledge-artifacts";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";

export const useGetKnowledgeArtifacts = (userId: string) => {
  const { session, isLoading, error } = useSupabaseSession();

  return useQuery({
    queryKey: ["knowledge-artifacts", userId],
    queryFn: async () => {
      if (isLoading) return [];
      if (error) throw new Error("Failed to fetch user session.");

      const authToken = session?.access_token;
      if (!authToken) throw new Error("Failed to fetch auth token.");

      return await knowledgeArtifactsService.getAll(userId, authToken);
    },
    enabled: !!session?.access_token,
  });
};
