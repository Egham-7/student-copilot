import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

// Query key for session
const SESSION_QUERY_KEY = ["supabase-session"];

export function useSupabaseSession() {
  const queryClient = useQueryClient();

  // Set up the query for fetching session
  const {
    data: session,
    isLoading,
    error,
  } = useQuery<Session | null, Error>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      return data.session;
    },
  });

  // Set up auth state change listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Update query cache when auth state changes
      queryClient.setQueryData(SESSION_QUERY_KEY, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    session,
    isLoading,
    error,
  };
}
